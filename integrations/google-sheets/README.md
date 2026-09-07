# GESAB: förfrågningar och bokade jobb

## Status

Publicerad på https://ges-ab.se den 7 september 2026. Alla tre migreringar
är applicerade i produktionsdatabasen. Resend och synkhemligheten är
konfigurerade i Vercel Production. `.env` är lokal, Git-ignorerad och undantas
från Vercel-uppladdning; servermiljön tillhandahålls av Vercel.

Arbetsbok: https://docs.google.com/spreadsheets/d/1OT2A7FqJy76IiD3LEuFcnz9BTsWMP0KlVYWMJ2C38RM/edit

Bundet skript: https://script.google.com/home/projects/1U0ZHXMx-_xatoGzGJKkkbeas3Cun7dRyS8T0vBzSx0l7P-HwmOk-3RuE/edit

Synk var femte minut och redigeringstrigger är installerade. Verifierat med
isolerade testposter: förfrågan och telefonklick till kalkylarket, återförsök
utan dubbletter, bokningsdatum och uttryckligt nollvärde tillbaka till databasen.
Testposterna är borttagna. Två mejl accepterades av Resend till tjänstens egna
testadress; återförsöket skickade inga ytterligare mejl. Testerna skickade
varken mejl till kunder/företaget eller annonskonverteringar.

## Google Ads-export

Första fliken **Google Ads-export** härleds från Förfrågningar. Formeln finns i
`google-ads-export.formula.txt` och är installerad i A2. Behåll exportbladet
först: Data Manager läser första fliken. Ändra kundärenden i Förfrågningar,
aldrig direkt i exporten.

Exporten kräver Bokat jobb, samtycke Ja, ärende-ID, minst ett GCLID/GBRAID/WBRAID,
giltigt bokningsdatum som inte ligger i framtiden och ett numeriskt värde >=0.
Tomt värde exkluderas, noll tillåts. Native test av 16 fall verifierade reglerna;
alla testvärden togs bort. Endast klick-ID:n, ärende-ID, datum, värde, SEK och
samtyckesvärden ingår; namn, e-post, telefon och meddelande exporteras inte.
Kopplingen **GESAB bokade jobb** är sparad i Google Ads för daglig import
mellan 11–12 (visad tidszon GMT+02:00 vid installation). Nio fält är mappade.
Google Ads tolkar Conversion_Time med Europe/Stockholm och Transaction ID
mappas till Order_ID för dubblettskydd. Bokade jobb är en sekundär konvertering.

## Installation

1. Importera den förberedda arbetsboken som ett Google-kalkylark. Använd
   svensk lokal och Europe/Stockholm. Lägg Google Ads-export först för Data Manager, med rubriker på rad 1.
2. Behåll kolumner A:Z i mallens ordning. N heter Formulär; X:Z är Besökskanal, Besökskälla och Besökskampanj. H:M är redigerbara arbetsfält.
   Konvertera den importerade tabellen till en native Sheets-tabell med
   statusval: Ny, Kontaktad, Offert skickad, Bokat jobb, Avböjd, Ej relevant.
3. Utöka Förfrågningar till 100001 rader. Byt formlernas sista rad från
   1001 till 100001 i Översikt C7:C13 och F7:F8 och kontrollera beräkningarna.
4. Öppna Tillägg → Apps Script. Kopiera Api.gs, Rows.gs, Outbox.gs, PhoneClicks.gs och Sync.gs
   samt manifestet appsscript.json till det bundna projektet.
5. Lägg in Script Properties GESAB_API_URL = https://ges-ab.se/api/lead-sync
   och GESAB_SYNC_SECRET = samma hemlighet som serverns LEAD_SYNC_SECRET.
   Lägg aldrig hemligheten i en cell eller i källkoden.
6. När servern är publicerad kör ägaren setupGesabSync och godkänner de
   visade behörigheterna. Funktionen skapar en synk var femte minut och en
   redigeringstrigger. Kontrollera att Översikt visar en lyckad synkning.
7. Verifiera tillägg av en rad, oförändrad rad vid återförsök och en
   statusändring tillbaka till databasen med isolerad testdata. Skicka inte
   testdata som riktiga mejl eller annonskonverteringar.

## Drift

