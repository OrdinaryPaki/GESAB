# Completion Gates

## No Self-Certification

No worker, sequential mission, or main-thread implementation may mark a route/template complete based on general confidence, build success, typecheck success, overflow checks, or informal visual inspection.

A mission may report `ready_for_main_review` only when the required evidence package exists and validates.

## Sequential Mode Does Not Weaken Requirements

If worktrees, subagents, or parallel workers are unavailable, main must run one sequential pseudo-worker mission per assigned route/template.

Each pseudo-worker mission must produce the same artifacts as a real worker:

- mission packet
- reference screenshots
- local screenshots
- section-level screenshots
- state screenshots for interactions
- section audit ledger
- worker_report XML
- validator result

Sequential mode is not permission to skip worker evidence, section audit, interaction state checks, or report validation.

## Route Exclusion Rule

If the user excludes a route, only that route is excluded.

Example:

```text
Ignore HOME, do all other pages
```

This means:

- do not visually rebuild `/`
- do not weaken the clone standard for `/about`, `/services`, `/projects`, `/blog`, `/contact`, or detected templates
- if shared CSS/components are changed, run before/after regression screenshots on the excluded route

## Existing Code Is Not The Reference

Existing local implementation is not authoritative.

If an included route differs materially from the reference route, rebuild the route structure to match the reference.

Do not preserve existing page structure, copy, images, spacing, or components when they prevent phase-1 reference fidelity, unless the user explicitly says to preserve that route's content or structure.

## Phase-1 Content Rule

During phase 1, reference copy, images, media dimensions, and content volume are visual measurement material.

Do not keep project/customer copy or images on included clone routes if doing so materially changes layout, wrapping, visual mass, contrast, section height, or component rhythm.

If exact reference assets cannot be reused, preserve visual mass and document the substitution.

Do not classify content-induced layout mismatch as P2 unless it is visually minor and does not alter layout or perceived design.

## Evidence Package Required

For each included route/template, before reporting ready, produce:

- full-page reference desktop screenshot
- full-page local desktop screenshot
- full-page reference mobile screenshot
- full-page local mobile screenshot
- section-level reference/local screenshot pairs for every major section
- state screenshot pairs for interactions listed in `interaction-map.json`
- section audit ledger
- `qa_summary` with `p0_unresolved = 0` and `p1_unresolved = 0`
- `interaction_summary` with `p0_interaction_unresolved = 0` and `p1_interaction_unresolved = 0` when interactions exist

If any required artifact is missing, status must be `blocked`, `needs_foundation_decision`, or `incomplete`, not `ready_for_main_review`.

## P2 Guard

A deviation may be P2 only if:

- the route structure matches
- the section exists in the right order
- the component is functional
- default and changed states were checked if interactive
- typography, spacing, media mass, and layout are already close
- the deviation does not change perceived design quality
- the report explains why it is P2

A page that does not look like the reference is never P2.

## Final Claim Gate

Do not say:

- `klart`
- `completed`
- `visual match`
- `matched`
- `done`
- `ready`

unless all included route/template reports pass validation and no P0/P1 deviations remain.

If evidence is incomplete, say one of:

- `partial implementation`
- `technical repair pass completed`
- `visual clone incomplete`
- `needs visual QA repair`
