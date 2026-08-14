const PUBLIC_ERROR =
  "Din förfrågan kunde inte skickas. Försök igen eller kontakta oss via telefon.";

export class InquirySubmissionError extends Error {
  constructor() {
    super(PUBLIC_ERROR);
    this.name = "InquirySubmissionError";
  }
}

export function createSubmissionId() {
  return globalThis.crypto.randomUUID();
}

export function createInquirySubmissionSession({
  createId = createSubmissionId,
  submitImpl = submitInquiry,
} = {}) {
  let submissionId;

  return {
    invalidate() {
      submissionId = undefined;
    },
    submit(payload) {
      submissionId ??= createId();
      return submitImpl(payload, { submissionId });
    },
  };
}

export async function submitInquiry(
  payload,
  {
    fetchImpl = globalThis.fetch,
    createId = createSubmissionId,
    submissionId = createId(),
  } = {},
) {
  try {
    const response = await fetchImpl("/api/inquiries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...payload, submissionId }),
    });

    if (!response.ok) throw new InquirySubmissionError();

    const result = await response.json();
    if (result?.ok !== true) throw new InquirySubmissionError();

    return { ok: true };
  } catch (error) {
    if (error instanceof InquirySubmissionError) throw error;
    throw new InquirySubmissionError();
  }
}
