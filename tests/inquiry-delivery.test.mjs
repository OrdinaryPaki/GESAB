import assert from "node:assert/strict";
import test from "node:test";

import {
  deliverInquiry,
  InquiryDeliveryError,
} from "../app/lib/inquiries/delivery.mjs";

const contactInfo = {
  company: "Göteborgs Entreprenad Service AB",
  addressLine: "Solstrålegatan 6, 418 43 Göteborg",
  phonePrimary: "0707 299 633",
  phonePrimaryHref: "tel:+46707299633",
  email: "arijana@ges-ab.se",
};

const validInquiry = {
  source: "contact",
  submissionId: "11111111-1111-4111-8111-111111111111",
  name: "Anna Andersson",
  email: "anna@example.com",
  phone: "",
  service: "badrumsrenovering",
  message: "Jag vill ha en offert.",
};

test("sends internal and customer messages with separate stable idempotency keys", async () => {
  const sent = [];
  const resend = {
    emails: {
      send: async (...args) => {
        sent.push(args);
        return { data: { id: `email-${sent.length}` }, error: null };
      },
    },
  };

  await deliverInquiry(resend, validInquiry, { contactInfo });

  assert.equal(sent.length, 2);
  assert.equal(sent[0][0].to, "arijana@ges-ab.se");
  assert.equal(sent[0][0].replyTo, "anna@example.com");
  assert.equal(
    sent[0][1].idempotencyKey,
    "11111111-1111-4111-8111-111111111111-internal",
  );
  assert.equal(sent[1][0].to, "anna@example.com");
  assert.equal(
    sent[1][1].idempotencyKey,
    "11111111-1111-4111-8111-111111111111-customer",
  );
});

test("stops and reports a provider error without attempting later mail", async () => {
  let calls = 0;
  const resend = {
    emails: {
      send: async () => {
        calls += 1;
        return { data: null, error: { message: "provider rejected request" } };
      },
    },
  };

  await assert.rejects(
    () => deliverInquiry(resend, validInquiry, { contactInfo }),
    InquiryDeliveryError,
  );
  assert.equal(calls, 1);
});

test("reports thrown provider failures as one public-safe delivery error", async () => {
  const resend = {
    emails: {
      send: async () => {
        throw new Error("secret provider detail");
      },
    },
  };

  await assert.rejects(
    () => deliverInquiry(resend, validInquiry, { contactInfo }),
    (error) => {
      assert.equal(error instanceof InquiryDeliveryError, true);
      assert.equal(error.message, "E-postleveransen misslyckades.");
      return true;
    },
  );
});
