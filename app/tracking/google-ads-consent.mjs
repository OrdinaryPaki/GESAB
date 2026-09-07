import { GOOGLE_ADS_TAG_ID } from "./google-ads-config.mjs";
import { captureLeadAttribution, clearLeadAttribution } from "./lead-attribution.mjs";

export const CONSENT_KEY = "gesab.ads-consent.v1";
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const TAG_ID = GOOGLE_ADS_TAG_ID;
const activeChoices = new WeakMap();
const DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};

function readChoice(storage, now) {
  try {
    const choice = JSON.parse(storage.getItem(CONSENT_KEY));
    if (typeof choice?.allowed !== "boolean" || !Number.isFinite(choice.savedAt)) return null;
    const age = now - choice.savedAt;
    return age >= 0 && age < MAX_AGE ? choice.allowed : null;
  } catch {
    return null;
  }
}

export function hasAdsConsent(window, now = Date.now()) {
  const current = activeChoices.get(window);
  if (current) {
    const age = now - current.savedAt;
    return current.allowed && age >= 0 && age < MAX_AGE;
  }
  try { return readChoice(window.localStorage, now) === true; } catch { return false; }
}

function clearAdvertisingCookies(document, hostname) {
  const labels = hostname.split(".");
  const domains = ["", ...labels.map((_, index) => labels.slice(index).join("."))];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (!name.startsWith("_gcl_")) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/;${domain ? ` Domain=${domain};` : ""}`;
    }
  }
}

// One controller per page. No requests to Google until explicit consent.
export function createAdsConsentController(window, document, now = Date.now) {
  let loaded = false;

  function loadTag() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", { ...DENIED });
    window.gtag("consent", "update", {
      ...DENIED,
      ad_storage: "granted",
      ad_user_data: "granted",
    });
    window.gtag("js", new Date(now()));
    window.gtag("config", TAG_ID, {
      allow_ad_personalization_signals: false,
      cookie_path: "/",
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${TAG_ID}`;
    document.head.appendChild(script);
  }

  function restore() {
    let choice = null;
    try { choice = readChoice(window.localStorage, now()); } catch { /* Storage may be disabled. */ }
    if (choice === true) {
      captureLeadAttribution(window, { allowed: true, now: now() });
      loadTag();
    } else {
      clearLeadAttribution(window);
      clearAdvertisingCookies(document, window.location.hostname);
    }
    return choice;
  }

  function choose(allowed) {
    if (typeof allowed !== "boolean") return;
    activeChoices.set(window, { allowed, savedAt: now() });
    if (!allowed) {
      // Remove a stale grant before writing: storage quota must never reinstate it.
      try { window.localStorage.removeItem(CONSENT_KEY); } catch { /* Try replacement below. */ }
    }
    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ allowed, savedAt: now() }));
    } catch { /* The choice still applies to the current page if storage is blocked. */ }
    if (allowed) {
      captureLeadAttribution(window, { allowed: true, now: now() });
      loadTag();
    } else {
      clearLeadAttribution(window);
      if (loaded) window.gtag("consent", "update", { ...DENIED });
      clearAdvertisingCookies(document, window.location.hostname);
      try {
        if (readChoice(window.localStorage, now()) === true) return false;
      } catch { /* Inaccessible storage cannot restore an old grant on reload. */ }
      // Reload to remove the already executed third-party script completely.
      if (loaded) window.location.reload();
    }
    return true;
  }

  return { restore, choose };
}
