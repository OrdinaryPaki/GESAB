# SEO Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep `/epost` local to development and implement the approved non-blocking SEO improvements.

**Architecture:** Centralize site identity and metadata builders in a focused module, render one global local-business entity, and make the preview route enforce its environment boundary on the server. Keep existing external images unchanged while improving font and hero loading.

**Tech Stack:** Next.js 16 App Router, React 19, Node test runner.

## Global Constraints

- Do not add or modify sitemap, robots.txt, canonical metadata, placeholder images, gallery mock projects, or external image URLs.
- Do not modify the user's existing contact-map changes.
- Use production-visible behavior, not source-text assertions, for route and metadata tests.

---

### Task 1: Regression tests

**Files:**
- Create: `tests/seo-readiness.test.mjs`

**Interfaces:**
- Consumes: the production site URL from `tests/helpers/site-url.mjs`.
- Produces: integration coverage for `/epost`, public metadata, JSON-LD, local fonts, and trust copy.

- [ ] Write tests that expect production `/epost` to return 404, public routes to expose unique social metadata, the home page to contain the business entity, Google Fonts to be absent, and unverified trust copy to be absent.
- [ ] Run the test against the current production build and confirm failures describe the missing behavior.

### Task 2: Site identity and social metadata

**Files:**
- Create: `app/site-config.js`
- Create: `app/seo.js`
- Modify: `app/gesab-data.js`
- Modify: `app/layout.js`
- Modify: public page modules under `app/`

**Interfaces:**
- `siteConfig`: authoritative URL and business identity.
- `contactInfo`: authoritative contact data, re-exported for existing callers.
- `createPageMetadata({ title, description, path, image })`: page metadata without canonical output.
- `createLocalBusinessStructuredData()`: global Schema.org entity.

- [ ] Implement the shared configuration and metadata builder.
- [ ] Apply unique social metadata to every public route and service detail.
- [ ] Render the global business JSON-LD and point service providers at its `@id`.
- [ ] Run the focused integration tests.

### Task 3: Development-only e-mail preview

**Files:**
- Create: `app/epost/EpostPreviewClient.js`
- Modify: `app/epost/page.js`

**Interfaces:**
- The server page calls `notFound()` outside development.
- The client component retains the existing preview controls.

- [ ] Move the interactive preview into the client component.
- [ ] Add server-side environment enforcement and `noindex` metadata.
- [ ] Verify 200 in `next dev` and 404 in `next start`.

### Task 4: Fonts, hero loading, and trust copy

**Files:**
- Modify: `app/layout.js`
- Modify: `app/globals.css`
- Modify: `app/components/HomeSections.js`
- Modify: `app/contact/page.js`
- Modify: service content modules under `app/service/`

**Interfaces:**
- Local font variables provide Inter and Outfit without third-party font requests.
- Public copy contains no unverified named reviews, exact project totals, fixed ROT percentages, or unsupported certification guarantees.

- [ ] Configure the existing local WOFF2 files through `next/font/local` and remove Google Fonts links.
- [ ] Add intrinsic sizes and loading priority to the existing external hero images without changing their URLs.
- [ ] Replace unsupported trust claims with factual process language and remove testimonial rendering.
- [ ] Run all tests and the production build.

### Task 5: Final verification and commit

- [ ] Run the full test suite against a fresh production server on an unused port.
- [ ] Verify `/epost` in both dev and production modes.
- [ ] Inspect `git diff` to ensure excluded areas and user-owned changes are untouched.
- [ ] Create one local commit containing only this task's files.
