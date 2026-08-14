import assert from "node:assert/strict";
import test from "node:test";

import {
  createInquirySubmissionSession,
  submitInquiry,
  InquirySubmissionError,
} from "../app/lib/inquiries/submit-inquiry.mjs";

const validPayload = {
  source: "footer",
  name: "Anna Andersson",
  email: "anna@example.com",
  phone: "070-123 45 67",
  message: "Kontakta mig gärna.",
  website: "",
};

test("posts one submission with a generated stable ID", async () => {
  const calls = [];
  const result = await submitInquiry(validPayload, {
    createId: () => "11111111-1111-4111-8111-111111111111",
    fetchImpl: async (...args) => {
      calls.push(args);
      return Response.json({ ok: true });
    },
  });

  assert.deepEqual(result, { ok: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "/api/inquiries");
  assert.equal(calls[0][1].method, "POST");
  assert.equal(calls[0][1].headers["content-type"], "application/json");
  assert.deepEqual(JSON.parse(calls[0][1].body), {
    ...validPayload,
    submissionId: "11111111-1111-4111-8111-111111111111",
  });
});

test("throws the same public error for server and network failures", async () => {
  for (const fetchImpl of [
    async () => Response.json({ ok: false }, { status: 503 }),
    async () => {
      throw new TypeError("network detail");
    },
  ]) {
    await assert.rejects(
      () => submitInquiry(validPayload, { fetchImpl }),
      (error) => {
        assert.equal(error instanceof InquirySubmissionError, true);
        assert.equal(
          error.message,
          "Din förfrågan kunde inte skickas. Försök igen eller kontakta oss via telefon.",
        );
        return true;
      },
    );
  }
});

test("does not accept a malformed success response", async () => {
  await assert.rejects(
    () => submitInquiry(validPayload, {
      fetchImpl: async () => Response.json({ accepted: true }),
    }),
    InquirySubmissionError,
  );
});

test("reuses an ID for a safe retry and replaces it after the visitor edits", async () => {
  const submittedIds = [];
  const ids = [
    "11111111-1111-4111-8111-111111111111",
    "22222222-2222-4222-8222-222222222222",
  ];
  const session = createInquirySubmissionSession({
    createId: () => ids.shift(),
    submitImpl: async (_payload, options) => {
      submittedIds.push(options.submissionId);
      return { ok: true };
    },
  });

  await session.submit(validPayload);
  await session.submit(validPayload);
  session.invalidate();
  await session.submit({ ...validPayload, message: "Ändrat meddelande" });

  assert.deepEqual(submittedIds, [
    "11111111-1111-4111-8111-111111111111",
    "11111111-1111-4111-8111-111111111111",
    "22222222-2222-4222-8222-222222222222",
  ]);
});
