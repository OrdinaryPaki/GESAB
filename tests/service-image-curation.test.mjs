import assert from "node:assert/strict";
import test from "node:test";

import { constructionDetailContent } from "../app/service/detail-content/construction.js";
import { renovationDetailContent } from "../app/service/detail-content/renovation.js";

const serviceDetails = {
  ...renovationDetailContent,
  ...constructionDetailContent,
};

const serviceSlugs = [
  "badrumsrenovering",
  "tvattstugsrenovering",
  "koksrenovering",
  "totalentreprenad",
  "rivningsarbeten",
  "bygg",
];

test("every service page uses one curated hero and eight distinct gallery images from its own folder", () => {
  for (const slug of serviceSlugs) {
    const detail = serviceDetails[slug];
    const expectedPrefix = `/images/services/${slug}/`;
    const galleryImages = detail.projects.map((project) => project.src);

    assert.ok(
      detail.heroImage.startsWith(expectedPrefix),
      `${slug} hero must live in ${expectedPrefix}`,
    );
    assert.equal(galleryImages.length, 8, `${slug} must have eight curated gallery images`);
    assert.ok(
      galleryImages.every((image) => image.startsWith(expectedPrefix)),
      `${slug} gallery images must all live in ${expectedPrefix}`,
    );
    assert.equal(
      new Set(galleryImages).size,
      galleryImages.length,
      `${slug} gallery must not contain duplicate images`,
    );
    assert.ok(
      !galleryImages.includes(detail.heroImage),
      `${slug} hero must not be repeated in the gallery`,
    );
  }
});
