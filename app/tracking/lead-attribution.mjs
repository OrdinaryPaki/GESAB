import { pageContext } from './marketing-events.mjs';

const STORAGE_KEY = 'gesab:lead-attribution:v1';
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;
const CLOCK_TOLERANCE_MS = 5 * 60 * 1000;
const CLICK_KEYS = ['gclid', 'gbraid', 'wbraid'];
const CAMPAIGN_KEYS = ['campaignid', 'adgroupid', 'creative'];
const LABEL_KEYS = ['utm_source', 'utm_campaign'];
const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function validTimestamp(value, now) {
  if (typeof value !== 'string' || !ISO_TIMESTAMP.test(value)) return false;
  const time = Date.parse(value);
  return Number.isFinite(time) && new Date(time).toISOString() === value
    && time <= now + CLOCK_TOLERANCE_MS && now - time < MAX_AGE_MS;
}

// This is validation of client metadata, not proof of consent or click authenticity.
export function normalizeLeadAttribution(raw, { now = Date.now() } = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || !Number.isFinite(now)
    || raw.consentGranted !== true || !validTimestamp(raw.consentAt, now)
    || !validTimestamp(raw.capturedAt, now)) return {};
  const result = {};
  for (const key of CLICK_KEYS) {
    if (typeof raw[key] === 'string' && /^[A-Za-z0-9_-]{1,512}$/.test(raw[key])) result[key] = raw[key];
  }
  if (!CLICK_KEYS.some(key => result[key])) return {};
  for (const key of CAMPAIGN_KEYS) {
    if (typeof raw[key] === 'string' && /^\d{1,32}$/.test(raw[key])) result[key] = raw[key];
  }
  for (const key of LABEL_KEYS) {
    if (typeof raw[key] === 'string' && raw[key].length > 0 && raw[key].length <= 120
      && !/[\u0000-\u001f\u007f-\u009f]/.test(raw[key])) result[key] = raw[key];
  }
  if (typeof raw.landingPage === 'string') result.landingPage = pageContext(raw.landingPage);
  return { ...result, consentGranted: true, consentAt: raw.consentAt, capturedAt: raw.capturedAt };
}

export function clearLeadAttribution(windowObject) {
  try { windowObject?.localStorage?.removeItem(STORAGE_KEY); } catch { /* Storage can be blocked. */ }
}

export function readLeadAttribution(windowObject, { allowed = false, now = Date.now() } = {}) {
  if (allowed !== true) {
    clearLeadAttribution(windowObject);
    return {};
  }
  try {
    const saved = windowObject?.localStorage?.getItem(STORAGE_KEY);
    if (!saved) return {};
    // Bound parsing work even if another script has corrupted this storage key.
    if (saved.length > 4096) {
      clearLeadAttribution(windowObject);
      return {};
    }
    const result = normalizeLeadAttribution(JSON.parse(saved), { now });
    if (!result.consentGranted) clearLeadAttribution(windowObject);
    return result;
  } catch {
    clearLeadAttribution(windowObject);
    return {};
  }
}

export function captureLeadAttribution(windowObject, { allowed = false, now = Date.now() } = {}) {
  const previous = readLeadAttribution(windowObject, { allowed, now });
  if (allowed !== true || !Number.isFinite(now)) return {};
  try {
    const params = new URLSearchParams(windowObject?.location?.search ?? '');
    const timestamp = new Date(now).toISOString();
    const candidate = { consentGranted: true, consentAt: timestamp, capturedAt: timestamp,
      landingPage: pageContext(windowObject?.location?.pathname ?? '') };
    for (const key of [...CLICK_KEYS, ...CAMPAIGN_KEYS, ...LABEL_KEYS]) {
      // Ambiguous duplicate parameters are discarded rather than picking an arbitrary value.
      const values = params.getAll(key);
      if (values.length === 1) candidate[key] = values[0];
    }
    const result = normalizeLeadAttribution(candidate, { now });
    if (!result.consentGranted) return previous;
    // Preserve all supported IDs from one landing, without combining separate ad clicks.
    // Re-loading the same click must not refresh its retention window or first landing.
    if (CLICK_KEYS.every(key => result[key] === previous[key])) return previous;
    try { windowObject?.localStorage?.setItem(STORAGE_KEY, JSON.stringify(result)); } catch { /* Optional attribution. */ }
    return result;
  } catch {
    return previous;
  }
}
