# Lokala bildtillgångar – godkänd design

## Mål

Ersätta samtliga tio bildreferenser till `framerusercontent.com` med lokala filer, utan att konvertera, komprimera, beskära eller på annat sätt förändra bildinnehållet.

## Modell

- De exakta JPEG-responser som webbplatsen använder idag sparas under `public/images/site` och `public/images/team`.
- Filerna får beskrivande namn och behåller `.jpg`, eftersom källservern levererar `image/jpeg`.
- `app/gesab-data.js` förblir den gemensamma källan för webbplatsens bildval men använder lokala publika sökvägar.
- Delningsmetadata fortsätter använda samma bildval via befintliga metadatafunktioner.
- Kartplattor, kartlänkar och andra externa länkar ligger utanför ändringen.

## Verifiering

Varje lokal fil jämförs med SHA-256 för den hämtade källresponsen. Integrationstest kontrollerar att publika sidor inte längre innehåller Framer-bildadresser och att samtliga lokala filer serveras som JPEG.
