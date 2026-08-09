# Section audit — service-detail-x

Reference: `https://plumbly.framer.website/service/leak-detection-repair`  
Canonical local route: `/service/badrumsrenovering`  
Sample local route: `/service/koksrenovering`

| Section | Desktop evidence | Mobile evidence | Verified result |
| --- | --- | --- | --- |
| Header + hero | `reference/...desktop.fold.png` ↔ `local.desktop.final.fold.png` | `reference/...mobile.fold.png` ↔ `local.mobile.final.fold.png` | Desktop hero 988×640 at x=226; mobile hero 330×213.75 at x=30. Hero font is Outfit 72/600 desktop and 40/600 mobile. |
| Article | `reference/...desktop.article-top.png` ↔ `local.desktop.article-top.png` | Full-page mobile pair | Centered 827px desktop article and 350px mobile article; Outfit 32/600 desktop and 26/600 mobile; Inter 16/400 body. |
| Supporting media | Article/full-page pairs | Full-page pair | Supporting image is distinct from the hero and keeps the measured 827:494 ratio. |
| Return CTA | Full-page default pair and desktop hover pair | Full-page pair | 55.2px height, 600 weight locally, black default with blue hover fill. |
| Contact band + form | `reference/...desktop.contact.png` ↔ `local.desktop.contact.final.png` | Full-page pair and form-focus pair | One form only. Desktop 539×582; mobile 350×531.5. Input height 51.2px with 16/400 text. |
| Footer | Full-page desktop pair | Full-page mobile pair | Existing shared GESAB footer preserved after the matching contact band. |
| Mobile navigation | Mobile fold pair and menu-open pair | Mobile fold pair and menu-open pair | 84px header, 44px blue toggle, full-viewport white panel, working close state. |
| Additional template instance | `local.desktop.sample-koksrenovering.png` | `local.mobile.sample-koksrenovering.png` | One form, distinct images, no overflow at 1440px or 390px. |

## CDP measurements

- Desktop local: `scrollWidth = clientWidth = 1440`; one `.appointment-card`.
- Mobile local: `scrollWidth = clientWidth = 390`; one `.appointment-card`.
- Mobile local hero heading: x=30, y=120, w=330, h=88, 40px/44px, weight 600, letter-spacing -0.8px.
- Mobile local hero image: x=30, y=240, w=330, h=213.75.
- Mobile local article: x=20, w=350.
- Mobile local form: x=20, w=350, h=531.5.
- Sample route `/service/koksrenovering`: zero horizontal overflow at both measured viewports.

## Content policy

GESAB names, Swedish service copy, contact details, and service routes are intentionally preserved. The reference determines visual structure, font system, dimensions, spacing, media ratios, and interaction behavior—not the customer-facing brand content.
