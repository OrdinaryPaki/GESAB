# Interaction And Motion Fidelity

## Purpose

Static screenshots are not enough. A page is not visually reconstructed if visible interactive components are copied only in their default state but do not behave like the reference.

Default fidelity levels:

- L1 static visual fidelity: required.
- L2 functional interaction fidelity: required.
- L3 motion micro-fidelity: P2 unless the user explicitly asks for motion-perfect cloning.

Do not chase frame-perfect Framer motion by default. Do require that visible interactions work, visibly change state, and feel close to the reference.

## Interaction Inventory

Main must create:

```text
.visual-clone/blueprint/interaction-map.json
```

For each selected route/template, inspect and record visible interactive elements:

- nav menus
- mobile nav
- dropdowns
- FAQ accordions
- tabs
- carousels/sliders
- forms and inputs
- buttons and links
- cards with hover states
- modals
- sticky headers
- scroll reveal animations
- animated counters/stats
- marquee/looping animations
- hover image/media effects

Use Browser/CDP to identify candidates:

- `button`
- `a`
- `[role="button"]`
- `[aria-expanded]`
- `[aria-controls]`
- `details summary`
- `input`, `textarea`, `select`
- elements with CSS `transition`, `animation`, `transform`, `opacity`, or `filter`
- elements that visibly change on hover, click, focus, scroll, or viewport entry

## Required State Capture

For each interactive component family, capture representative state screenshots:

- default
- hover
- active/focus when visually distinct
- open/expanded
- closed/collapsed
- selected tab
- mobile menu open
- scrolled/sticky state
- revealed state after scroll

Do not capture every repeated item if the behavior is identical. Capture one canonical example and at least one additional sample for repeated patterns when useful.

Store screenshots as:

```text
.visual-clone/reference/screenshots/{mission-id}.{component}.{state}.{viewport}.png
.visual-clone/reports/{mission-id}/{component}.{state}.{viewport}.png
```

## Implementation Rule

Workers must implement the interaction behavior for every interactive component in their assigned mission.

A component is not complete if only its default screenshot matches but its visible state behavior is missing.

Examples:

- FAQ must expand/collapse.
- Accordion icons must rotate/change if the reference does.
- Tabs must switch content and active state.
- Mobile nav must open/close.
- Button/card hover states must exist when visibly present in reference.
- Scroll reveals must trigger when the reference has obvious reveal behavior.

## Motion Foundation

Main must record shared motion patterns in:

```text
.visual-clone/blueprint/motion-foundation.v1.json
```

Include:

- default transition duration
- easing
- hover transform scale/translate
- hover shadow/color behavior
- reveal animation direction
- reveal distance
- reveal opacity behavior
- stagger timing
- sticky header behavior
- menu open/close behavior

Workers must reuse shared motion primitives instead of inventing separate animation styles per route.

## Severity

P0 interaction blocker:

- mobile nav does not open or close
- primary navigation is unusable
- accordion/tab/dropdown content cannot be accessed
- required modal or form interaction is broken
- main content depends on interaction and remains inaccessible

P1 interaction must fix:

- major hover states are missing
- FAQ/accordion opens but visual state is clearly wrong
- tabs/carousels work but active state is clearly wrong
- obvious scroll reveal animations are missing
- sticky header behavior is visibly wrong
- transition behavior feels materially different from reference

P2 acceptable if documented:

- exact easing curve differs slightly
- tiny delay/stagger mismatch
- minor hover shadow/scale difference
- decorative parallax is approximate
- micro-animation differs but does not change perceived interaction quality

A deviation may be P2 only when the component is functional, default and changed states were checked, the difference does not affect layout/readability/navigation/perceived interaction quality, and the report explains why it is P2.

## Stop Rule

Do not loop indefinitely on L3 micro-motion.

For each interaction family:

1. Capture reference default and changed state.
2. Implement behavior.
3. Capture local default and changed state.
4. Fix P0/P1 deviations.
5. If micro-timing remains different but behavior and perceived motion are close, document as P2 and move on.

If P1 remains after repeated attempts and changes no longer improve the result, report `needs_foundation_decision` or ask main for a repair order. Do not silently downgrade P1 to P2.
