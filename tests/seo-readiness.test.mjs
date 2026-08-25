import assert from "node:assert/strict";
import test from "node:test";

import { siteUrl } from "./helpers/site-url.mjs";

const publicPages = [
  ["/", "Badrumsrenovering och entreprenad i Göteborg", "https://www.ges-ab.se"],
  ["/about", "Om Göteborgs Entreprenad Service AB", "https://www.ges-ab.se/about"],
  ["/service", "Tjänster för badrum, bygg och renovering i Göteborg", "https://www.ges-ab.se/service"],
  ["/galleri", "Galleri", "https://www.ges-ab.se/galleri"],
  ["/contact", "Kontakta GESAB", "https://www.ges-ab.se/contact"],
  ["/service/badrumsrenovering", "Badrumsrenovering i Göteborg", "https://www.ges-ab.se/service/badrumsrenovering"],
  ["/service/tvattstugsrenovering", "Tvättstugsrenovering i Göteborg", "https://www.ges-ab.se/service/tvattstugsrenovering"],
  ["/service/koksrenovering", "Köksrenovering i Göteborg", "https://www.ges-ab.se/service/koksrenovering"],
  ["/service/totalentreprenad", "Totalentreprenad i Göteborg", "https://www.ges-ab.se/service/totalentreprenad"],
  ["/service/rivningsarbeten", "Rivningsarbeten i Göteborg", "https://www.ges-ab.se/service/rivningsarbeten"],
  ["/service/bygg", "Bygg i Göteborg", "https://www.ges-ab.se/service/bygg"],
];

function metaContent(html, property) {
  const expression = new RegExp(`<meta property="${property}" content="([^"]+)"`);
  return html.match(expression)?.[1];
}

test("the e-mail preview is unavailable in production", async () => {
  const response = await fetch(`${siteUrl}/epost`);

  assert.equal(response.status, 404);
});

test("public pages expose route-specific social metadata", async () => {
  for (const [path, expectedTitle, expectedUrl] of publicPages) {
    const response = await fetch(`${siteUrl}${path}`);
    const html = await response.text();

    assert.equal(response.status, 200, `${path} must remain publicly available`);
    assert.equal(metaContent(html, "og:title"), expectedTitle, `${path} needs its own social title`);
    assert.equal(metaContent(html, "og:url"), expectedUrl, `${path} needs its own social URL`);
    assert.ok(metaContent(html, "og:image"), `${path} needs a social sharing image`);
  }
});

test("the home page publishes one authoritative local-business entity", async () => {
  const html = await fetch(siteUrl).then((response) => response.text());
  const jsonScripts = [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  const business = jsonScripts.find((entry) => entry["@type"] === "HomeAndConstructionBusiness");

  assert.ok(business, "the local-business entity must be present");
  assert.equal(business["@id"], "https://www.ges-ab.se/#business");
  assert.equal(business.url, "https://www.ges-ab.se");
  assert.equal(business.telephone, "+46707299633");
  assert.deepEqual(business.address, {
    "@type": "PostalAddress",
    streetAddress: "Östergärde Industriväg 39",
    postalCode: "417 29",
    addressLocality: "Göteborg",
    addressCountry: "SE",
  });
});

test("the home page uses bundled fonts and stable hero dimensions", async () => {
  const html = await fetch(siteUrl).then((response) => response.text());
  const heroPhoto = html.match(/<img[^>]+class="hero-photo"[^>]*>/)?.[0] ?? "";

  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  assert.match(heroPhoto, /width="856"/);
  assert.match(heroPhoto, /height="1024"/);
  assert.match(heroPhoto, /fetchPriority="high"/);
});
