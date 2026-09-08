import {createHash,createHmac} from 'node:crypto';
import {isIP} from 'node:net';
import {admitContact} from './store.mjs';
import {contactBudgets} from './policy.mjs';

export class AbuseLimitError extends Error {
  constructor(retryAfter) {super('För många försök. Vänta en stund och försök igen, eller ring oss.');this.name='AbuseLimitError';this.retryAfter=Math.max(1,Math.min(86400,Math.ceil(retryAfter)||60));}
}
export function recipientIdentity(email) {
  const normalized=String(email ?? '').trim().toLowerCase();
  const [local,domain]=normalized.split('@');
  // Google's documented mailbox aliases share a budget, but delivery uses the original address.
  if(['gmail.com','googlemail.com'].includes(domain)) return local.split('+')[0].replaceAll('.','')+'@gmail.com';
  return normalized;
}
export function clientNetwork(request,onVercel) {
  if (!onVercel) return 'local';
  // Vercel overwrites this header. Never fall back to caller-supplied forwarded headers.
  const ip=request.headers.get('x-vercel-forwarded-for')?.trim() ?? '';
  if(isIP(ip)===4) return ip;
  if(isIP(ip)!==6) return 'unknown';
  const normalized=new URL('http://['+ip+']/').hostname.slice(1,-1);
  const halves=normalized.split('::'), left=halves[0]?halves[0].split(':'):[], right=halves[1]?halves[1].split(':'):[];
  const groups=halves.length===2 ? [...left,...Array(8-left.length-right.length).fill('0'),...right] : left;
  const words=groups.map(part=>parseInt(part,16));
  if(words.slice(0,5).every(n=>n===0)&&words[5]===65535) return [words[6]>>8,words[6]&255,words[7]>>8,words[7]&255].join('.');
  return words.slice(0,4).map(n=>n.toString(16)).join(':')+'::/64';
}
export function createAbuseGuard({secret,onVercel=false,store={admit:admitContact}}={}) {
  return async function guard(request,kind,payload) {
    if(typeof secret!=='string'||secret.length<32) throw new Error('Abuse protection unavailable');
    const digest=value=>createHmac('sha256',secret).update('gesab-abuse-v1:'+value).digest('hex');
    const eventId=(payload.submissionId ?? payload.eventId)?.toLowerCase();
    const canonical=Object.fromEntries(Object.entries({...payload,submissionId:undefined,eventId:undefined}).filter(([key])=>key!=='attribution').sort(([a],[b])=>a.localeCompare(b)));
    const fingerprint=createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
    const rules=contactBudgets(kind,digest(clientNetwork(request,onVercel)),digest(recipientIdentity(payload.email)));
    const result=await store.admit({kind,eventId,fingerprint,...rules});
    if(result.conflict) {const error=new Error('Event conflict');error.name='ContactConflictError';throw error;}
    if(!result.allowed) throw new AbuseLimitError(result.retry_after);
  };
}
export const enforceContactBudget = (request,kind,payload) => createAbuseGuard({secret:process.env.LEAD_SYNC_SECRET,onVercel:process.env.VERCEL==='1'})(request,kind,payload);
