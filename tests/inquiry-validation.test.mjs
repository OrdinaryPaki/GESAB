import assert from "node:assert/strict";
import test from "node:test";

import { normalizeInquiry } from "../app/lib/inquiries/validation.mjs";

const submissionId = "11111111-1111-4111-8111-111111111111";

const validContact = {
  source: "contact",
  submissionId,
  firstName: "  Anna ",
  lastName: " Andersson  ",
  email: " ANNA@example.com ",
  service: " badrumsrenovering ",
  message: " Jag vill ha en offert. ",
  website: "",
};

test("normalizes the contact form into one shared inquiry", () => {
  assert.deepEqual(normalizeInquiry(validContact), {
    ok: true,
    inquiry: {
      source: "contact",
      submissionId,
      name: "Anna Andersson",
      email: "anna@example.com",
      phone: "",
      service: "badrumsrenovering",
      message: "Jag vill ha en offert.",
    },
  });
});

test("normalizes footer and service submissions without changing their meaning", () => {
  const shared = {
    submissionId,
    name: "  Anna Andersson ",
    email: " anna@example.com ",
    phone: " 070-123 45 67 ",
    message: " Kontakta mig gärna. ",
    website: "",
  };

  assert.deepEqual(normalizeInquiry({ source: "footer", ...shared }), {
    ok: true,
    inquiry: {
      source: "footer",
      submissionId,
      name: "Anna Andersson",
      email: "anna@example.com",
      phone: "070-123 45 67",
      service: "",
      message: "Kontakta mig gärna.",
    },
  });

  assert.deepEqual(
    normalizeInquiry({ source: "service", service: "koksrenovering", ...shared }),
    {
      ok: true,
      inquiry: {
        source: "service",
        submissionId,
        name: "Anna Andersson",
        email: "anna@example.com",
        phone: "070-123 45 67",
        service: "koksrenovering",
        message: "Kontakta mig gärna.",
      },
    },
  );
});

test("rejects unknown sources, malformed email and oversized content", () => {
  const result = normalizeInquiry({
    ...validContact,
    source: "admin",
    email: "fel",
    message: "x".repeat(5001),
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, ["source", "email", "message"]);
});

test("enforces the fields required by each real form", () => {
  assert.deepEqual(
    normalizeInquiry({ ...validContact, firstName: "", service: "" }),
    { ok: false, errors: ["name", "service"] },
  );

  assert.deepEqual(
    normalizeInquiry({
      source: "footer",
      submissionId,
      name: "Anna",
      email: "anna@example.com",
      phone: "",
      message: "",
      website: "",
    }),
    { ok: false, errors: ["phone", "message"] },
  );
});

test("rejects invalid submission IDs and non-object input", () => {
  assert.deepEqual(normalizeInquiry(null), { ok: false, errors: ["request"] });
  assert.deepEqual(
    normalizeInquiry({ ...validContact, submissionId: "not-a-uuid" }),
    { ok: false, errors: ["submissionId"] },
  );
});
