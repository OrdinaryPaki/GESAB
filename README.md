# GESAB Hemsida

Next.js-projekt med React och Tailwind.

Direkta paket är pinnade till versioner som fanns tillgängliga senast 16 juni 2026:

- `next`: `16.2.9`
- `react`: `19.2.7`
- `react-dom`: `19.2.7`
- `tailwindcss`: `4.3.1`
- `@tailwindcss/postcss`: `4.3.1`

`.npmrc` använder `before=2026-06-17T00:00:00.000Z` så `npm install` inte väljer paketversioner publicerade efter gränsdatumet.

Projektet använder också en npm override för Nexts interna `postcss`, eftersom `next@16.2.9` annars installerar `postcss@8.4.31`, som npm audit flaggar. Overriden använder `postcss@8.5.15`, publicerad före gränsdatumet och utanför den sårbara versionserien.

## Kommandon

```bash
npm install
npm run dev
npm run build
```

## Annons- och kontaktmätning

Vercel Web Analytics registrerar `inquiry_started`, `inquiry_submitted`,
`phone_click` och `email_click`. Formulärhändelser innehåller enbart formulärtyp
och tjänst, kontaktklick en tillåten sidväg. Inga formulärvärden skickas till
Vercel. En start räknas vid första ändringen, fram till att formuläret återställs.
En inskickning räknas efter serverns bekräftelse; återförsök med samma
inskicknings-ID räknas inte igen i samma formulärsession. Telefonklick betyder
inte genomförda samtal och e-postklick betyder inte skickade mejl.

Google Ads-konverteringen **GESAB – Skickad förfrågan** är konfigurerad i
`app/tracking/google-ads-config.mjs`, med koden verifierad i kontot 216-350-5944.
Den räknar en förfrågan per annonsinteraktion och tilldelar inget försäljningsvärde.
`NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_TARGET` kan vid behov ersätta målet vid
bygge. Värdet är offentlig konfiguration i formatet `AW-<id>/<label>`, ingen
hemlighet. Ett tomt eller ogiltigt ersättningsvärde stänger av konverteringen.
Med giltigt värde skickas enbart bekräftade
förfrågningar och endast vid aktivt annonssamtycke; det slumpmässiga
inskicknings-ID:t används som `transaction_id` för dubblettskydd.

Kontrollera efter publicering både Vercels händelser och Google Ads
konverteringsdiagnostik med korrekt samtycke. Google-taggen ska tillhöra samma
konto som konverteringen. Undvik en parallell URL-baserad konvertering för samma
förfrågan som skulle dubbelräkna resultatet.

## Lagring och uppföljning av förfrågningar

Servern sparar förfrågan i Neon före e-postleveransen. Samma inskicknings-ID
kan användas vid återförsök; ett ändrat innehåll kräver ett nytt ID. En sparad
förfrågan finns kvar även om e-postleveransen misslyckas och kan synkas till
kalkylarket. Formuläret bekräftar framgång först när e-postleveransen är klar.
Automatisk återleverans av misslyckade mejl ingår inte; besökarens återförsök
återupptar leveransen med samma ID.

`DATABASE_URL`, `RESEND_API_KEY` och `LEAD_SYNC_SECRET` ska endast finnas på
servern. Synkhemligheten ska vara minst 32 tecken. Kör de granskade
databasmigreringarna med `node scripts/migrate-leads.mjs --apply` i avsedd
miljö. Utan `--apply` kontrollerar kommandot att tabeller och index finns.
Migreringarna är applicerade i produktionsdatabasen `gesab-leads` i Frankfurt.

Google-kalkylarket är arbetsytan för status, ansvarig, nästa kontakt,
anteckningar, bokningsdatum och affärsvärde. Databasen behåller originalet och
kvitterade statusändringar. Synken hämtar högst 100 förfrågningar åt gången
med tidsbegränsade reservationer. Statusändringar har separata händelse-ID:n
så ett gammalt återförsök inte skriver över en senare ändring.

Drift- och installationsanvisningar finns i
[`integrations/google-sheets/README.md`](integrations/google-sheets/README.md).
Google Ads-kopplingen GESAB bokade jobb är ansluten för daglig import från
kalkylarkets första flik Google Ads-export. Bokade jobb mäts sekundärt.
Riktiga annonskonverteringar kan verifieras först när giltiga annonsleads finns.
Webbplatsens formulärhändelse betyder en mottagen förfrågan, aldrig ett bokat jobb.
