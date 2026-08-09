import assert from "node:assert/strict";
import test from "node:test";

let faqState = {};

try {
  faqState = await import("../app/components/faq-accordion-state.mjs");
} catch {
  // The first test run proves the shared state model does not exist yet.
}

test("the first FAQ item starts open", () => {
  assert.equal(
    typeof faqState.getInitialOpenFaqIndex,
    "function",
    "the accordion needs one shared initial-state rule",
  );
  assert.equal(faqState.getInitialOpenFaqIndex(), 0);
});

test("opening another FAQ item replaces the previously open item", () => {
  assert.equal(
    typeof faqState.getNextOpenFaqIndex,
    "function",
    "the accordion needs one shared selection rule",
  );
  assert.equal(faqState.getNextOpenFaqIndex(0, 2), 2);
});

test("selecting the open FAQ item closes it", () => {
  assert.equal(faqState.getNextOpenFaqIndex(2, 2), null);
});
