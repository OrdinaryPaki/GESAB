# Browser Reconnaissance

## Browser-First Rule

Discovery must be browser-led.

Open the reference in Browser/CDP. Navigate the rendered page. Click visible nav links, footer links, buttons that reveal menus, and internal page links. Inspect rendered DOM and computed styles where useful. Capture screenshots.

Raw link extraction can assist discovery, but it must not replace rendered inspection.

If the browser cannot access the reference route, report blocked with the observed error. Do not infer visual structure from unavailable pages.

## Viewports

Use at least:

- desktop: 1440px wide
- mobile: 390px wide

Add tablet or wide desktop when the reference visibly changes layout at those sizes.

## Discovery Inputs

Inspect:

- primary nav
- mobile nav
- footer
- visible CTAs
- index grids
- blog/service/case links
- sitemap or robots only as supporting route evidence

## Reference Capture

For each selected route/template:

- full-page screenshot
- above-the-fold screenshot
- section screenshots when sections are complex
- interaction screenshots for menus, hover states, accordions, tabs, or animated reveals

Store screenshots with stable names:

```text
.visual-clone/reference/screenshots/{mission-id}.{viewport}.{part}.png
```

Record every screenshot in `.visual-clone/screenshot-manifest.json` with route, viewport, foundation version, worktree/branch, commit or checkpoint id, timestamp, and screenshot type.

## Interaction Reconnaissance

During browser reconnaissance, main must actively test visible interactions. Do not infer that a component is static just because the first screenshot is static.

For each selected route/template:

1. Hover major buttons, nav links, cards, and media blocks.
2. Click FAQ, accordion, tabs, dropdowns, modal triggers, and carousels.
3. Open and close mobile navigation.
4. Focus visible form fields and controls when focus state is visible.
5. Scroll through the page and observe reveal, sticky, parallax, marquee, or looping animation behavior.
6. Record default and changed states in `.visual-clone/blueprint/interaction-map.json`.
7. Capture representative state screenshots.

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

Do not capture every repeated item when behavior is identical. Capture one canonical example and at least one additional sample for repeated patterns when useful.

## Rendered Style Extraction

Use CDP/DOM inspection to collect:

- font family, size, weight, line height
- colors and backgrounds
- section padding and margins
- container widths
- grid columns/gaps
- border radius, shadows, borders
- image dimensions and aspect ratios
- animation timing, easing, trigger points

Screenshots decide visual truth. DOM metrics explain how to reproduce it.
