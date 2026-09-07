import { captureLeadAttribution, normalizeLeadAttribution } from './lead-attribution.mjs';
import { captureTrafficSource, normalizeTrafficSource } from './traffic-source.mjs';
import { hasAdsConsent } from './google-ads-consent.mjs';

// Current visit and an earlier consented ad click have different meanings.
export function captureContactAttribution(windowObject) {
  return {...captureLeadAttribution(windowObject,{allowed:hasAdsConsent(windowObject)}),
    traffic:captureTrafficSource(windowObject)};
}
export function normalizeContactAttribution(raw, options) {
  const ads = normalizeLeadAttribution(raw, options);
  const traffic = normalizeTrafficSource(raw?.traffic);
  return {...ads,...(traffic.channel ? {traffic} : {})};
}
