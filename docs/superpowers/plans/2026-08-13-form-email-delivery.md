# GESAB Form Email Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace simulated form success with verified Resend delivery to `arijana@ges-ab.se` plus a customer confirmation matching the intentional `/epost` preview.

**Architecture:** All forms post one bounded JSON contract to a stateless Next.js route. Focused server modules validate, build safe content, and deliver two idempotent messages; one shared browser helper owns request/error behavior while form components remain presentation-focused.

**Tech Stack:** Next.js 16 App Router, React 19, Node test runner, Resend SDK, Vercel environment variables.

## Global Constraints

- The authoritative GESAB address and sender is `arijana@ges-ab.se`.
- The `/epost` route remains an intentional preview and keeps its existing visual layout.
- Success appears only after both internal and customer messages are accepted.
- Provider credentials and errors never reach browser code.
- Existing unrelated changes in `app/contact/ContactMap.js` and `app/contact/contact-info.module.css` must not be modified or committed.
- No database, CRM, blog form, branch, worktree, pull request, or push is part of this task.

---

### Task 1: Shared inquiry contract and email content

**Files:**
- Create: `app/lib/inquiries/constants.mjs`
- Create: `app/lib/inquiries/validation.mjs`
- Create: `app/lib/inquiries/email-content.mjs`
- Test: `tests/inquiry-validation.test.mjs`
- Test: `tests/inquiry-email-content.test.mjs`

**Interfaces:**
- Produces: `normalizeInquiry(raw) -> { ok: true, inquiry } | { ok: false, errors }`
- Produces: `buildInquiryEmails(inquiry, now?) -> { internal, customer }`
- Produces: `GESAB_EMAIL`, `INQUIRY_SOURCES`, and bounded field rules.

- [ ] **Step 1: Write failing validation tests**

```js
test("normalizes the contact form into one shared inquiry", () => {
  assert.deepEqual(normalizeInquiry(validContact), {
    ok: true,
    inquiry: {
      source: "contact",
      submissionId: "11111111-1111-4111-8111-111111111111",
      name: "Anna Andersson",
      email: "anna@example.com",
      phone: "",
      service: "badrumsrenovering",
      message: "Jag vill ha en offert.",
    },
  });
});

test("rejects unknown sources, malformed email and oversized content", () => {
  const result = normalizeInquiry({ ...validContact, source: "admin", email: "fel", message: "x".repeat(5001) });
  assert.equal(result.ok, false);
  assert.deepEqual(result.errors.sort(), ["email", "message", "source"]);
});
```

- [ ] **Step 2: Run validation tests and confirm the missing-module failure**

Run: `node --test tests/inquiry-validation.test.mjs`

Expected: FAIL because `app/lib/inquiries/validation.mjs` does not exist.

- [ ] **Step 3: Implement the minimal contract and validation**

```js
export function normalizeInquiry(raw) {
  const errors = [];
  // Trim strings, combine contact first/last names, enforce source-specific
  // required fields, UUID format, email format, and exact length bounds.
  return errors.length ? { ok: false, errors } : { ok: true, inquiry };
}
```

- [ ] **Step 4: Run validation tests and confirm they pass**

Run: `node --test tests/inquiry-validation.test.mjs`

Expected: PASS with zero failures.

- [ ] **Step 5: Write failing email-content tests**

```js
test("builds the internal message for Arijana with customer reply-to", () => {
  const { internal } = buildInquiryEmails(validInquiry, new Date("2026-08-13T10:00:00Z"));
  assert.equal(internal.to, "arijana@ges-ab.se");
  assert.equal(internal.replyTo, "anna@example.com");
  assert.equal(internal.subject, "Ny förfrågan: Badrumsrenovering – Anna Andersson (13 aug.)");
});

test("escapes customer-controlled HTML in both messages", () => {
  const emails = buildInquiryEmails({ ...validInquiry, message: "<img src=x onerror=alert(1)>" });
  assert.doesNotMatch(emails.internal.html, /<img/);
  assert.match(emails.internal.html, /&lt;img/);
});
```

