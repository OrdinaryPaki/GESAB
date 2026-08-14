import assert from "node:assert/strict";
import test from "node:test";

import { handleInquiryRequest } from "../app/lib/inquiries/handler.mjs";

const validContact = {
  source: "contact",
  submissionId: "11111111-1111-4111-8111-111111111111",
  firstName: "Anna",
  lastName: "Andersson",
  email: "anna@example.com",
  service: "badrumsrenovering",
  message: "Jag vill ha en offert.",
  website: "",
};

function jsonRequest(body, options = {}) {
  return new Request("http://localhost/api/inquiries", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...options.headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

test("returns success only after delivering a normalized inquiry", async () => {
  const received = [];
  const response = await handleInquiryRequest(
    jsonRequest({ ...validContact, firstName: " Anna " }),
    async (inquiry) => received.push(inquiry),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.deepEqual(received, [
    {
      source: "contact",
      submissionId: "11111111-1111-4111-8111-111111111111",
      name: "Anna Andersson",
      email: "anna@example.com",
      phone: "",
      service: "badrumsrenovering",
      message: "Jag vill ha en offert.",
    },
  ]);
});

test("rejects a filled honeypot without calling delivery", async () => {
  let calls = 0;
  const response = await handleInquiryRequest(
    jsonRequest({ ...validContact, website: "spam.example" }),
    async () => {
      calls += 1;
    },
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: "Förfrågan kunde inte skickas.",
  });
  assert.equal(calls, 0);
});

test("rejects invalid input and malformed JSON without exposing validation details", async () => {
  let calls = 0;
  const deliver = async () => {
    calls += 1;
  };
  const invalid = await handleInquiryRequest(
    jsonRequest({ ...validContact, email: "fel" }),
    deliver,
  );
  const malformed = await handleInquiryRequest(jsonRequest("{"), deliver);

  assert.equal(invalid.status, 400);
  assert.deepEqual(await invalid.json(), {
    ok: false,
    error: "Förfrågan kunde inte skickas.",
  });
  assert.equal(malformed.status, 400);
  assert.equal(calls, 0);
});

test("enforces JSON content type and a sixteen-kibibyte request limit", async () => {
  let calls = 0;
  const deliver = async () => {
    calls += 1;
  };
  const wrongType = await handleInquiryRequest(
    new Request("http://localhost/api/inquiries", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: JSON.stringify(validContact),
    }),
    deliver,
  );
  const oversized = await handleInquiryRequest(
    jsonRequest({ ...validContact, message: "x".repeat(17 * 1024) }),
    deliver,
  );

  assert.equal(wrongType.status, 415);
  assert.equal(oversized.status, 413);
  assert.equal(calls, 0);
});

test("returns a retryable public error when delivery fails", async () => {
  const response = await handleInquiryRequest(jsonRequest(validContact), async () => {
    throw new Error("private provider failure");
  });

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: "E-posttjänsten svarar inte just nu. Försök igen om en stund.",
  });
});
