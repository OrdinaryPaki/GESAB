import { contactInfo } from '../site-config.js';
import { pageContext } from './marketing-events.mjs';
import { readLeadAttribution } from './lead-attribution.mjs';
import { hasAdsConsent } from './google-ads-consent.mjs';

export const BUSINESS_PHONES = [contactInfo.phonePrimaryInternational, contactInfo.phoneSecondaryInternational];

// A best-effort click record is never evidence of a completed call.
export async function recordPhoneClick({ href, page } = {}, {
  createId = () => globalThis.crypto.randomUUID(),
  getAttribution = () => readLeadAttribution(window, { allowed: hasAdsConsent(window) }),
  fetchImpl = (...args) => fetch(...args),
} = {}) {
  try {
    const phone = typeof href === 'string' && href.startsWith('tel:') ? href.slice(4) : '';
    const safePage = pageContext(page);
    if (!BUSINESS_PHONES.includes(phone) || safePage === 'other') return;
    let attribution = {};
    try { attribution = getAttribution(); } catch { /* Optional storage. */ }
    const payload = { eventId: createId(), phone, page: safePage };
    if (attribution?.consentGranted === true) payload.attribution = attribution;
    await fetchImpl('/api/phone-clicks', { method: 'POST', headers: {'content-type':'application/json'},
      body: JSON.stringify(payload), keepalive: true });
  } catch { /* Dialing must work even when measurement fails. */ }
}
