import assert from "node:assert/strict";
import test from "node:test";

import { siteUrl } from "./helpers/site-url.mjs";

const homeImagePaths = [
  "/images/home/why-team-planning.webp",
  "/images/home/why-final-inspection.webp",
  "/images/home/service-bathroom-warm.webp",
  "/images/home/service-kitchen-warm.webp",
  "/images/services/totalentreprenad/totalentreprenad-01-kok-vardagsrum.webp",
  "/images/home/about-team-workshop.webp",
  "/images/home/gallery-bathroom-green.webp",
  "/images/home/gallery-kitchen-island.webp",
  "/images/home/gallery-built-in-storage.webp",
  "/images/home/gallery-shower-blue-grey.webp",
  "/images/home/gallery-whole-home.webp",
];

test("the HOME why section shows responsibility during work and at final inspection", async () => {
  const response = await fetch(new URL("/", siteUrl));
  assert.equal(response.status, 200);

  const html = await response.text();
  const whySection = html.match(/<section class="why-section">[\s\S]*?<\/section>/)?.[0];
  const imageSources = whySection?.match(/<img[^>]*src="([^"]+)"/g)?.map(
    (image) => image.match(/src="([^"]+)"/)?.[1],
  );

  assert.ok(whySection, "the Varför GESAB section is missing from HOME");
  assert.deepEqual(
    imageSources,
    [
      "/images/home/why-team-planning.webp",
      "/images/home/why-final-inspection.webp",
    ],
    "the Varför GESAB section must show the selected human, documentary images",
  );
});

test("HOME service cards render their configured placeholder or local service image", async () => {
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
    [
      "/images/home/service-bathroom-warm.webp",
      "/images/home/service-altan.png",
      "/images/services/totalentreprenad/totalentreprenad-01-kok-vardagsrum.webp",
      "/images/home/service-kitchen-warm.webp",
    ],
    "HOME service cards must show the selected finished-project images",
  );
});

test("the HOME about section renders the selected team image", async () => {
  const response = await fetch(new URL("/", siteUrl));
  assert.equal(response.status, 200);

  const html = await response.text();
  const aboutSection = html.match(/<section class="about-section">[\s\S]*?<\/section>/)?.[0];

  assert.ok(aboutSection, "the Om GESAB section is missing from HOME");
  assert.match(
    aboutSection,
    /<img class="about-photo"[^>]*src="\/images\/home\/about-team-workshop\.webp"/,
    "the Om GESAB section must render the selected team image",
  );
});

test("the HOME gallery renders the five selected projects in the intended order", async () => {
  const response = await fetch(new URL("/", siteUrl));
  assert.equal(response.status, 200);

  const html = await response.text();
  const gallerySection = html.match(/<section class="gallery-section">[\s\S]*?<\/section>/)?.[0];
  const imageSources = gallerySection?.match(/<img[^>]*src="([^"]+)"/g)?.map(
    (image) => image.match(/src="([^"]+)"/)?.[1],
  );

  assert.ok(gallerySection, "the gallery section is missing from HOME");
  assert.deepEqual(
    imageSources,
    [
      "/images/home/gallery-bathroom-green.webp",
      "/images/home/gallery-kitchen-island.webp",
      "/images/home/gallery-built-in-storage.webp",
      "/images/home/gallery-shower-blue-grey.webp",
      "/images/home/gallery-whole-home.webp",
    ],
    "the HOME gallery must preserve the five selected projects and their order",
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
