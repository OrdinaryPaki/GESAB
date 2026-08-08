import assert from "node:assert/strict";
import test from "node:test";

let navigationState = {};

try {
  navigationState = await import("../app/components/mobile-navigation-state.mjs");
} catch {
  // The first test run proves the shared mobile-navigation state does not exist yet.
}

test("the closed mobile menu exposes its closed accessibility state", () => {
  assert.equal(
    typeof navigationState.getMobileNavigationState,
    "function",
    "the mobile menu needs one shared state rule",
  );

  assert.deepEqual(navigationState.getMobileNavigationState(false), {
    ariaExpanded: "false",
    ariaLabel: "Öppna meny",
    locksPageScroll: false,
  });
});

test("the open mobile menu exposes its open accessibility state", () => {
  assert.deepEqual(navigationState.getMobileNavigationState(true), {
    ariaExpanded: "true",
    ariaLabel: "Stäng meny",
    locksPageScroll: true,
  });
});
