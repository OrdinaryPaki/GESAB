import { ContactBand } from "../components/ContactBand";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { MailIcon, PhoneIcon } from "../components/GesabIcons";
import { FaqSection } from "../components/FaqSection";
import { contactInfo } from "../gesab-data";
import { LocationIcon } from "./contact-icons";
import { ContactForm } from "./ContactForm";
import { ContactMap } from "./ContactMap";
import styles from "./contact-styles.js";
import { createPageMetadata } from "../seo";

const contactFaqItems = [
  {
    question: "Vilka renoveringstjänster erbjuder ni?",
    answer:
      "Vi hjälper till med badrum, tvättstuga, kök, totalentreprenad, rivning och bygg för bostäder i Göteborg. Vi samordnar arbetet från start till klart.",
  },
  {
    question: "Är era hantverkare utbildade och försäkrade?",
    answer:
      "Ja. Vi planerar varje projekt med rätt yrkesroller och arbetar med tydlig ansvarsfördelning, dokumentation och försäkrade arbetssätt.",
  },
  {
    question: "Gör ni hela projektet?",
    answer:
      "Ja. Vi kan samordna arbetet från första genomgång och offert till material, utförande, uppföljning och färdigt resultat.",
  },
  {
    question: "Vad kostar era renoveringstjänster?",
    answer:
      "Priset beror på omfattning, material och vilka yrkesroller som behövs. Efter en genomgång får du en tydlig offert för ditt projekt.",
  },
];

export const metadata = createPageMetadata({
  title: "Kontakta GESAB",
  description:
    "Kontakta Göteborgs Entreprenad Service AB för offert eller rådgivning kring badrumsrenovering, köksrenovering, bygg och entreprenad i Göteborg.",
  path: "/contact",
  image: "/images/home/why-site-measurement.webp",
});

export default function ContactPage() {
  return (
    <div className={styles.page} id="contact-page">
      <Header dark />
      <section className="contact-hero-section">
        <div className="contact-hero-inner">
          <h1>
            Kontakta oss
            <br />
            gärna
          </h1>
          <p>Vi hjälper dig gärna – kontakta oss med frågor eller för offert.</p>
          <ContactForm />
        </div>
      </section>
      <section className="contact-info-section">
        <div className="container">
          <div className="section-title center">
            <h2>Kontaktuppgifter</h2>
            <p>Ring eller mejla om du vill diskutera badrum, kök, bygg eller totalentreprenad.</p>
          </div>
          <div className="contact-card-row">
            <article>
              <span><PhoneIcon /></span>
              <h3>Telefon</h3>
              <p><a href={contactInfo.phonePrimaryHref}>{contactInfo.phonePrimary}</a></p>
              <p><a href={contactInfo.phoneSecondaryHref}>{contactInfo.phoneSecondary}</a></p>
            </article>
            <article>
              <span><MailIcon /></span>
              <h3>E-post</h3>
              <p><a href={contactInfo.emailHref}>{contactInfo.email}</a></p>
              <p>Offert och rådgivning</p>
            </article>
            <article>
              <span><LocationIcon /></span>
              <h3>Adress</h3>
              <p>
                <a href="https://www.google.com/maps/search/?api=1&query=Solstr%C3%A5legatan%206%2C%20418%2043%20G%C3%B6teborg">
                  {contactInfo.addressLine}
                </a>
              </p>
            </article>
          </div>
          <ContactMap />
        </div>
      </section>
      <FaqSection items={contactFaqItems} />
      <ContactBand />
      <Footer />
    </div>
  );
}
