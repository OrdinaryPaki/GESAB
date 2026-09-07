import { BUSINESS_PHONES } from '../../tracking/phone-clicks.mjs';
import { pageContext } from '../../tracking/marketing-events.mjs';
import { normalizeLeadAttribution } from '../../tracking/lead-attribution.mjs';
import { isUuid } from '../leads/progress-validation.mjs';

const MAX_BYTES = 8192;
const response = (status) => Response.json({ok:status === 202}, {status,headers:{'cache-control':'no-store'}});
async function boundedJson(request) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')
    || Number(request.headers.get('content-length')) > MAX_BYTES) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks = []; let size = 0;
  while (true) {
    const {done,value} = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BYTES) { await reader.cancel(); return null; }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return null; }
}
export async function handlePhoneClick(request, store) {
  if (request.method !== 'POST') return response(405);
  if (request.headers.get('origin') !== new URL(request.url).origin) return response(403);
  try {
    const body = await boundedJson(request);
    if (!body || !isUuid(body.eventId) || !BUSINESS_PHONES.includes(body.phone)
      || typeof body.page !== 'string' || body.page.length > 200 || pageContext(body.page) !== body.page
      || body.page === 'other') return response(400);
    await store.registerPhoneClick({eventId:body.eventId,phone:body.phone,page:body.page,
      attribution:normalizeLeadAttribution(body.attribution)});
    return response(202);
  } catch (error) { return response(error?.name === 'PhoneClickConflictError' ? 409 : 503); }
}
