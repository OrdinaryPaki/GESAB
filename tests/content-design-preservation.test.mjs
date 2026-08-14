import assert from "node:assert/strict";
import test from "node:test";

import { siteUrl } from "./helpers/site-url.mjs";

test("the home page keeps the original customer-review section", async () => {
  const response = await fetch(new URL("/", siteUrl));
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Kundomdömen/);
  assert.match(html, /Anna &amp; Mikael/);
  assert.match(html, /GESAB hjälpte oss att totalrenovera vårt badrum/);
  assert.doesNotMatch(html, /Tydlighet genom hela renoveringen/);
});

test("service pages keep their original reviews and sales copy", async () => {
  const response = await fetch(new URL("/service/badrumsrenovering", siteUrl));
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Vad kunderna säger/);
  assert.match(html, /1500\+/);
  assert.match(html, /Fast pris/);
  assert.match(html, /Vi återkommer inom 24h/);
});
