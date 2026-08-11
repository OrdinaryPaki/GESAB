import assert from "node:assert/strict";
import test from "node:test";

import { siteUrl } from "./helpers/site-url.mjs";

async function fetchPage(pathname) {
  const response = await fetch(new URL(pathname, siteUrl));
  assert.equal(response.status, 200);
  return response.text();
}

function assertTeamSectionIsAbsent(html) {
  assert.doesNotMatch(
    html,
    /class="team-section(?:\s|")/,
    "The trade-role team section must not be rendered",
  );
}

test("the home route does not render the trade-role team section", async () => {
  assertTeamSectionIsAbsent(await fetchPage("/"));
});

test("the About route does not render the trade-role team section", async () => {
  assertTeamSectionIsAbsent(await fetchPage("/about"));
});
