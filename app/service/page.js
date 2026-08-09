import { CtaLink } from "../components/CtaButton";
import { ContactBand, Footer, Header } from "../components/GesabShell";
import { StarIcon } from "../components/GesabIcons";
import { image, services, team } from "../gesab-data";
import { ServiceGrid } from "./ServiceGrid";
import styles from "./service-page.module.css";

export const metadata = {
  title: "Tjänster för badrum, bygg och renovering i Göteborg",
  description:
    "Se GESABs tjänster inom badrumsrenovering, köksrenovering, totalentreprenad, rivning, bygg, fasadrenovering, snickeri, målning och montage.",
};

const serviceIndexCopy = {
  badrumsrenovering: "Badrumsrenovering med planering, samordning och trygg arbetsgång från start till klart.",
  koksrenovering: "Köksrenovering med planering för ytskikt, el, vatten, snickeri och montage.",
  totalentreprenad: "En samlad kontakt för projekt där flera delar behöver planeras, utföras och följas upp.",
  rivningsarbeten: "Kontrollerad rivning inför renovering, med fokus på säkerhet, underlag och nästa steg.",
  bygg: "Byggarbeten för renovering, ombyggnad och anpassning av bostäder och lokaler.",
  fasadrenovering: "Fasadrenovering med rätt metod, säkert utförande och långsiktigt skydd.",
};

const featuredServices = services.slice(0, 6).map((service) => ({
  ...service,
  body: serviceIndexCopy[service.slug] ?? service.body,
}));

const trustPoints = [
  {
    label: "Kostnadsfri genomgång",
    icon: "https://framerusercontent.com/images/2GUlNnU3kug1y5fbSY3gbLjww8s.svg?width=22&height=22",
    iconSize: 22,
  },
  {
    label: "Samordnade hantverkare",
    icon: "https://framerusercontent.com/images/vBdOazWIJGVMpXx9Zxdfuedktlc.svg?width=24&height=24",
    iconSize: 24,
  },
  {
    label: "Dokumentation och ROT",
    icon: "https://framerusercontent.com/images/vFoBxfn1HM0xcgHElFf7EQ4WUM.svg?width=22&height=22",
    iconSize: 22,
  },
];

export default function ServicePage() {
  return (
    <div className={styles.servicePage}>
      <Header dark />
      <main>
        <section className={styles.indexSection}>
          <div className={`container ${styles.indexContainer}`}>
            <header className={styles.indexTitle}>
            <h1>Tjänster</h1>
              <p>Trygga tjänster för badrum, kök och renovering – anpassade efter ditt hem och dina behov.</p>
            </header>
            <ServiceGrid services={featuredServices} />
          </div>
        </section>
        <section className={styles.trustSection}>
          <div className={`container ${styles.trustGrid}`}>
            <div className={styles.trustCopy}>
              <h2>Samordnade tjänster du kan lita på</h2>
              <div className={styles.trustCopyBottom}>
                <p>Vi samordnar rådgivning, offert, arbetsordning och utförande så att projektet blir tydligt från start till överlämning.</p>
                <CtaLink href="/about" variant="yellow" className={styles.trustCta}>Läs mer</CtaLink>
              </div>
            </div>
            <div className={styles.trustMedia}>
              <img src="https://framerusercontent.com/images/9R9tsiBykeVoZizc3GBOcvQMKs.jpg?scale-down-to=1024&width=2160&height=2196" alt="" />
              <div className={styles.trustList}>
                {trustPoints.map((item) => (
                  <p key={item.label}>
                    <span className={styles.trustIcon} aria-hidden="true">
                      <img src={item.icon} width={item.iconSize} height={item.iconSize} alt="" />
                    </span>
                    <span>{item.label}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className={styles.reviewSection}>
          <div className={`container ${styles.reviewContainer}`}>
            <header className={styles.reviewHeader}>
              <p className={styles.reviewEyebrow}>INFÖR OFFERT</p>
              <h2>Frågor som avgör ett bra resultat</h2>
              <div className={styles.reviewSummary} aria-label="Sex utvalda tjänsteområden">
                <strong>6</strong>
                <span className={styles.reviewSummaryIcons} aria-hidden="true">
                  {Array.from({ length: 5 }, (_, index) => <StarIcon key={index} />)}
                </span>
                <span>(urval)</span>
              </div>
            </header>
            <div className={styles.reviewGrid}>
              {featuredServices.map((service, index) => (
                <article className={styles.reviewCard} key={service.slug}>
                  <div className={styles.reviewCardStars} aria-hidden="true">
                    {Array.from({ length: 5 }, (_, starIndex) => <StarIcon key={starIndex} />)}
                  </div>
                  <div className={styles.reviewCardContent}>
                    <p className={styles.reviewCardQuote}>{service.body}</p>
                    <div className={styles.reviewCardFooter}>
                      <div className={styles.reviewAuthor}>
                        <img src={team[index % team.length].image} alt="" />
                        <div className={styles.reviewAuthorName}>
                          <strong>{service.title}</strong>
                          <small>GESAB rådgivning</small>
                        </div>
                      </div>
                      <img className={styles.reviewBadge} src={image.badges[0]} alt="" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <ContactBand />
      <Footer />
    </div>
  );
}
