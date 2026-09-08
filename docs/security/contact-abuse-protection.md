# Skydd för formulär och telefonklick

Kontrollerat 2026-09-08: `vercel firewall overview` visar aktiva System
Mitigations, ingen projektkonfigurerad Firewall och inga systembypasser.
Inga betalda Vercel-regler eller nya tjänster aktiverades.

Båda publika POST-rutterna anropar samma servermodul före kundlagring och
mejlutskick. Neon-funktionen `gesab_admit_contact` reserverar alla relevanta
budgetar atomiskt. Ett kort advisory-lås per kontakttyp gör besluten gemensamma
för alla Vercel-instanser. Låset hålls aldrig under mejlutskick eller Sheets-synk.

| Skydd | Förfrågningar | Telefonklick |
| --- | --- | --- |
| Nya ID:n per nätadress/nät | 5/15 minuter, 20/dygn | 20/10 minuter, 100/dygn |
| Nya ID:n per mottagare | 3/timme, 5/dygn | Ej tillämpligt |
| Gemensamt tak | 50/10 minuter, 200/dygn | 1 000/10 minuter, 10 000/dygn |
| Försök inklusive återförsök per nät | 40/15 minuter | 60/10 minuter |
| Gemensamt försökstak | 10 000/dygn | 100 000/dygn |

Perioderna är fasta UTC-fönster. Gränserna finns endast i
`app/lib/abuse/policy.mjs` och kan anpassas till verklig trafik utan att byta
arkitektur. De är skyddstak för den här verksamheten, inte systemets kapacitet.
Delade nät kan dela avsändargräns. Vid kraftig legitim trafik kan gränserna
behöva höjas. Globalt tak kan också tillfälligt neka riktiga kunder under angrepp;
formuläret visar då ett begripligt fel och telefonkontakt finns kvar.

Ett matchande UUID får samma reservation inom UTC-dygnet, så ett återförsök
efter leveransfel fungerar utan en ny reservation. På nästa UTC-dygn måste
budgeten reserveras igen. Ändrad kunddata under samma UUID avvisas.
Resends befintliga idempotens och databasens `email_sent_at` förhindrar dubbla
utskick. UUID normaliseras till gemener innan leverans. Reservation sker i en
separat kort transaktion före kundposten: ett avbrott däremellan kan reservera
kapacitet utan kundpost, men samma ID kan återuppta arbetet. När kundposten är
sparad ligger den kvar vid e-postfel, som tidigare.

Bara Vercels överskrivna `x-vercel-forwarded-for` används i produktion. IPv6
räknas per /64, IPv4-mappad IPv6 normaliseras till IPv4. Saknad/ogiltig adress
får en gemensam begränsad unknown-grupp, aldrig fri passage. Utanför Vercel
används en gemensam local-grupp; annan produktion än Vercel kräver en uttrycklig
betrodd proxy-adapter innan drift. Försök aldrig välja en godtycklig
forwarded-header för att kringgå detta.

IP och mottagare HMAC-kodas med en separat domänprefix under den befintliga
serverhemligheten LEAD_SYNC_SECRET. De råa adresserna finns inte i dessa
räknare. Nyckelrotation återställer avsändar-/mottagargrupper, men inte globala
tak. Gmail/googlemail plus- och punktalias delar mottagarbudget enligt Googles
publicerade regler; andra adresser normaliseras bara med trim/gemener.
Den riktiga mottagaradressen ändras aldrig av budgetnormaliseringen.
Andra leverantörers alias kan inte generellt identifieras; avsändar- och
globala tak gäller även då.

Räknare löper ut senast ett dygn efter sitt fönster och reservationer efter två
dygn. Indexerad, begränsad städning sker vid nästa anrop (100 gamla rader per
tabell/anrop); ingen obunden tabellskanning. Publik DB-roll får inga privilegier.
Databas- eller konfigurationsfel ger 503 utan kundskrivning eller mejl.
Överskridna budgetar ger 429 och Retry-After. Telefonmätning är fortsatt
bästa möjliga försök och påverkar inte själva telefonlänken.

Detta begränsar massinskick och leveransresurser; det bevisar inte att varje
kontakt är mänsklig. Vercels plattformsskydd hanterar trafik innan funktionen.
Botutmaning kan införas senare om faktisk missbrukstrafik motiverar det.

Verifiering: PGlite-tester genom riktiga handlers/store visar att spärrade
förfrågningar inte skapar kundposter eller leveranser, och normala återförsök
fungerar. Separata samtidiga anrop mot produktions-Postgres verifierar att
20 nya ID:n med testtak 5 ger exakt 5 reservationer, medan 10 parallella
återförsök med samma ID ger en reservation. Inga testmejl skickas.

Källor:
- https://vercel.com/docs/headers/request-headers
- https://support.google.com/mail/answer/7436150
- https://support.google.com/mail/answer/22370
- https://support.google.com/mail/answer/10313
