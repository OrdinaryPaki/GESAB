import assert from "node:assert/strict";
import test from "node:test";

const siteUrl = process.env.SITE_URL ?? "http://127.0.0.1:3000";

const homeImagePaths = [
  "/images/home/gallery-bathroom-result.webp",
  "/images/home/gallery-kitchen-result.webp",
];

const contentPlaceholderPath = "/images/placeholders/gesab-content-placeholder.svg";

test("every HOME service card renders the GESAB image placeholder", async () => {
  const response = await fetch(new URL("/", siteUrl));
  assert.equal(response.status, 200);

  const html = await response.text();
  const servicesSection = html.match(/<section class="services-section">[\s\S]*?<\/section>/)?.[0];
  const serviceCards = servicesSection?.match(/<a[^>]*class="service-card"[^>]*>[\s\S]*?<\/a>/g) ?? [];
  const serviceImageSources = serviceCards.map(
    (card) => card.match(/<img[^>]*src="([^"]+)"/)?.[1],
  );

  assert.ok(servicesSection, "the services section is missing from HOME");
  assert.deepEqual(
    serviceImageSources,
    Array.from({ length: 4 }, () => contentPlaceholderPath),
    "all four HOME service cards must render the GESAB image placeholder",
  );
});

test("the HOME about section renders the GESAB image placeholder", async () => {
  const response = await fetch(new URL("/", siteUrl));
  assert.equal(response.status, 200);

  const html = await response.text();
  const aboutSection = html.match(/<section class="about-section">[\s\S]*?<\/section>/)?.[0];

  assert.ok(aboutSection, "the Om GESAB section is missing from HOME");
  assert.match(
    aboutSection,
    new RegExp(`<img class="about-photo"[^>]*src="${contentPlaceholderPath}"`),
    "the Om GESAB section must render the GESAB image placeholder",
  );
});

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
