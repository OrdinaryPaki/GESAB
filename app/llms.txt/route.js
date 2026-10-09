import { contactInfo, services } from "../gesab-data";
import { siteConfig } from "../site-config";

export const dynamic = "force-static";

function pageUrl(path) {
  return new URL(path, siteConfig.url).href;
}

function buildLlmsText() {
  const serviceLines = services.map(({ slug, title, body }) => `- [${title}](${pageUrl(`/service/${slug}`)}): ${body}`);

  return [
    `# ${siteConfig.name} (${siteConfig.shortName})`,
    "",
    `> Bygg- och renoveringsföretag i ${siteConfig.areaServed}. Vi samordnar badrum, kök, bygg och totalentreprenad från första genomgång till färdigt resultat.`,
    "",
    `Adress: ${contactInfo.addressLine}`,
    `Telefon: ${contactInfo.phonePrimary}`,
    `E-post: ${contactInfo.email}`,
    "",
    "## Tjänster",
    ...serviceLines,
    "",
    "## Sidor",
    `- [Startsida](${pageUrl("/")}): Översikt över GESAB, tjänster, kundomdömen och vanliga frågor.`,
    `- [Om oss](${pageUrl("/about")}): Hur vi planerar och samordnar renoveringar.`,
    `- [Alla tjänster](${pageUrl("/service")}): Samtliga bygg- och renoveringstjänster.`,
    `- [Galleri](${pageUrl("/galleri")}): Bilder från utförda projekt.`,
    `- [Kontakt](${pageUrl("/contact")}): Kontaktuppgifter och offertförfrågan.`,
    `- [Integritet och cookies](${pageUrl("/cookies")}): Hur vi hanterar personuppgifter och cookies.`,
    "",
  ].join("\n");
}

export function GET() {
  return new Response(buildLlmsText(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
