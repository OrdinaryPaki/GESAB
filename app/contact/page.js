import { ContactBand, Footer, Header } from "../components/GesabShell";
import { CtaButton } from "../components/CtaButton";
import { MailIcon, PhoneIcon } from "../components/GesabIcons";
import { FaqSection } from "../components/HomeSections";
import { ServiceSelect } from "../components/ServiceSelect";
import { contactInfo, serviceSelectOptions } from "../gesab-data";
import { LocationIcon } from "./contact-icons";
import styles from "./contact-page.module.css";

const contactFaqItems = [
  {
    question: "Vilka renoveringstjänster erbjuder ni?",
    answer:
      "Vi hjälper till med badrum, kök, totalentreprenad, rivning, bygg, fasad, snickeri, målning och montage för både bostäder och lokaler i Göteborg. Vi samordnar arbetet från start till klart.",
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

export const metadata = {
  title: "Kontakta GESAB",
  description:
    "Kontakta Göteborgs Entreprenad Service AB för offert eller rådgivning kring badrumsrenovering, köksrenovering, bygg och entreprenad i Göteborg.",
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <Header dark />
      <section className="contact-hero-section">
        <div className="contact-hero-inner">
          <h1>
            Kontakta oss
            <br />
            gärna
          </h1>
          <p>Vi hjälper dig gärna – kontakta oss med frågor eller för offert.</p>
          <form className="contact-main-form">
            <div className={styles.contactFormFields}>
              <label>
                Förnamn*
                <input placeholder="Förnamn" />
              </label>
              <label>
                Efternamn*
                <input placeholder="Efternamn" />
              </label>
              <label className="wide">
                E-post*
                <input placeholder={contactInfo.email} type="email" />
              </label>
              <ServiceSelect className="wide" label="Tjänst*" options={serviceSelectOptions} />
              <label className="wide">
                Meddelande*
                <textarea placeholder="Beskriv kort vad du vill ha hjälp med." />
              </label>
            </div>
            <CtaButton>Skicka förfrågan</CtaButton>
          </form>
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
          <div className={styles.map}>
            <iframe
              allowFullScreen
              className={styles.mapFrame}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Solstr%C3%A5legatan%206%2C%20418%2043%20G%C3%B6teborg&output=embed"
              title="Karta till GESAB på Solstrålegatan 6"
            />
          </div>
        </div>
      </section>
      <FaqSection items={contactFaqItems} />
      <ContactBand />
      <Footer />
    </div>
  );
}
