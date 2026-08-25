import assert from "node:assert/strict";
import test from "node:test";

import { buildPreviewHeaders } from "../app/lib/inquiries/email-content.mjs";

const fixedDate = new Date("2026-08-13T10:00:00Z");

test("the internal preview uses the contact mailbox as sender and recipient", () => {
  assert.deepEqual(
    buildPreviewHeaders(
      { recipient: "internal", source: "contact" },
      { contactEmail: "kontakt@ges-ab.se", now: fixedDate },
    ),
    {
      from: "GESAB Hemsida <kontakt@ges-ab.se>",
      to: "GESAB <kontakt@ges-ab.se>",
      subject: "Ny förfrågan: Badrumsrenovering – Anna Andersson (13 aug.)",
    },
  );
});

test("the customer preview keeps its intentional examples with the contact mailbox as sender", () => {
  assert.deepEqual(
    buildPreviewHeaders(
      { recipient: "customer", source: "service" },
      { contactEmail: "kontakt@ges-ab.se", now: fixedDate },
    ),
    {
      from: "GESAB <kontakt@ges-ab.se>",
      to: "Anna Andersson <anna.andersson@example.com>",
      subject: "Tack för din offertförfrågan gällande Badrumsrenovering - GESAB",
    },
  );
});

test("the intentionally preview-only blog variant remains available", () => {
  assert.equal(
    buildPreviewHeaders(
      { recipient: "internal", source: "blog" },
      { contactEmail: "kontakt@ges-ab.se", now: fixedDate },
    ).subject,
    "Förfrågan via bloggen – Anna Andersson (13 aug.)",
  );
});
