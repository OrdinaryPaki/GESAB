import { normalizeInquiry } from "./validation.mjs";

const MAX_REQUEST_BYTES = 16 * 1024;
const INVALID_ERROR = "Förfrågan kunde inte skickas.";
const DELIVERY_ERROR = "E-posttjänsten svarar inte just nu. Försök igen om en stund.";

function jsonResponse(body, status) {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

function publicError(error, status) {
  return jsonResponse({ ok: false, error }, status);
}

function exceedsDeclaredSize(request) {
  const declaredSize = Number.parseInt(request.headers.get("content-length") ?? "", 10);
  return Number.isFinite(declaredSize) && declaredSize > MAX_REQUEST_BYTES;
}

export async function handleInquiryRequest(request, deliver) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

  if (!contentType.startsWith("application/json")) {
    return publicError(INVALID_ERROR, 415);
  }
  if (exceedsDeclaredSize(request)) {
    return publicError(INVALID_ERROR, 413);
  }

  let bodyText;
  try {
    bodyText = await request.text();
  } catch {
    return publicError(INVALID_ERROR, 400);
  }

  if (new TextEncoder().encode(bodyText).byteLength > MAX_REQUEST_BYTES) {
    return publicError(INVALID_ERROR, 413);
  }

  let raw;
  try {
    raw = JSON.parse(bodyText);
  } catch {
    return publicError(INVALID_ERROR, 400);
  }

  if (typeof raw?.website === "string" && raw.website.trim()) {
    return publicError(INVALID_ERROR, 400);
  }

  const result = normalizeInquiry(raw);
  if (!result.ok) {
    return publicError(INVALID_ERROR, 400);
  }

  try {
    await deliver(result.inquiry);
  } catch {
    return publicError(DELIVERY_ERROR, 503);
  }

  return jsonResponse({ ok: true }, 200);
}
