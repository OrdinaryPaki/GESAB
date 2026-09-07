import { INQUIRY_SOURCES, SERVICE_TITLES } from "../lib/inquiries/constants.mjs";

function serviceName(value) {
  return Object.hasOwn(SERVICE_TITLES, value ?? "") ? value : "unspecified";
}

function formContext({ source, service } = {}) {
  return {
    form: INQUIRY_SOURCES.includes(source) ? source : "unknown",
    service: serviceName(service),
  };
}

export function pageContext(path = "") {
  const pathname = path.split(/[?#]/)[0];
  if (["/", "/about", "/contact", "/cookies", "/galleri", "/service"].includes(pathname)) return pathname;
  const service = pathname.startsWith("/service/") ? serviceName(pathname.slice(9)) : "unspecified";
  return service === "unspecified" ? "other" : `/service/${service}`;
}

// Measurement must never interrupt a form submission or a contact link.
export function safelyMeasure(callback) {
  try { Promise.resolve(callback()).catch(() => {}); } catch { /* Tracking may be blocked. */ }
}

export function createMarketingTracker({ track, gtag, hasConsent, conversionTarget } = {}) {
  function record(name, context) {
    safelyMeasure(() => track?.(name, context));
  }

  return {
    formStarted(payload) {
      record("inquiry_started", formContext(payload));
    },
    inquirySubmitted(payload) {
      record("inquiry_submitted", formContext(payload));
      safelyMeasure(() => {
        if (!/^AW-\d+\/[A-Za-z0-9_-]+$/.test(conversionTarget ?? "")) return;
        if (!payload.submissionId || !hasConsent?.()) return;
        gtag?.("event", "conversion", {
          send_to: conversionTarget,
          transaction_id: payload.submissionId,
        });
      });
    },
    contactClicked({ kind, page } = {}) {
      if (kind !== "phone" && kind !== "email") return;
      record(`${kind}_click`, { page: pageContext(page) });
    },
  };
}
