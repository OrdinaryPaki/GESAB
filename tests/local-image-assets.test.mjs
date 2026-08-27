import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { siteUrl } from "./helpers/site-url.mjs";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const localImages = [
  ["/images/site/hero-pattern.jpg", "e7d75cd30f35402bd29cd8b94ad67d40f0c56e0d82917f3890e7c03cf6ab9806"],
  ["/images/site/about-pattern.jpg", "ea8137bdf7ab0deb84ccb01ffeae314a96787b524333f5df2acaebd1ac7a4d98"],
  ["/images/site/contact-band-background.jpg", "63c866fc094fd92859d0459f15aa5a60606570b260a7ec0213eaab0f4eb91b07"],
  ["/images/site/trust-badge.jpg", "9633fd822bb0297dd185230e5db68ac6910c9480fc6980447f3d7089a0e052ab"],
  ["/images/team/vvs-montor.jpg", "08a35cb47da1585a3094db9079f94091254a982ae5e2a4588fbfef82c1bc3ac4"],
  ["/images/team/plattsattare.jpg", "b70dc28df8ed30901e9ee089c5803deb7785bcbc3d9391a38bff7ae007e9ceb1"],
  ["/images/team/elektriker.jpg", "14e8cb344e1934c0191964d6f322f8026c1431076c31d7a259c541b5cda14061"],
  ["/images/team/snickare-malare.jpg", "aa55468c2d3175322f74708d2428059d43ae646190086e8ea34d7cbaf4e27521"],
];

const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/galleri",
  "/service",
  "/service/badrumsrenovering",
  "/service/tvattstugsrenovering",
  "/service/koksrenovering",
  "/service/totalentreprenad",
  "/service/rivningsarbeten",
  "/service/bygg",
];

test("local image files preserve the exact downloaded source bytes", () => {
  for (const [publicPath, expectedHash] of localImages) {
    const filePath = path.join(workspaceRoot, "public", publicPath);
    assert.ok(existsSync(filePath), `${publicPath} must exist locally`);

    const actualHash = createHash("sha256").update(readFileSync(filePath)).digest("hex");
    assert.equal(actualHash, expectedHash, `${publicPath} must remain byte-identical to its source response`);
  }
});

test("all migrated images are publicly served as JPEG files", async () => {
  for (const [publicPath] of localImages) {
    const response = await fetch(new URL(publicPath, siteUrl));
    assert.equal(response.status, 200, `${publicPath} must be publicly available`);
    assert.equal(response.headers.get("content-type"), "image/jpeg");
  }
});

test("public pages no longer depend on Framer-hosted images", async () => {
  for (const route of publicRoutes) {
    const response = await fetch(new URL(route, siteUrl));
    const html = await response.text();

    assert.equal(response.status, 200, `${route} must remain publicly available`);
    assert.doesNotMatch(html, /framerusercontent\.com/, `${route} must use local image URLs`);
  }
});
