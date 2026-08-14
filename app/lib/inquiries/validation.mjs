import { INQUIRY_LIMITS, INQUIRY_SOURCES } from "./constants.mjs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function hasValidLength(value, maximum) {
  return value.length > 0 && value.length <= maximum;
}

function addError(errors, field, isInvalid) {
  if (isInvalid) errors.push(field);
}

export function normalizeInquiry(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, errors: ["request"] };
  }

  const source = clean(raw.source);
  const submissionId = clean(raw.submissionId);
  const firstName = clean(raw.firstName);
  const lastName = clean(raw.lastName);
  const providedName = clean(raw.name);
  const name = source === "contact" ? `${firstName} ${lastName}`.trim() : providedName;
  const email = clean(raw.email).toLowerCase();
  const phone = clean(raw.phone);
  const service = clean(raw.service);
  const message = clean(raw.message);
  const errors = [];
  const isKnownSource = INQUIRY_SOURCES.includes(source);

  addError(errors, "source", !isKnownSource);
  addError(errors, "submissionId", !UUID_PATTERN.test(submissionId));

  if (isKnownSource) {
    const nameIsInvalid = source === "contact"
      ? !hasValidLength(firstName, INQUIRY_LIMITS.firstName)
        || !hasValidLength(lastName, INQUIRY_LIMITS.lastName)
        || name.length > INQUIRY_LIMITS.name
      : !hasValidLength(name, INQUIRY_LIMITS.name);

    addError(errors, "name", nameIsInvalid);
  }

  addError(
    errors,
    "email",
    !hasValidLength(email, INQUIRY_LIMITS.email) || !EMAIL_PATTERN.test(email),
  );

  if (isKnownSource && source !== "contact") {
    addError(errors, "phone", !hasValidLength(phone, INQUIRY_LIMITS.phone));
  } else if (phone.length > INQUIRY_LIMITS.phone) {
    errors.push("phone");
  }

  if (isKnownSource && source !== "footer") {
    addError(errors, "service", !hasValidLength(service, INQUIRY_LIMITS.service));
  } else if (service.length > INQUIRY_LIMITS.service) {
    errors.push("service");
  }

  addError(errors, "message", !hasValidLength(message, INQUIRY_LIMITS.message));

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    inquiry: {
      source,
      submissionId,
      name,
      email,
      phone,
      service,
      message,
    },
  };
}
