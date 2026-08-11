import assert from "node:assert/strict";
import test from "node:test";

import { siteUrl } from "./helpers/site-url.mjs";

const aboutUrl = process.env.ABOUT_PAGE_URL ?? `${siteUrl}/about`;

test("the About route includes the FAQ section before the contact band", async () => {
  const response = await fetch(aboutUrl);
  assert.equal(response.status, 200);

  const html = await response.text();
  const faqPosition = html.indexOf("data-faq-section");
  const contactPosition = html.indexOf("data-contact-band");

  assert.notEqual(faqPosition, -1, "The About route is missing its FAQ section");
  assert.notEqual(contactPosition, -1, "The About route is missing its contact band");
  assert.ok(faqPosition < contactPosition, "The FAQ must appear before the contact band");
});
