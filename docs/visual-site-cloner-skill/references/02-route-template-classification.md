# Route And Template Classification

## Route Inclusion Priority

Do not build every discovered URL blindly. Build deterministic design surfaces by priority.

P0 required:

- initial URL
- homepage if discoverable
- all primary nav routes
- all collection index routes linked from primary nav
- one canonical detail route per detected template family
- contact route if in primary nav or footer

P1 required if discovered:

- footer routes that introduce a new visual layout
- second instance per template family to verify classification
- mobile nav-only routes
- enough route instances to reproduce nav/data completeness

P2 optional:

- legal/policy pages
- tag/category/archive pages
- search pages
- pagination variants
- author pages

Exclude legal/policy pages only when they are visually irrelevant and do not affect the design system.

## Classification Types

Use these labels:

- `unique_page`: page has its own layout, e.g. home, about, contact
- `index_page`: collection listing page, e.g. services, blog, case studies
- `template_family`: reusable layout family, e.g. service detail, blog post
- `template_instance`: one concrete route using a template family
- `shared_component`: global or recurring UI, e.g. header, footer, CTA block

## Template Evidence

Classify routes as a template family when browser evidence shows the same design pattern with different content.

Evidence:

- same hero structure
- same section order
- same content rhythm
- same card/grid pattern
- same CTA placement
- same header/footer
- same responsive behavior
- differences are mostly text, image, slug, metadata, or list content

## Implementation Rule

If multiple routes share a pattern, build one template component plus data/routes.

Examples:

- service detail pages -> `ServiceDetailTemplate` + service data/routes
- blog posts -> `BlogPostTemplate` + post data/routes
- case studies -> `CaseStudyTemplate` + case data/routes

Do not create visually separate page implementations for CMS-like routes unless browser evidence proves materially different layouts.

For each template family:

- implement one reusable template
- create route/data entries for all P0/P1 detected template instances
- if all P0/P1 instances cannot be created, document exactly which instances were skipped and why
- visually QA the canonical instance
- sample-QA at least one additional instance when available
- do not handcraft each instance unless classified as materially different

## Blueprint Output

Write:

```text
.visual-clone/blueprint/route-map.json
.visual-clone/blueprint/template-families.json
```

Each template family must include:

- family id
- canonical reference route
- all detected instances
- evidence for grouping
- intended local template/component
- intended data source or static data file
