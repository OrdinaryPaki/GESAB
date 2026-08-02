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
