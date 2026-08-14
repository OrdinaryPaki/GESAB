import assert from "node:assert/strict";
import test from "node:test";

import { siteUrl } from "./helpers/site-url.mjs";

const formPages = [
  { path: "/", marker: "data-appointment-form", label: "home booking" },
  { path: "/contact", marker: "contact-main-form", label: "contact" },
  {
    path: "/service/badrumsrenovering",
    marker: "data-service-quote-form",
    label: "service quote",
  },
];

test("every real inquiry form renders the shared spam trap", async () => {
  for (const { path, marker, label } of formPages) {
    const response = await fetch(`${siteUrl}${path}`);
    assert.equal(response.status, 200, `${label} page must render`);

    const html = await response.text();
    const formMarker = html.indexOf(marker);
    const formEnd = html.indexOf("</form>", formMarker);

    assert.notEqual(formMarker, -1, `${label} form must exist`);
    assert.notEqual(formEnd, -1, `${label} form must close`);
    assert.match(
      html.slice(formMarker, formEnd),
      /<input(?=[^>]*name="website")(?=[^>]*tabindex="-1")[^>]*>/,
      `${label} form must use the shared honeypot field`,
    );
  }
});
