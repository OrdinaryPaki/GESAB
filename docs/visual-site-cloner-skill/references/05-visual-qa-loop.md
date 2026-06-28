# Visual QA Loop

## Method

Use a section-by-section visual lock loop. Do not build the whole page and only inspect at the end.

For each route/template:

1. Open reference page in Browser.
2. Capture full-page reference screenshot.
3. Identify section boundaries.
4. Start with header/hero.
5. Build only the current section.
6. Open local route.
7. Capture local screenshot.
8. Compare reference vs local.
9. Fix visible P0/P1 deviations.
10. Repeat until the section is visually locked.
11. Move to the next section.
12. After all sections, run full-page desktop pass.
13. Run mobile pass.
14. Run required interaction and motion state pass when `interaction-map.json` lists states for the route/template.
15. Submit report.

## Compare

Compare:

- section existence and order
- vertical rhythm
- spacing
- typography
- font weight
- line height
- colors
- media size and crop
- aspect ratio
- grid columns and gaps
- card rhythm
- header/footer alignment
- animation trigger, timing, and easing
- responsive behavior

Do not report ready based only on full-page screenshots. Each assigned route/template must provide:

- full-page desktop screenshot
- full-page mobile screenshot
- section-level screenshots for major sections
- state screenshots for interactive components listed in `interaction-map.json`
- a section audit ledger

## Section Audit Ledger

For each section, workers must maintain a short section audit ledger:

- section id or name
- reference screenshot
- local screenshot
- key visual anchors checked
- P0/P1/P2 deviations found
- fixes applied
- remaining deviations

Key visual anchors include:

- main heading bounding box
- main image or media bounding box
- primary card bounding box
- button bounding box
- section top and bottom spacing
- font family, size, weight, and line height
- dominant colors and backgrounds

## Severity

P0 blocker:

- missing section
- wrong route
- wrong template
- duplicate Header/Footer
- broken layout
- major responsive failure
- page visually reads as a different site

P1 must fix:

- visible spacing mismatch
- visible font mismatch
- wrong image size/aspect ratio
- wrong grid
- wrong card rhythm
- wrong animation behavior
- header/footer alignment clearly off

P2 acceptable if documented:

- tiny rounding differences
- anti-aliasing differences
- minor crop differences
- browser rendering differences
- differences that do not change perceived design

## Stop Rule

Do not stop with unresolved P0/P1 deviations.

Do not loop indefinitely on P2 differences.

A deviation may be classified as P2 only if:

- the component is functional
- default and changed states were checked when the component is interactive
- the difference does not affect layout, readability, navigation, or perceived interaction quality
- the report explains why it is P2

If repeated changes are not improving visual match, stop that loop, document the blocker, and ask main for a repair order or foundation decision.

## Section Pass Limits

For each section:

- minimum: 1 reference/local screenshot comparison pass
- default review checkpoint: after 3 correction passes for the same P1 deviation
- at the checkpoint, if the deviation is fixed, continue
- at the checkpoint, if the deviation is clearly improving, do one more focused pass or ask main
- at the checkpoint, if the deviation is not improving, stop the local loop and report `needs_foundation_decision` or request a repair order
- do not mark ready while unresolved P1 remains
- P0 deviations cannot be accepted as complete
- P2 deviations must not trigger more than 1 extra pass unless main explicitly orders it
