import assert from "node:assert/strict";
import test from "node:test";

const siteUrl = process.env.SITE_URL ?? "http://127.0.0.1:3000";

const homeImagePaths = [
  "/images/home/why-waterproofing.webp",
  "/images/home/why-site-measurement.webp",
  "/images/home/service-bathroom-result.webp",
  "/images/home/service-kitchen-result.webp",
  "/images/home/service-total-project.webp",
  "/images/home/service-demolition.webp",
  "/images/home/about-plumbing-detail.webp",
  "/images/home/gallery-bathroom-result.webp",
  "/images/home/gallery-kitchen-result.webp",
  "/images/home/gallery-shower-detail.webp",
  "/images/home/gallery-carpentry-result.webp",
  "/images/home/gallery-tiling-progress.webp",
];

test("the home route renders the local work-and-results image collection", async () => {
  const response = await fetch(new URL("/", siteUrl));
  assert.equal(response.status, 200);

  const html = await response.text();
  for (const imagePath of homeImagePaths) {
    assert.ok(html.includes(`src="${imagePath}"`), `${imagePath} is missing from HOME`);
  }
});

test("every HOME image is served as an optimized WebP asset", async () => {
  const responses = await Promise.all(
    homeImagePaths.map(async (imagePath) => {
      const response = await fetch(new URL(imagePath, siteUrl));
      return { imagePath, response, bytes: (await response.arrayBuffer()).byteLength };
    }),
  );

  for (const { imagePath, response, bytes } of responses) {
    assert.equal(response.status, 200, `${imagePath} must be publicly loadable`);
    assert.equal(response.headers.get("content-type"), "image/webp");
    assert.ok(bytes <= 450_000, `${imagePath} is ${bytes} bytes and must stay under 450 KB`);
  }
});
