# SEO-förbättringar – godkänd design

## Mål

Göra den lokala e-postförhandsvisningen otillgänglig i produktion och genomföra de fem förbättringspunkterna från SEO-granskningen, utan att ändra sitemap, robots.txt, canonical-adresser, platshållarbilder eller galleriets mockprojekt.

## Lösning

- `/epost` behålls i utvecklingsläge men svarar med 404 i produktionsläge och har `noindex` som extra skydd.
- En gemensam webbplatskonfiguration blir enda källa för domän och företagsuppgifter.
- Publika sidor får sidunik Open Graph- och Twitter-metadata. Tjänstesidor använder respektive tjänsts befintliga bild.
- En komplett `HomeAndConstructionBusiness`-profil bäddas in som JSON-LD på hela webbplatsen och tjänsternas schema hänvisar till samma företags-ID.
- Google Fonts-anrop tas bort och de redan befintliga lokala fontfilerna används.
- Befintliga externa bilder och deras URL:er lämnas oförändrade. Hero-bilder får explicita mått och laddningsprioritet.
- Namngivna kundomdömen, exakta projektantal, fasta ROT-procenttal och certifierings-/garantipåståenden utan lokalt verifieringsunderlag tas bort eller skrivs om neutralt.

## Riskkontroll

Publika URL:er och formulär ska vara oförändrade. Produktionsbygge, integrationstester och separata kontroller i utvecklings- respektive produktionsläge verifierar resultatet.
