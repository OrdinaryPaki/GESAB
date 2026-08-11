import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const styleAreas = [
  {
    name: "About",
    retired: "app/about/about.module.css",
    owners: [
      "app/about/about-page.module.css",
      "app/about/about-story.module.css",
      "app/about/about-mission.module.css",
    ],
  },
  {
    name: "Home",
    retired: "app/home-fidelity.css",
    owners: [
      "app/components/HomePage.css",
      "app/components/HomeHero.css",
      "app/components/HomeSupportWhy.css",
      "app/components/HomeServices.css",
      "app/components/HomeAbout.css",
      "app/components/HomeTrustProcess.css",
      "app/components/HomeGalleryFaq.css",
    ],
  },
  {
    name: "Header",
    retired: "app/components/Header.css",
    owners: ["app/components/HeaderBase.css", "app/components/HeaderMobile.css"],
  },
  {
    name: "Contact",
    retired: "app/contact/contact-page.module.css",
    owners: [
      "app/contact/contact-form.module.css",
      "app/contact/contact-hero.module.css",
      "app/contact/contact-info.module.css",
      "app/contact/contact-shell.module.css",
    ],
  },
  {
    name: "service detail",
    retired: "app/service/[slug]/service-detail.module.css",
    owners: [
      "app/service/[slug]/service-detail-shell.module.css",
      "app/service/[slug]/service-detail-content.module.css",
      "app/service/[slug]/service-detail-faq.module.css",
      "app/service/[slug]/service-detail-quote.module.css",
      "app/service/[slug]/service-detail-related.module.css",
    ],
  },
];

async function pathExists(relativePath) {
  try {
    await access(join(projectRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

for (const area of styleAreas) {
  test(`${area.name} styles use focused owners`, async () => {
    assert.equal(await pathExists(area.retired), false, `${area.retired} must stay retired`);

    for (const relativePath of area.owners) {
      const source = await readFile(join(projectRoot, relativePath), "utf8");
      const lineCount = source.split("\n").length;
      assert.ok(lineCount <= 500, `${relativePath} has ${lineCount} lines; split it before it becomes another style dump`);
    }
  });
}
