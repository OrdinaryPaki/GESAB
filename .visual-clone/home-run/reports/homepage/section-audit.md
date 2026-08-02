# HOME section audit

Reference: `https://plumbly.framer.website/`

Local route: `/`

Foundation: `foundation.home.v1`

Evidence source: in-app Browser screenshots and CDP measurements.

## Desktop geometry — 1440 × 1000 CSS viewport

| Section | Reference start / height | Local start / height | Start delta | Evidence pair |
|---|---:|---:|---:|---|
| Hero | 0 / 1000 | 0 / 1000 | 0 px | `home.desktop.final.fold.jpg` |
| Support | 1000 / 286 | 1000 / 284 | 0 px | `home.desktop.support-why.jpg` |
| Why choose us | 1286 / 801 | 1284 / 801 | -2 px | `home.desktop.support-why.jpg` |
| Services | 2087 / 976 | 2085 / 976 | -2 px | `home.desktop.services.jpg` |
| About | 3063 / 933 | 3060 / 934 | -3 px | `home.desktop.about.jpg` |
| Team | 3996 / 751 | 3994 / 751 | -2 px | `home.desktop.team.jpg` |
| Testimonials | 4746 / 863 | 4745 / 863 | -1 px | `home.desktop.testimonials.jpg` |
| Process | 5610 / 886 | 5608 / 886 | -2 px | `home.desktop.process.jpg` |
| Gallery | 6496 / 1172 | 6494 / 1172 | -2 px | `home.desktop.gallery.jpg` |
| FAQ | 7668 / 602 | 7666 / 602 | -2 px | `home.desktop.faq.jpg` |
| Contact | 8270 / 822 | 8268 / 822 | -2 px | `home.desktop.contact.final.jpg` |
| Footer | 9092 / 555 | 9090 / 555 | -2 px | `home.desktop.footer.jpg` |
| Full document | 9647 | 9645 | -2 px | `home.desktop.full.final.jpg` |

Desktop anchor checks:

- Hero split: 720 / 720 px.
- Content container: 1200 px with 120 px page gutters.
- Hero heading: Outfit, 72 px, 600, 79.2 px line height, -1.44 px letter spacing, 468 × 238 px at x=120/y=273.
- Contact form: reference 539 × 582 px at x=781/y=120; local 540 × 581 px at x=780/y=120.
- Service cards, team cards, gallery columns, and contact grid were visually compared after their reveal animations completed.

## Mobile geometry — 390 × 844 CSS viewport

| Section | Reference start / height | Local start / height | Start delta | Evidence pair |
|---|---:|---:|---:|---|
| Hero | 0 / 862 | 0 / 862 | 0 px | `home.mobile.final.fold.png` |
| Support | 862 / 532 | 862 / 532 | 0 px | `home.mobile.support.png` |
| Why choose us | 1394 / 892 | 1394 / 892 | 0 px | `home.mobile.why.png` |
| Services | 2286 / 1780 | 2286 / 1779 | 0 px | `home.mobile.services.png` |
| About | 4066 / 1252 | 4065 / 1253 | -1 px | `home.mobile.about.png` |
| Team | 5318 / 1511 | 5318 / 1498 | 0 px | `home.mobile.team.png` |
| Testimonials | 6829 / 622 | 6816 / 626 | -13 px | `home.mobile.testimonials.png` |
| Process | 7451 / 939 | 7442 / 946 | -9 px | `home.mobile.process.png` |
| Gallery | 8389 / 1354 | 8387 / 1354 | -2 px | `home.mobile.gallery.png` |
| FAQ | 9743 / 979 | 9741 / 979 | -2 px | `home.mobile.faq-open.png` |
| Contact | 10722 / 1031 | 10721 / 1031 | -1 px | `home.mobile.contact.png` |
| Footer | 11753 / 994 | 11752 / 995 | -1 px | `home.mobile.footer.png` |
| Full document | 12747 | 12747 | 0 px | `home.mobile.full.final.jpg` |

Mobile anchor checks:

- Content width: 350 px with 20 px page gutters.
- Header: fixed at y=0, 85 px high, including at deep FAQ scroll positions.
- Hero: 587 px blue content followed by a 275 px image.
- Hero heading: Outfit, 40 px, 600, 44 px line height, 350 × 88 px.
- The 360 px and 768 px checks had no horizontal overflow (`scrollWidth === innerWidth`).

## Interaction audit

| Family | Reference evidence | Local evidence | Result |
|---|---|---|---|
| Mobile menu closed/open | `reference/home.mobile.final.fold.png`, `reference/home.mobile.menu-open.png` | `reports/homepage/local.mobile.final.fold.png`, `reports/homepage/local.mobile.menu-open.png` | Full white panel below the 85 px header; pass |
| Primary CTA default/hover | `reference/home.desktop.final.fold.jpg`, `reference/home.desktop.cta-hover.jpg` | `reports/homepage/local.desktop.final.fold.jpg`, `reports/homepage/local.desktop.cta-hover.jpg` | Remains yellow/black; pass |
| Service card default/hover | `reference/home.desktop.services.jpg`, `reference/home.desktop.service-hover.jpg` | `reports/homepage/local.desktop.services.jpg`, `reports/homepage/local.desktop.service-hover.jpg` | No movement, zoom, or shadow; pass |
| FAQ open/closed | `reference/home.mobile.faq-open.png`, `reference/home.mobile.faq-closed.png` | `reports/homepage/local.mobile.faq-open.png`, `reports/homepage/local.mobile.faq-closed.png` | Accordion state changes verified; pass |
| Appointment form default/focus | `reference/home.mobile.contact.png`, `reference/home.mobile.form-focus.png` | `reports/homepage/local.mobile.contact.png`, `reports/homepage/local.mobile.form-focus.png` | Focus border is black; no form was submitted; pass |
| Sticky mobile header | `reference/home.mobile.faq-open.png` | `reports/homepage/local.mobile.faq-open.png` | CDP measured `position: fixed`, top 0, height 85; pass |

## Severity ledger

- P0 unresolved: 0
- P1 unresolved: 0
- P2 remaining: 1
  - Reference-only Framer promotional chrome is intentionally not reproduced as part of the GESAB product UI.

Brand names, Swedish copy, contact details, and GESAB-specific navigation are intentional content adaptations. Their visual mass, line count, and placement were matched to the reference rather than copying Plumbly's identity.