Statusändringar sparas först i den dolda fliken _Synk och tas bort därifrån
efter serverns kvittens. Avvisade värden flyttas till den synliga fliken
Synkfel; rätta originalraden och granska felraden. Översikt visar ett fel
så länge Synkfel innehåller rader. Okvitterade händelser behålls för återförsök.

Google kan missa redigeringstriggers vid kvotproblem. Markera då berörda
rader och kör skickaMarkeradeRader. Arbetsboken är inte en obegränsad databas:
Google Sheets har cellgränser och synken stoppar efter 100000 dataposter per arbetsflik.
Arkivera arbetsböcker innan gränsen nås; behåll databasen som centralt register.

Google Ads-importen måste avgränsas till bokade jobb med rätt klick-ID,
samtycke och bokningsdatum. Tomt affärsvärde är okänt, inte noll. Starta med
en separat sekundär konvertering så en förfrågan och samma bokade jobb inte
blir två primära budgivningsmål. Aktivera importen först när fältmappning
och dubblettskydd har verifierats i Google Ads.

## Telefonklick

Migrering `003_phone_clicks.sql` är applicerad i produktion. Lägg till `PhoneClicks.gs` i samma bundna Apps Script-projekt.
Skapa fliken **Telefonklick** med följande kolumner A:Q:
Händelse-ID, Tidpunkt, Sida, Företagets telefonnummer, Händelsetyp, Kampanj,
Annonsgrupp, Annons, GCLID, GBRAID, WBRAID, Annonsmedgivande,
Medgivande tidpunkt, Landningssida, Besökskanal, Besökskälla, Besökskampanj. Kör `setupGesabSync` för att säkerställa
Europe/Stockholm som kalkylarkets tidszon. Tidpunkt är databasens mottagningstid,
inte telefonens klocka. Återförsök behåller originaltid och originaluppgifter.

Klicket sparas först i databasen och hämtas sedan av samma skyddade synk via
`GET /api/lead-sync?kind=phone_clicks`. Kvittens använder `kind: phone_clicks`.
Ett telefonklick visar endast ett försök att öppna telefonfunktionen. Det visar
inte att ett samtal genomfördes och får inte importeras som en primär
samtalskonvertering eller ett bokat jobb. Endast företagets nummer och en tillåten
sidväg sparas; besökarens namn, telefonnummer och IP-adress ingår inte.
Befintlig giltig annonsattribution följer endast med när annonsmedgivande finns.
Webbläsarens sändning är bästa möjliga försök och kan blockeras eller avbrytas.

Tabellernas kolumntyper styr datum-, text- och talformat. Skriptet skriver
bara värden: setNumberFormat får inte anropas på de typade kolumnerna.


## Besökskälla för alla kontakter

Samma klassificering används för förfrågningar och telefonklick. Den skiljer
Google Ads, andra annonser, organisk sökning (SEO), sociala medier, e-post,
andra webbplatser, andra märkta kampanjer och direkt/okänd. UTM-kampanjer
fungerar utan Google-klick-ID. `fbclid` ensamt bevisar inte en betald annons;
märk betalda sociala länkar med exempelvis `utm_source=facebook&utm_medium=paid_social&utm_campaign=badrum`.

Besökskanalen avser ingången till den aktuella laddningen av webbplatsen,
bevarad under intern Next.js-navigering i högst 30 minuter i minnet. Ingen
cookie eller browser storage används för detta. En omladdning/intern
fullsidnavigering kan förlora källan; då visas Direkt/okänd. Ingen historisk
SEO-källa gissas. Äldre poster utan metadata får Ej registrerad.
Endast kanal, begränsad källetikett/domän och kampanjetikett sparas tillsammans
med kontakten. Hänvisarens sökväg, sökord och parametrar sparas inte.

En tidigare samtyckt Google Ads-koppling sparas separat enligt befintliga
90-dagarsregler. Ett senare SEO-besök kan därför ha SEO som besökskanal
samtidigt som Google Ads kan tillskriva sin tidigare annons en konvertering.
Google Ads-exportens villkor och fasta kolumnpositioner är oförändrade.
Källuppgifterna är klientrapporterade statistikuppgifter, inte autentiserade
bevis. Normalisering sker åter på servern före databaslagring.

Källor: https://support.google.com/analytics/answer/15612152 och
https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer
