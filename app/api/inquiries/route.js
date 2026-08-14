import { Resend } from "resend";

import { contactInfo } from "../../site-config";
import { deliverInquiry } from "../../lib/inquiries/delivery.mjs";
import { handleInquiryRequest } from "../../lib/inquiries/handler.mjs";

export const runtime = "nodejs";

let resendClient;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  resendClient ??= new Resend(apiKey);
  return resendClient;
}

export async function POST(request) {
  return handleInquiryRequest(request, (inquiry) =>
    deliverInquiry(getResendClient(), inquiry, { contactInfo }),
  );
}
