import assert from "node:assert/strict";
import test from "node:test";

import { isElementInRevealRange } from "../app/blog/reveal-utils.mjs";

test("content already inside the viewport reveals without waiting for an observer event", () => {
  assert.equal(
    isElementInRevealRange({ top: 400, bottom: 950 }, 1000),
    true,
  );
});

test("content below the viewport stays hidden until scrolling reaches it", () => {
  assert.equal(
    isElementInRevealRange({ top: 1200, bottom: 1680 }, 1000),
    false,
  );
});
