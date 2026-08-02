# Blog index section audit

Route: `/blog`

Reference: `https://plumbly.framer.website/blog`

Viewports: `1440 × 1000` and `390 × 844`

| Section or state | Desktop | Mobile | Result |
| --- | --- | --- | --- |
| Header and hero | H1 starts at y=170; 72/79.2 Outfit 600 | H1 starts at y=120; 40/44 Outfit 600 | Pass |
| Featured cards | Grid x=120, y=382.39, width=1200 | First card x=20, y=303.78, width=350, height=446.34 | Pass |
| Mobile featured card rhythm | N/A | Image, category, title, excerpt and CTA positions match the reference measurements | Pass |
| Read More Articles | x=120, y=1094.38, width=1200 | y=1687.22 after removing the reference template overlay | Pass |
| Article grid | Three 386.66px columns; first row y=1207.97 | One 350px column; 20px row gaps | Pass |
| Load More | Hidden on desktop | 3 cards before click, 6 cards after click; button removed after expansion | Pass |
| Card hover | Title and CTA become rgb(22,129,255) | Touch layout preserved | Pass |
| Mobile navigation | Desktop navigation preserved | Full-width panel, centered close icon, closed/open states verified | Pass |
| Scroll reveal | Featured and article groups reveal once | Same behavior verified | Pass |
| Full page | Main page height 3751px before viewport-specific shared footer differences | Main content positions match; GESAB contact/footer intentionally preserved | Pass |

Unresolved P0: 0

Unresolved P1: 0

Remaining P2: 0