- [ ] **Step 6: Run content tests and confirm the missing-module failure**

Run: `node --test tests/inquiry-email-content.test.mjs`

Expected: FAIL because `app/lib/inquiries/email-content.mjs` does not exist.

- [ ] **Step 7: Implement safe internal and customer email builders**

```js
export function buildInquiryEmails(inquiry, now = new Date()) {
  return {
    internal: { from: INTERNAL_FROM, to: GESAB_EMAIL, replyTo: inquiry.email, subject, html, text },
    customer: { from: CUSTOMER_FROM, to: inquiry.email, replyTo: GESAB_EMAIL, subject, html, text },
  };
}
```

- [ ] **Step 8: Run both Task 1 test files**

Run: `node --test tests/inquiry-validation.test.mjs tests/inquiry-email-content.test.mjs`

Expected: PASS with zero failures.

### Task 2: Idempotent Resend delivery and API handler

**Files:**
- Create: `app/lib/inquiries/delivery.mjs`
- Create: `app/lib/inquiries/handler.mjs`
- Create: `app/api/inquiries/route.js`
- Modify: `package.json`
- Modify: `package-lock.json`
- Test: `tests/inquiry-delivery.test.mjs`
- Test: `tests/inquiry-handler.test.mjs`

**Interfaces:**
- Consumes: `normalizeInquiry`, `buildInquiryEmails`.
- Produces: `deliverInquiry(resend, inquiry) -> Promise<void>`.
- Produces: `handleInquiryRequest(request, deliver) -> Promise<Response>`.
- Route `POST` injects the server-only Resend client into the tested handler.

- [ ] **Step 1: Write failing delivery tests**

```js
test("sends internal and customer messages with separate stable idempotency keys", async () => {
  const sent = [];
  const resend = { emails: { send: async (...args) => { sent.push(args); return { data: { id: String(sent.length) }, error: null }; } } };
  await deliverInquiry(resend, validInquiry);
  assert.equal(sent.length, 2);
  assert.equal(sent[0][1].idempotencyKey, `${validInquiry.submissionId}-internal`);
  assert.equal(sent[1][1].idempotencyKey, `${validInquiry.submissionId}-customer`);
});
```

- [ ] **Step 2: Run delivery tests and confirm the missing-module failure**

Run: `node --test tests/inquiry-delivery.test.mjs`

Expected: FAIL because `delivery.mjs` does not exist.

- [ ] **Step 3: Implement sequential, retry-safe delivery**

```js
export async function deliverInquiry(resend, inquiry) {
  const messages = buildInquiryEmails(inquiry);
  await sendRequiredEmail(resend, messages.internal, `${inquiry.submissionId}-internal`);
  await sendRequiredEmail(resend, messages.customer, `${inquiry.submissionId}-customer`);
}
```

- [ ] **Step 4: Run delivery tests and confirm success**

Run: `node --test tests/inquiry-delivery.test.mjs`

Expected: PASS, including provider-error propagation.

- [ ] **Step 5: Write failing handler tests**

```js
test("returns success only after delivery resolves", async () => {
  const response = await handleInquiryRequest(jsonRequest(validContact), async () => {});
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
});

test("rejects a filled honeypot without calling delivery", async () => {
  let calls = 0;
  const response = await handleInquiryRequest(jsonRequest({ ...validContact, website: "spam.example" }), async () => { calls += 1; });
  assert.equal(response.status, 400);
  assert.equal(calls, 0);
});
```

- [ ] **Step 6: Run handler tests and confirm the missing-module failure**

Run: `node --test tests/inquiry-handler.test.mjs`

Expected: FAIL because `handler.mjs` does not exist.

- [ ] **Step 7: Implement bounded request handling and public-safe errors**

```js
export async function handleInquiryRequest(request, deliver) {
  // Enforce JSON, a 16 KiB limit, empty honeypot, validated payload,
  // and generic 400/413/415/503 responses without logging personal data.
}
```

