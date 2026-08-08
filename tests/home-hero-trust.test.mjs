import assert from "node:assert/strict";
import test from "node:test";

const siteUrl = process.env.SITE_URL ?? "http://127.0.0.1:3000";

test("the home hero trust message is rendered without person images", async () => {
  const response = await fetch(new URL("/", siteUrl));
  assert.equal(response.status, 200);

  const html = await response.text();
  const trustMessage = html.match(/<div class="trusted">([\s\S]*?)<\/div>/)?.[1];

  assert.ok(trustMessage, "the hero trust message must remain visible");
  assert.match(
    trustMessage,
    /<span>[^<]+<\/span>/,
    "the hero trust copy must remain visible",
  );
  assert.doesNotMatch(
    trustMessage,
    /<img\b/,
    "the hero trust message must not render person images",
  );
});
