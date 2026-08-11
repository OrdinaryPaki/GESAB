import assert from "node:assert/strict";
import test from "node:test";

import { siteUrl } from "./helpers/site-url.mjs";

const homeUrl = process.env.HOME_PAGE_URL ?? siteUrl;

test("the shared quote form lets visitors describe their request", async () => {
  const response = await fetch(homeUrl);
  assert.equal(response.status, 200);

  const html = await response.text();
  const formStart = html.indexOf("data-appointment-form");
  assert.notEqual(formStart, -1, "the shared quote form must be rendered");

  const formEnd = html.indexOf("</form>", formStart);
  assert.notEqual(formEnd, -1, "the shared quote form must have a closing tag");

  const formHtml = html.slice(formStart, formEnd);

  assert.match(
    formHtml,
    /<textarea[^>]*name="message"[^>]*placeholder="Beskriv kort vad du vill ha hjälp med\."[^>]*><\/textarea>/,
    "the quote form must collect a written message",
  );
  assert.doesNotMatch(
    formHtml,
    /name="service"/,
    "the quote form must not keep the service selector after it is replaced",
  );
});