- [ ] **Step 8: Run handler tests and confirm success**

Run: `node --test tests/inquiry-handler.test.mjs`

Expected: PASS for valid, malformed, spam, oversized, and delivery-error cases.

- [ ] **Step 9: Install the pinned Resend SDK and wire the route**

Run: `npm install --save-exact resend`

Implementation:

```js
import { Resend } from "resend";
import { handleInquiryRequest } from "../../lib/inquiries/handler.mjs";
import { deliverInquiry } from "../../lib/inquiries/delivery.mjs";

export async function POST(request) {
  return handleInquiryRequest(request, (inquiry) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    return deliverInquiry(resend, inquiry);
  });
}
```

- [ ] **Step 10: Run all new server tests**

Run: `node --test tests/inquiry-validation.test.mjs tests/inquiry-email-content.test.mjs tests/inquiry-delivery.test.mjs tests/inquiry-handler.test.mjs`

Expected: PASS with zero failures.

### Task 3: Shared browser submission and all form connections

**Files:**
- Create: `app/lib/inquiries/submit-inquiry.mjs`
- Create: `app/components/InquiryFormSupport.js`
- Create: `app/components/InquiryFormSupport.css`
- Modify: `app/contact/ContactForm.js`
- Modify: `app/contact/ContactForm.css`
- Modify: `app/components/AppointmentForm.js`
- Modify: `app/components/AppointmentForm.css`
- Modify: `app/service/[slug]/ServiceQuoteForm.js`
- Modify: `app/service/[slug]/ServiceQuoteForm.css`
- Test: `tests/inquiry-submit-client.test.mjs`

**Interfaces:**
- Produces: `submitInquiry(payload, dependencies?) -> Promise<{ ok: true }>`.
- All forms pass source-specific fields and display the shared Swedish error message when the request fails.

- [ ] **Step 1: Write failing browser-helper tests**

```js
test("posts one submission with a generated stable ID", async () => {
  const calls = [];
  await submitInquiry({ source: "footer", name: "Anna", email: "anna@example.com", phone: "0701234567", message: "Hej" }, {
    createId: () => "11111111-1111-4111-8111-111111111111",
    fetchImpl: async (...args) => { calls.push(args); return new Response(JSON.stringify({ ok: true }), { status: 200 }); },
  });
  assert.equal(calls.length, 1);
  assert.equal(JSON.parse(calls[0][1].body).submissionId, "11111111-1111-4111-8111-111111111111");
});

test("throws the same public error for non-success responses", async () => {
  await assert.rejects(() => submitInquiry(validPayload, { fetchImpl: async () => new Response("{}", { status: 503 }) }), /kunde inte skickas/);
});
```

- [ ] **Step 2: Run the helper tests and confirm the missing-module failure**

Run: `node --test tests/inquiry-submit-client.test.mjs`

Expected: FAIL because `submit-inquiry.mjs` does not exist.

- [ ] **Step 3: Implement the minimal shared browser helper**

```js
export async function submitInquiry(payload, { fetchImpl = fetch, createId = () => crypto.randomUUID() } = {}) {
  const response = await fetchImpl("/api/inquiries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...payload, submissionId: createId() }) });
  if (!response.ok) throw new Error(PUBLIC_ERROR);
  return response.json();
}
```

- [ ] **Step 4: Run helper tests and confirm success**

Run: `node --test tests/inquiry-submit-client.test.mjs`

Expected: PASS with zero failures.

- [ ] **Step 5: Replace simulated timers in all forms**

```js
try {
  await submitInquiry({ source: "contact", ...formData, website });
  setStatus("success");
} catch {
  setStatus("error");
}
```

Add `InquiryHoneypot`, retain entered data on failure, disable repeat submission while pending, and render the same accessible Swedish retry message in every form.

- [ ] **Step 6: Run unit tests and production build**

