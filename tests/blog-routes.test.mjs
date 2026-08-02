import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.TEST_BASE_URL ?? "http://localhost:3000";

test("the blog index renders the featured and article collections", async () => {
  const response = await fetch(`${baseUrl}/blog`);
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Latest Insights/);
  assert.match(html, /Read More Articles/);
  assert.match(html, /How to solve 10 Common Plumbing Problems/);
  assert.match(html, /What to Expect During a Plumbing Inspection/);
});

test("the canonical blog detail uses the shared article template once", async () => {
  const response = await fetch(
    `${baseUrl}/blog/how-to-solve-10-common-plumbing-problems`,
  );
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Aug 21, 2025/);
  assert.match(html, /How to solve 10 Common Plumbing Problems/);
  assert.match(html, /Your Safety Is Our Priority/);
  assert.match(html, /Go Back/);
  assert.equal((html.match(/class="appointment-card"/g) ?? []).length, 1);
});

test("an unknown blog slug returns 404 instead of a generic article", async () => {
  const response = await fetch(`${baseUrl}/blog/not-a-real-post`);
  assert.equal(response.status, 404);
});
