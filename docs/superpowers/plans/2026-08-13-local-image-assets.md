# Local Image Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve all ten current Framer-hosted website images locally without changing their bytes.

**Architecture:** Download the exact JPEG responses into two focused public asset folders and replace only the central data references. Protect the migration with checksum and rendered-page integration tests.

**Tech Stack:** Next.js 16, Node test runner, SHA-256.

## Global Constraints

- Do not convert, recompress, crop, resize, or visually edit any image.
- Do not change map tiles, external navigation links, placeholder images, or gallery mock data.
- Do not stage or commit the parallel contact-map, inquiry, package, or form-delivery work.

---

### Task 1: Asset contract

**Files:**
- Create: `tests/local-image-assets.test.mjs`

**Interfaces:**
- Consumes: the production URL supplied by `tests/helpers/site-url.mjs`.
- Produces: checksum, MIME-type, and rendered-page guarantees for all ten local images.

- [x] Write literal path and SHA-256 expectations for all ten source responses.
- [x] Assert that every file exists, matches its checksum, is publicly served as `image/jpeg`, and no public route contains `framerusercontent.com`.
- [x] Run the focused test before migration and confirm it fails because the local files do not exist and public HTML still contains Framer URLs.

### Task 2: Byte-preserving download

**Files:**
- Create: `public/images/site/hero-pattern.jpg`
- Create: `public/images/site/hero-plumber.jpg`
- Create: `public/images/site/about-pattern.jpg`
- Create: `public/images/site/contact-band-background.jpg`
- Create: `public/images/site/trust-badge.jpg`
- Create: `public/images/site/service-bathroom.jpg`
- Create: `public/images/team/vvs-montor.jpg`
- Create: `public/images/team/plattsattare.jpg`
- Create: `public/images/team/elektriker.jpg`
- Create: `public/images/team/snickare-malare.jpg`

**Interfaces:**
- Produces: ten immutable public JPEG assets addressed by `/images/site/*` and `/images/team/*`.

- [x] Download each existing response directly to its mapped path.
- [x] Compare each local SHA-256 against the independently captured source-response SHA-256.

### Task 3: Runtime references

**Files:**
- Modify: `app/gesab-data.js`
- Modify: `app/components/HomeSections.js`

**Interfaces:**
- `image`, `services`, and `team` retain their existing shapes and consumers.

- [x] Replace the ten Framer URLs with corresponding root-relative local paths.
- [x] Correct hero intrinsic dimensions to match the downloaded JPEG dimensions while keeping layout behavior unchanged.
- [x] Run focused image tests and existing SEO tests.

### Task 4: Verification and commit

- [x] Run a fresh production build and production server.
- [x] Run all tracked tests plus the new local-image test.
- [x] Verify `git diff --check` and confirm parallel work is unstaged.
- [ ] Create one local commit containing only the image migration.
