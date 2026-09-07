import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import { isUuid, validateProgressBatch } from './progress-validation.mjs';

const MAX_BYTES = 512 * 1024;
const PUBLIC_FIELDS = ['submission_id','created_at','inquiry','attribution','status',
  'next_contact','owner','notes','booked_at','value_sek','email_sent_at'];
const publicLead = lead => Object.fromEntries(PUBLIC_FIELDS.filter(key => key in lead).map(key => [key,lead[key]]));
const response = (body,status=200) => Response.json(body,{status,headers:{'cache-control':'no-store'}});

function authorized(request, secret) {
  const header = request.headers.get('authorization') ?? '';
  if (!header.startsWith('Bearer ') || header.length > 1024) return false;
  const hash = value => createHash('sha256').update(value).digest();
  return timingSafeEqual(hash(header.slice(7)),hash(secret));
}

async function parseBody(request) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return null;
  if (Number(request.headers.get('content-length')) > MAX_BYTES) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks = [];
  let length = 0;
  while (true) {
    const {done,value} = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > MAX_BYTES) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return null; }
}

export async function handleLeadSync(request, {secret,store}) {
  if (typeof secret !== 'string' || secret.length < 32) return response({ok:false,error:'Sync is not configured.'},503);
  if (!authorized(request,secret)) return response({ok:false,error:'Unauthorized.'},401);
  try {
    if (request.method === 'GET') {
      const kind = new URL(request.url).searchParams.get('kind');
      if (kind && kind !== 'phone_clicks') return response({ok:false},400);
      const leaseToken = randomUUID();
      if (kind === 'phone_clicks') {
        const rows = await store.claimSheetPhoneClicks({limit:100,leaseToken});
        const fields = ['event_id','created_at','phone','page','attribution'];
        return response({ok:true,leaseToken,phoneClicks:rows.map(row => Object.fromEntries(fields.map(key => [key,row[key]])))});
      }
      const leads = await store.claimSheetLeads({limit:100,leaseToken});
      return response({ok:true,leaseToken,leads:leads.map(publicLead)});
    }
    if (request.method !== 'POST') return response({ok:false},405);
    const body = await parseBody(request);
    if (body?.action === 'ack' && isUuid(body.leaseToken) && Array.isArray(body.ids)
      && body.ids.length <= 100 && body.ids.every(isUuid)) {
      if (body.kind && body.kind !== 'phone_clicks') return response({ok:false},400);
      if (body.kind === 'phone_clicks') {
        const rows = await store.acknowledgeSheetPhoneClicks({leaseToken:body.leaseToken,ids:body.ids});
        return response({ok:true,ids:rows.map(row=>row.event_id)});
      }
      const rows = await store.acknowledgeSheetLeads({leaseToken:body.leaseToken,ids:body.ids});
      return response({ok:true,ids:rows.map(row=>row.submission_id)});
    }
    if (body?.action === 'progress') {
      const input = body.patches;
      if (Array.isArray(input) && input.length > 0 && input.length <= 100
        && input.every(p => p && isUuid(p.submissionId) && isUuid(p.eventId))
        && new Set(input.map(p=>p.eventId)).size === input.length) {
        const patches = [];
        const rejectedEvents = [];
        for (const patch of input) {
          const valid = validateProgressBatch([patch]);
          if (valid) patches.push(valid[0]);
          else rejectedEvents.push({eventId:patch.eventId,error:'Ogiltig status, datum eller värde.'});
        }
        const result = patches.length ? await store.updateLeadProgressBatch(patches) : {acceptedEventIds:[],leads:[]};
        return response({ok:true,acceptedEventIds:result.acceptedEventIds,
          rejectedEvents,leads:result.leads.map(publicLead)});
      }
    }
    return response({ok:false,error:'Invalid sync request.'},400);
  } catch {
    // No credentials, SQL details, or customer content in responses or logs.
    return response({ok:false,error:'Sync temporarily unavailable.'},503);
  }
}
