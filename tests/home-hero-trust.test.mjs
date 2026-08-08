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

test("the home testimonial cards are rendered without person images", async () => {
  const response = await fetch(new URL("/", siteUrl));
  assert.equal(response.status, 200);

  const html = await response.text();
  const testimonialCards = [
    ...html.matchAll(/<article class="testimonial-card">([\s\S]*?)<\/article>/g),
  ].map((match) => match[1]);

  assert.ok(testimonialCards.length > 0, "testimonial cards must remain visible");

  for (const card of testimonialCards) {
    assert.match(card, /<h3>[^<]+<\/h3>/, "each testimonial heading must remain visible");
    assert.match(card, /<span>[^<]+<\/span>/, "each testimonial subtitle must remain visible");
    assert.doesNotMatch(card, /<img\b/, "testimonial cards must not render person images");
  }
});
