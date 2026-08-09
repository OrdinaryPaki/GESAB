import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.TEST_BASE_URL ?? "http://localhost:3000";

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
  const bookingForms = html.match(/class="appointment-card"/g) ?? [];

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
  assert.doesNotMatch(
    html,
    /class="contact-band"/,
    "the old full-width contact band must not duplicate the new in-page quote experience",
  );
});

test("every service detail renders decision-helping content, FAQs and related services", async () => {
  for (const slug of serviceSlugs) {
    const html = await fetchServicePage(slug);
    const faqQuestions = html.match(/class="faq-question"/g) ?? [];
    const relatedServices = html.match(/data-related-service=/g) ?? [];

    assert.match(html, /Så arbetar vi/, `${slug} must explain the work process`);
    assert.match(
      html,
      /Det här påverkar offert och tidplan/,
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
    const suitableForItems = html.match(/data-service-fit=/g) ?? [];
    const preparationItems = html.match(/data-service-preparation=/g) ?? [];

    assert.match(
      html,
      /data-service-audience=/,
      `${slug} must identify its relevant customer groups`,
    );
    audienceLabels.push(audienceLabel);
    assert.match(html, /När passar tjänsten\?/, `${slug} must explain suitable project types`);
    assert.ok(
      suitableForItems.length >= 3,
      `${slug} must include at least three concrete project types`,
    );
    assert.match(
      html,
      /Inför första genomgången/,
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
  const suitableForPosition = html.indexOf("data-service-fit-section");
  const detailPosition = html.indexOf("data-service-detail-section");
  const preparationPosition = html.indexOf("data-service-preparation-section");
  const processPosition = html.indexOf("data-service-process-section");

  assert.ok(introPosition >= 0, "the article must start with its service-specific introduction");
  assert.ok(
    supportingImagePosition > introPosition,
    "the supporting image must follow the introduction",
  );
  assert.ok(
    suitableForPosition > supportingImagePosition,
    "project guidance must follow the early supporting image",
  );
  assert.ok(detailPosition > suitableForPosition, "detailed service copy must follow project guidance");
  assert.ok(
    preparationPosition > detailPosition && preparationPosition < processPosition,
    "preparation guidance must sit naturally before the work process",
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
