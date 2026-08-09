# OM OSS section audit

Reference: `https://plumbly.framer.website/about`  
Local: `http://localhost:3000/about`

## Geometry

| Section | Desktop reference/local | Mobile reference/local | Result |
| --- | --- | --- | --- |
| Story | y 0, h 873 / y 0, h 873 | y 0, h 1386 / y 0, h 1386 | Pass |
| Mission | y 873, h 1124 / y 873, h 1124 | y 1386, h 1753 / y 1386, h 1753 | Pass |
| Process | y 1997, h 825 / y 1997, h 825 | y 3139, h 917 / y 3139, h 917 | Pass |
| Team | y 2822, h 733 / y 2822, h 733 | y 4056, h 1511 / y 4056, h 1511 | Pass |
| Testimonials | y 3555, h 799 / y 3555, h 799 | y 5567, h 616 / y 5567, h 616 | Pass |
| FAQ | y 4354, h 602 / y 4354, h 602 | y 6183, h 979 / y 6183, h 979 | Pass |
| Contact | y 4956, h 822 / y 4956, h 822 | y 7162, h 1031 / y 7162, h 1031 | Pass |
| Footer | y 5778, h 555 / y 5778, h 555 | y 8193, h 993 / y 8193, h 994 | Pass (1 px rounding) |

Desktop total height is an exact 6333 px match. Mobile is 9187 px locally versus 9186 px in the reference.

## Typography and responsive behavior

- Outfit 600 is used for large headings; Inter is used for body copy.
- Desktop hero is 72/79.2 px and mobile hero is 40/44 px.
- Desktop section headings are 48/57.6 px and mobile section headings are 30/36 px.
- Mobile team uses three square cards, testimonials use a one-card horizontal scroll strip, and the mobile menu is a full-screen overlay.

## Interaction evidence

- Mobile menu: closed and open screenshots captured at 390x844.
- FAQ: open and closed screenshots captured; the controls use the reference chevron treatment.
- Testimonials: horizontal scroll measured from 0 px to 366 px.
- Phone CTA: hover background measured from 0% to 100%; keyboard focus shows a 3 px visible outline.
- Scroll content uses progressive enhancement: it remains visible if browser animation APIs do not initialize, preventing blank production sections.

## Remaining P2 differences

1. Swedish GESAB copy creates small line-break differences inside a few cards compared with the English reference copy.
2. Reference-only Google/social provider marks are not fabricated because the GESAB data has no corresponding provider or social profile URLs.

No unresolved P0 or P1 visual or interaction deviations remain.
