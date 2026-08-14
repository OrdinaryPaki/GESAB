import { buildInquiryEmails } from "./email-content.mjs";

export class InquiryDeliveryError extends Error {
  constructor() {
    super("E-postleveransen misslyckades.");
    this.name = "InquiryDeliveryError";
  }
}

async function sendRequiredEmail(resend, message, idempotencyKey) {
  try {
    const result = await resend.emails.send(message, {
      idempotencyKey,
    });

    if (result?.error || !result?.data?.id) {
      throw new InquiryDeliveryError();
    }
  } catch (error) {
    if (error instanceof InquiryDeliveryError) throw error;
    throw new InquiryDeliveryError();
  }
}

export async function deliverInquiry(resend, inquiry, { contactInfo, now = new Date() }) {
  const messages = buildInquiryEmails(inquiry, { contactInfo, now });

  await sendRequiredEmail(
    resend,
    messages.internal,
    `${inquiry.submissionId}-internal`,
  );
  await sendRequiredEmail(
    resend,
    messages.customer,
    `${inquiry.submissionId}-customer`,
  );
}
