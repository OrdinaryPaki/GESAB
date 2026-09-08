import { trackFormStarted, trackInquirySubmitted } from "../../tracking/marketing-tracking.mjs";
import { safelyMeasure } from "../../tracking/marketing-events.mjs";
import { captureContactAttribution } from "../../tracking/contact-attribution.mjs";

const PUBLIC_ERROR =
  "Din förfrågan kunde inte skickas. Försök igen eller kontakta oss via telefon.";

export class InquirySubmissionError extends Error {
  constructor(message = PUBLIC_ERROR) {
    super(message);
    this.name = "InquirySubmissionError";
  }
}

export function createSubmissionId() {
  return globalThis.crypto.randomUUID();
}

function currentAttribution() {
  if (typeof window === "undefined") return {};
  return captureContactAttribution(window);
}

export function createInquirySubmissionSession({
  createId = createSubmissionId,
  submitImpl = submitInquiry,
  onStart = trackFormStarted,
  onSuccess = trackInquirySubmitted,
} = {}) {
  let submissionId;
  let started = false;
  let countedId;

  return {
    start({ source, service }) {
      if (started) return;
      started = true;
      safelyMeasure(() => onStart({ source, service }));
    },
    reset() {
      submissionId = undefined;
      countedId = undefined;
      started = false;
    },
    invalidate() {
      submissionId = undefined;
    },
    async submit(payload) {
      submissionId ??= createId();
      const id = submissionId;
      const result = await submitImpl(payload, { submissionId: id });
      if (result?.ok === true && countedId !== id) {
        countedId = id;
        safelyMeasure(() => onSuccess({ source: payload.source, service: payload.service, submissionId: id }));
      }
      return result;
    },
  };
}

export async function submitInquiry(
  payload,
  {
    fetchImpl = globalThis.fetch,
    createId = createSubmissionId,
    submissionId = createId(),
    getAttribution = currentAttribution,
  } = {},
) {
  try {
    let attribution = {};
    safelyMeasure(() => { attribution = getAttribution() ?? {}; });
    const response = await fetchImpl("/api/inquiries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, submissionId,
        ...(Object.keys(attribution).length ? { attribution } : {}) }),
    });

    if (response.status === 429) throw new InquirySubmissionError("För många försök. Vänta en stund och försök igen, eller ring oss.");
    if (!response.ok) throw new InquirySubmissionError();

    const result = await response.json();
    if (result?.ok !== true) throw new InquirySubmissionError();

    return { ok: true };
  } catch (error) {
    if (error instanceof InquirySubmissionError) throw error;
    throw new InquirySubmissionError();
  }
}