Run: `node --test tests/inquiry-*.test.mjs && npm run build`

Expected: all inquiry tests PASS and the Next.js production build exits 0.

### Task 4: Align the intentional preview and verify the whole application

**Files:**
- Modify: `app/epost/page.js`
- Test: `tests/inquiry-preview.test.mjs`

**Interfaces:**
- Consumes: the shared `GESAB_EMAIL` constant and subject/content rules.
- Preserves: all existing `/epost` toggles, sample customer data, and layout.

- [ ] **Step 1: Write the failing preview behavior test**

```js
test("the email preview uses the authoritative GESAB mailbox", () => {
  assert.deepEqual(buildPreviewHeaders({ recipient: "internal", source: "contact" }, fixedDate), {
    from: "GESAB Hemsida <arijana@ges-ab.se>",
    to: "GESAB <arijana@ges-ab.se>",
    subject: "Ny förfrågan: Badrumsrenovering – Anna Andersson (13 aug.)",
  });
});
```

- [ ] **Step 2: Run the preview test against the old address behavior**

Run: `node --test tests/inquiry-preview.test.mjs`

Expected: FAIL because `buildPreviewHeaders` does not exist.

- [ ] **Step 3: Reuse the shared address/content rules in `/epost`**

```js
const { from, to, subject } = buildPreviewHeaders({ recipient, source });
```

- [ ] **Step 4: Run complete automated verification**

Run: `node --test tests/inquiry-*.test.mjs`

Run: `npm run build`

Start an isolated server: `npm run start -- --port 3117`

In a second shell run: `TEST_BASE_URL=http://127.0.0.1:3117 node --test tests/*.test.mjs`

Stop the isolated port-3117 server with `Ctrl-C` after the tests finish.

Expected: zero test failures, build exit 0, and no warnings introduced by this task.

### Task 5: Add the existing Resend key to Vercel and perform a controlled delivery check

**Files:**
- No repository files unless Vercel CLI updates ignored `.vercel` metadata.

**Interfaces:**
- Requires: existing verified Resend account/domain and linked Vercel project.
- Produces: server-only `RESEND_API_KEY` in Development, Preview, and Production.

- [ ] **Step 1: Add the existing Resend API key to Vercel**

Run interactively without printing the secret:

```bash
vercel env add RESEND_API_KEY production
vercel env add RESEND_API_KEY preview
vercel env add RESEND_API_KEY development
```

Expected: the existing Resend account's API key is stored server-side for all three environments. Vercel Marketplace provisioning is intentionally not used because the available Resend Marketplace plans add a paid subscription; no paid plan may be selected without explicit approval.

- [ ] **Step 2: Confirm environment-variable presence without reading its value**

Run: `vercel env ls`

Expected: `RESEND_API_KEY` is listed for Development, Preview, and Production.

- [ ] **Step 3: Pull development configuration and run an isolated local server**

Run: `vercel env pull .env.local`

Run: `npm run dev -- --port 3118`

Expected: only the newly started isolated server uses the pulled server-side key; any pre-existing server remains untouched.

- [ ] **Step 4: Submit controlled test data to the local API**

```json
{
  "source": "contact",
  "submissionId": "a newly generated UUID",
  "firstName": "GESAB",
  "lastName": "Leveranskontroll",
  "email": "arijana@ges-ab.se",
  "service": "badrumsrenovering",
  "message": "Teknisk leveranskontroll från hemsidans nya formulärflöde.",
  "website": ""
}
```

Expected: HTTP 200 and `{ "ok": true }`, meaning Resend accepted both internal and customer messages. This does not prove inbox placement; provider/inbox confirmation must be reported separately.

- [ ] **Step 5: Re-run final verification and commit only task files**

Run: `node --test tests/inquiry-*.test.mjs && npm run build && git diff --check`

Review: `git status --short` and `git diff --stat`.

Commit only the implementation, tests, package files, preview adjustment, and this plan. Exclude the user's pre-existing contact-map/style changes.
