import { createPageMetadata } from "../seo";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { contactInfo, siteConfig } from "../site-config";
import { CookieSettingsButton } from "./CookieSettingsButton";
import styles from "./cookies.module.css";

export const metadata = createPageMetadata({
  title: "Integritet och cookies",
  description: "Läs om GESAB:s annonsmätning och ändra dina cookieinställningar.",
  path: "/cookies",
  image: "/images/gesab/hero-servicebil.webp",
});

export default function CookiesPage() {
  return (
    <>
      <Header dark />
      <main className={styles.page}>
        <span className={styles.eyebrow}>GESAB · DINA VAL</span>
        <h1>Integritet och cookies</h1>
        <p className={styles.intro}>Här kan du läsa om vår annonsmätning och välja hur cookies får användas i din webbläsare.</p>
        <section className={styles.choiceCard} aria-labelledby="cookie-choice-heading">
          <h2 id="cookie-choice-heading">Dina cookieinställningar</h2>
          <p>Du kan när som helst slå på eller av annonsmätning med Google Ads. Öppna inställningarna, ändra reglaget och spara ditt val.</p>
          <CookieSettingsButton />
          <p className={styles.note}>Om du stänger av aktiv mätning laddas sidan om. Hemsidan fungerar även utan annonsmätning.</p>
        </section>
        <section>
          <h2>Vad använder vi cookies till?</h2>
          <p>Med ditt godkännande använder vi Google Ads för att mäta vilka annonser som leder till besök och skickade förfrågningar. Då används annonscookies och uppgifter om besöket och händelsen delas med Google. Vi aktiverar inte personanpassade annonser.</p>
          <p>Google-taggen laddas först efter ett godkännande. Du kan läsa mer om behandlingen hos <a href="https://business.safety.google/privacy/" target="_blank" rel="noopener noreferrer">Google</a>.</p>
          <p>Om du godkänner annonsmätning sparar vi också annonsens klick-ID och kampanjuppgifter i webbläsaren i högst 90 dagar. Skickar du en förfrågan följer dessa uppgifter med den, så att vi kan koppla förfrågan till annonsen. När du stänger av annonsmätning rensas dessa lokalt sparade uppgifter.</p>
          <p>Om förfrågan blir ett bokat jobb kan vi även återrapportera annonsens klick-ID, ett slumpmässigt ärende-ID, bokningsdatum och affärsvärde till Google Ads. Det görs bara för förfrågningar med registrerat annonssamtycke. Namn, e-postadress, telefonnummer och meddelanden ingår inte i denna export.</p>
        </section>
        <section>
          <h2>När du kontaktar oss</h2>
          <p>För att begränsa automatiska massinskick använder servern IP-adressen och formulärets e-postadress för att skapa envägskodade kontrollvärden med en hemlig servernyckel. Kontrollvärden och tillfälliga räknare används bara för missbruksskydd och rensas löpande efter att de löpt ut, normalt inom två dygn vid fortsatt trafik. Råa IP-adresser läggs inte till i kundlistan eller telefonklickslistan.</p>
          <p>Med förfrågningar och telefonklick sparar vi också tillgänglig besökskälla, till exempel sökmotor, sociala medier eller kampanj. Vi använder kampanjmärkning och den hänvisande webbplatsens domän, inte dess fullständiga adress eller sökord. Besökskällan hålls tillfälligt i sidans minne i högst 30 minuter utan cookies eller lokal lagring. Om källan saknas eller försvinner vid omladdning anges direkt/okänd.</p>
          <p>Vi använder de uppgifter du lämnar i formuläret för att besvara din förfrågan och följa upp ditt ärende. Förfrågningar sparas i vår databas hos Neon och hanteras med hjälp av e-post och Google-kalkylark. Innehållet i ditt meddelande skickas inte till Google Ads.</p>
          <p>När du klickar på ett telefonnummer sparar vi tidpunkten, sidan och vilket av våra nummer du klickade på i databasen och kalkylarket. Det visar ett telefonklick, inte att ett samtal genomfördes. Vi sparar inte ditt telefonnummer eller din IP-adress i denna lista. Annonsuppgifter följer med endast om du har godkänt annonsmätning.</p>
        </section>
        <section>
          <h2>Besöksstatistik och prestanda</h2>
          <p>Vi använder Vercel Web Analytics och Speed Insights för att förstå hur hemsidan används och hur snabbt den fungerar. Vi mäter sidvisningar, påbörjade och skickade formulär samt klick på telefon- och e-postlänkar. Formulärens innehåll, som namn, e-postadress och meddelande, skickas inte till denna statistik.</p>
          <p>Läs mer om <a href="https://vercel.com/docs/analytics/privacy-policy">Vercels besöksstatistik</a> och <a href="https://vercel.com/docs/speed-insights/privacy-policy">prestandamätning</a>.</p>
        </section>
        <section>
          <h2>Så kommer vi ihåg ditt val</h2>
          <p>Vi sparar ditt cookieval i webbläsarens lokala lagring i 180 dagar. Därför behöver du inte välja igen vid varje besök. Ett sparat nej aktiverar ingen Google-tagg.</p>
          <p>Om du byter webbläsare eller rensar webbplatsens sparade data får du göra ett nytt val.</p>
        </section>
        <section>
          <h2>Frågor om integritet</h2>
          <p>Har du frågor om hur {siteConfig.name} hanterar uppgifter om dig? Kontakta oss på <a href={contactInfo.emailHref}>{contactInfo.email}</a>.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
