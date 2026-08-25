import assert from "node:assert/strict";
import test from "node:test";

import { buildInquiryEmails } from "../app/lib/inquiries/email-content.mjs";

const contactInfo = {
  company: "Göteborgs Entreprenad Service AB",
  addressLine: "Östergärde Industriväg 39, 417 29 Göteborg",
  phonePrimary: "0707 299 633",
  phonePrimaryHref: "tel:+46707299633",
  email: "kontakt@ges-ab.se",
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

const fixedDate = new Date("2026-08-13T10:00:00Z");

test("builds the internal message for the contact mailbox with customer reply-to", () => {
  const { internal } = buildInquiryEmails(validInquiry, { contactInfo, now: fixedDate });

  assert.equal(internal.from, "GESAB Hemsida <kontakt@ges-ab.se>");
  assert.equal(internal.to, "kontakt@ges-ab.se");
  assert.equal(internal.replyTo, "anna@example.com");
  assert.equal(
    internal.subject,
    "Ny förfrågan: Badrumsrenovering – Anna Andersson (13 aug.)",
  );
  assert.match(internal.text, /Jag vill ha en offert\./);
  assert.match(internal.html, /Badrumsrenovering/);
});

test("builds the customer confirmation from the authoritative mailbox", () => {
  const { customer } = buildInquiryEmails(validInquiry, { contactInfo, now: fixedDate });

  assert.equal(customer.from, "GESAB <kontakt@ges-ab.se>");
  assert.equal(customer.to, "anna@example.com");
  assert.equal(customer.replyTo, "kontakt@ges-ab.se");
  assert.equal(
    customer.subject,
    "Tack för din förfrågan gällande Badrumsrenovering - GESAB",
  );
  assert.match(customer.text, /Hej Anna,/);
  assert.match(customer.html, /Göteborgs Entreprenad Service AB/);
});

test("uses source-specific subjects for service and footer inquiries", () => {
  const service = buildInquiryEmails(
    { ...validInquiry, source: "service", service: "koksrenovering" },
    { contactInfo, now: fixedDate },
  );
  const footer = buildInquiryEmails(
    { ...validInquiry, source: "footer", service: "" },
    { contactInfo, now: fixedDate },
  );

  assert.equal(
    service.internal.subject,
    "Offertförfrågan: Köksrenovering – Anna Andersson (13 aug.)",
  );
  assert.equal(
    service.customer.subject,
    "Tack för din offertförfrågan gällande Köksrenovering - GESAB",
  );
  assert.equal(
    footer.internal.subject,
    "Boka offert via hemsidan – Anna Andersson (13 aug.)",
  );
  assert.equal(footer.customer.subject, "Tack för din förfrågan - GESAB");
});

test("escapes customer-controlled HTML in both messages", () => {
  const emails = buildInquiryEmails(
    {
      ...validInquiry,
      name: "<Anna>",
      message: "<img src=x onerror=alert(1)>",
    },
    { contactInfo, now: fixedDate },
  );

  assert.doesNotMatch(emails.internal.html, /<img/);
  assert.doesNotMatch(emails.internal.html, /<Anna>/);
  assert.match(emails.internal.html, /&lt;img/);
  assert.match(emails.internal.html, /&lt;Anna&gt;/);
  assert.doesNotMatch(emails.customer.html, /<Anna>/);
});
