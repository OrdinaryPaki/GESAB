import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { contactInfo, siteConfig } from "../site-config";
import { CookieSettingsButton } from "./CookieSettingsButton";
import styles from "./cookies.module.css";

export const metadata = {
  title: "Integritet och cookies",
  description: "Läs om GESAB:s annonsmätning och ändra dina cookieinställningar.",
  alternates: { canonical: "/cookies" },
};

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
          <p>Med ditt godkännande använder vi Google Ads för att mäta vilka annonser som leder till besök på hemsidan. Då används annonscookies och besöksuppgifter delas med Google. Vi aktiverar inte personanpassade annonser.</p>
          <p>Google-taggen laddas först efter ett godkännande. Du kan läsa mer om behandlingen hos <a href="https://business.safety.google/privacy/" target="_blank" rel="noopener noreferrer">Google</a>.</p>
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
