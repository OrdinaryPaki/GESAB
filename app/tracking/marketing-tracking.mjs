import { track } from "@vercel/analytics";
import { createMarketingTracker } from "./marketing-events.mjs";
import { hasAdsConsent } from "./google-ads-consent.mjs";
import { GOOGLE_ADS_LEAD_TARGET } from "./google-ads-config.mjs";

const tracker = createMarketingTracker({
  track: (name, data) => { if (typeof window !== "undefined") track(name, data); },
  gtag: (...args) => { if (typeof window !== "undefined") window.gtag?.(...args); },
  hasConsent: () => typeof window !== "undefined" && hasAdsConsent(window),
  conversionTarget: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_TARGET ?? GOOGLE_ADS_LEAD_TARGET,
});

export const trackFormStarted = tracker.formStarted;
export const trackInquirySubmitted = tracker.inquirySubmitted;
export const trackContactClicked = tracker.contactClicked;
