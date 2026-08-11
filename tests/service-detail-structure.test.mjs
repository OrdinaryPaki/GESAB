import assert from "node:assert/strict";
import test from "node:test";

import { siteUrl as baseUrl } from "./helpers/site-url.mjs";

const serviceSlugs = [
  "badrumsrenovering",
  "koksrenovering",
  "totalentreprenad",
  "rivningsarbeten",
  "bygg",
  "fasadrenovering",
  "snickeri",
  "malning",
  "montage",
];

async function fetchServicePage(slug) {
  const response = await fetch(`${baseUrl}/service/${slug}`);

  assert.equal(response.status, 200, `${slug} must render successfully`);

  return response.text();
}

test("service details keep one quote form beside the main content", async () => {
  const html = await fetchServicePage("badrumsrenovering");
  const bookingForms = html.match(/<form[^>]*data-service-quote-form/g) ?? [];

  assert.equal(
    bookingForms.length,
    1,
    "the detail page must expose one clear quote path without duplicating the form",
  );
  assert.match(
    html,
    /data-service-quote="badrumsrenovering"/,
    "the quote form must be contextual to the service being viewed",
  );
  assert.match(
    html,
    /data-contact-band/,
    "the shared contact band CTA must appear below related services",
  );
  assert.ok(
    html.indexOf("data-contact-band") > html.indexOf("related-services-title"),
    "the contact band must sit after the related services section",
  );
  assert.match(
    html,
    /data-appointment-form/,
    "the contact band must include the shared appointment form",
  );
});

test("every service detail renders decision-helping content, FAQs and related services", async () => {
  for (const slug of serviceSlugs) {
    const html = await fetchServicePage(slug);
    const faqQuestions = html.match(/class="faq-question"/g) ?? [];
    const relatedServices = html.match(/data-related-service=/g) ?? [];

    assert.match(html, /Så går det till/, `${slug} must explain the work process`);
    assert.match(
      html,
      /Vad påverkar priset\?/,
      `${slug} must explain the variables behind scope, price and timing`,
    );
    assert.match(html, /Vanliga frågor/, `${slug} must answer common questions`);
    assert.ok(faqQuestions.length >= 4, `${slug} must include at least four FAQs`);
    assert.equal(
      relatedServices.length,
      3,
      `${slug} must recommend exactly three relevant next services`,
    );
    assert.doesNotMatch(
      html,
      new RegExp(`data-related-service="${slug}"`),
      `${slug} must never recommend itself`,
    );
  }
});

test("every service detail explains who it suits and how to prepare", async () => {
  const audienceLabels = [];

  for (const slug of serviceSlugs) {
    const html = await fetchServicePage(slug);
    const audienceLabel = html.match(/data-service-audience="([^"]+)"/)?.[1];
    const fitSection = html.match(/data-service-fit-section[\s\S]*?(?=<img|data-service-detail-section)/)?.[0] ?? "";
    const suitableForItems = fitSection.match(/faq-item/g) ?? [];
    const preparationItems = html.match(/data-service-preparation=/g) ?? [];

    assert.match(
      html,
      /data-service-audience=/,
      `${slug} must identify its relevant customer groups`,
    );
    audienceLabels.push(audienceLabel);
    assert.match(html, /När passar tjänsten\?/, `${slug} must explain suitable project types`);
    assert.match(html, /data-service-fit-section/, `${slug} must include the fit guidance section`);
    assert.ok(
      suitableForItems.length >= 3,
      `${slug} must include at least three concrete project types`,
    );
    assert.match(
      html,
      /data-service-preparation-section/,
      `${slug} must help the customer prepare for the first conversation`,
    );
    assert.ok(
      preparationItems.length >= 3,
      `${slug} must include at least three preparation points`,
    );
  }

  assert.equal(
    new Set(audienceLabels).size,
    serviceSlugs.length,
    "each service must describe its own relevant customer groups",
  );
});

test("the service article introduces the work before guidance and moves supporting imagery up", async () => {
  const html = await fetchServicePage("badrumsrenovering");
  const introPosition = html.indexOf("data-service-introduction");
  const supportingImagePosition = html.indexOf("data-service-supporting-image");
  const detailPosition = html.indexOf("data-service-detail-section");
  const suitableForPosition = html.indexOf("data-service-fit-section");
  const processPosition = html.indexOf("data-service-process-section");
  const preparationPosition = html.indexOf("data-service-preparation-section");

  assert.ok(introPosition >= 0, "the article must start with its service-specific introduction");
  assert.ok(
    suitableForPosition > introPosition,
    "project guidance must follow the introduction copy",
  );
  assert.ok(
    supportingImagePosition > suitableForPosition,
    "the supporting image must follow project guidance",
  );
  assert.ok(
    detailPosition > supportingImagePosition,
    "detailed service copy must follow the early supporting image",
  );
  assert.ok(
    processPosition > detailPosition,
    "the work process must follow the detailed service copy",
  );
  assert.ok(
    preparationPosition > processPosition,
    "preparation guidance must follow the work process",
  );
});

test("service details use meaningful, distinct editorial images", async () => {
  const html = await fetchServicePage("badrumsrenovering");
  const images = [...html.matchAll(/<img[^>]*>/g)].map(([tag]) => ({
    alt: tag.match(/alt="([^"]*)"/)?.[1] ?? "",
    src: tag.match(/src="([^"]+)"/)?.[1] ?? "",
  }));
  const contentImages = images.filter(({ alt }) => alt.includes("Badrumsrenovering"));

  assert.ok(contentImages.length >= 2, "the service story must include hero and supporting imagery");
  assert.notEqual(
    contentImages[0].src,
    contentImages[1].src,
    "the supporting image must add context instead of repeating the hero",
  );
  assert.ok(
    contentImages.every(({ alt }) => alt.trim().length > 0),
    "editorial images must have useful alternative text",
  );
});
