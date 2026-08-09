# Contact page section audit

Reference: `https://plumbly.framer.website/contact`  
Local: `http://localhost:3000/contact`  
Desktop viewport: `1440x900`  
Mobile viewport: `390x844`

| Section | Desktop result | Mobile result | Evidence | Unresolved |
| --- | --- | --- | --- | --- |
| Fixed header | Matched 71.20px height and navigation placement | Matched 84.98px height and full-screen menu | fold and menu screenshots | none |
| Contact hero | Matched 745px desktop column, 350px mobile column, title typography and vertical anchors | Matched two-line 40/44px title and intro | fold screenshots plus CDP | none |
| Main enquiry form | Matched field grid, 16px radius, label/input typography and full-width submit | Matched stacked 350x679.95px form | fold, input-focus, hover screenshots | none |
| Contact cards | Matched three 332x280.4px cards | Matched three 350x280.4px stacked cards | full screenshots | none |
| Map | Matched 1200x704.98px desktop and 350x250px mobile geometry | Lazy-loaded successfully in the real viewport | loaded map screenshot plus CDP resource evidence | none |
| FAQ | Matched 370/560 desktop columns and exact 350x572.02px mobile list | Single-open behavior verified with the second answer open | default and second-open screenshots | none |
| Contact band | Matched 822px desktop height and 1031px mobile height | Appointment card matched 539x582px and 350x531.6px | full screenshots plus CDP | none |
| Footer | Matched 555.17px desktop and 994.17px mobile heights | Mobile stacking and spacing verified | full screenshots plus CDP | none |

## Final geometry checkpoints

- Desktop page height: reference `4414px`, local `4414px`.
- Desktop contact band top: reference `3037.22px`, local `3037.13px`.
- Mobile page height: reference `5405px`, local `5405px`.
- Mobile FAQ list: reference `572.02px`, local `572.02px`.
- Mobile contact band top: reference `3379.45px`, local `3379.33px`.
- Mobile footer top: reference `4410.45px`, local `4410.33px`.

No unresolved P0, P1, or P2 deviations remain.
