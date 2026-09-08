import { normalizeInquiry } from "./validation.mjs";
import { normalizeContactAttribution } from "../../tracking/contact-attribution.mjs";

const MAX_REQUEST_BYTES = 16 * 1024;
const INVALID_ERROR = "Förfrågan kunde inte skickas.";
const DELIVERY_ERROR = "Förfrågan kunde inte slutföras just nu. Försök igen om en stund.";

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
    await deliver(result.inquiry, normalizeContactAttribution(raw.attribution));
  } catch (error) {
    if (error?.name === "AbuseLimitError") return Response.json({ok:false,error:error.message},{status:429,headers:{"cache-control":"no-store","retry-after":String(error.retryAfter)}});
    if (error?.name === "ContactConflictError") return publicError(INVALID_ERROR,409);
    return publicError(DELIVERY_ERROR, 503);
  }

  return jsonResponse({ ok: true }, 200);
}
