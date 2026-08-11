/** Shared base URL for fetch-based tests. Point this at a fresh build, not a stray dev server. */
export const siteUrl = (
  process.env.TEST_BASE_URL ??
  process.env.SITE_URL ??
  "http://127.0.0.1:3000"
).replace(/\/$/, "");
