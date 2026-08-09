import assert from "node:assert/strict";
import test from "node:test";

let serviceSelectState = {};

try {
  serviceSelectState = await import("../app/components/service-select-state.mjs");
} catch {
  // The first test run proves the shared state model does not exist yet.
}

const options = [
  { label: "Badrumsrenovering", value: "badrumsrenovering" },
  { label: "Köksrenovering", value: "koksrenovering" },
  { label: "Totalentreprenad", value: "totalentreprenad" },
];

test("the service selector starts with its requested service selected", () => {
  assert.equal(
    typeof serviceSelectState.createServiceSelectState,
    "function",
    "the selector needs one shared initial-state rule",
  );
  assert.deepEqual(
    serviceSelectState.createServiceSelectState(options, "koksrenovering"),
    {
      activeIndex: 1,
      isOpen: false,
      selectedIndex: 1,
    },
  );
});

test("keyboard navigation wraps from the first service to the last", () => {
  assert.equal(
    typeof serviceSelectState.reduceServiceSelectState,
    "function",
    "the selector needs one shared interaction rule",
  );

  const initialState = serviceSelectState.createServiceSelectState(options);
  const openState = serviceSelectState.reduceServiceSelectState(
    initialState,
    { type: "open" },
    options.length,
  );
  const movedState = serviceSelectState.reduceServiceSelectState(
    openState,
    { direction: -1, type: "move" },
    options.length,
  );

  assert.equal(openState.isOpen, true);
  assert.equal(movedState.activeIndex, 2);
});

test("choosing a service records it and closes the menu", () => {
  const openState = serviceSelectState.reduceServiceSelectState(
    serviceSelectState.createServiceSelectState(options),
    { type: "open" },
    options.length,
  );
  const selectedState = serviceSelectState.reduceServiceSelectState(
    openState,
    { index: 2, type: "select" },
    options.length,
  );

  assert.deepEqual(selectedState, {
    activeIndex: 2,
    isOpen: false,
    selectedIndex: 2,
  });
});

test("closing the service menu preserves its current selection", () => {
  const openState = serviceSelectState.reduceServiceSelectState(
    serviceSelectState.createServiceSelectState(options, "koksrenovering"),
    { type: "open" },
    options.length,
  );
  const closedState = serviceSelectState.reduceServiceSelectState(
    openState,
    { type: "close" },
    options.length,
  );

  assert.deepEqual(closedState, {
    activeIndex: 1,
    isOpen: false,
    selectedIndex: 1,
  });
});
