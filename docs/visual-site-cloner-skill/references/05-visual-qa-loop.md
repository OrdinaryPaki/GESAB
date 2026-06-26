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
14. Run animation/interaction pass where relevant.
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

Do not loop indefinitely on P2 differences. After reasonable section passes, document P2 and move on.

If repeated changes are not improving visual match, stop that loop, document the blocker, and ask main for a repair order or foundation decision.
