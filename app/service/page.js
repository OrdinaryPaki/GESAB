import { ContactBand, Footer, Header } from "../components/GesabShell";
import { services } from "../gesab-data";
import { ServiceConcepts } from "./ServiceConcepts";
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

const allServicesWithCopy = services.map((service) => ({
  ...service,
  body: serviceIndexCopy[service.slug] ?? service.body,
}));

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
            <ServiceConcepts services={allServicesWithCopy} />
          </div>
        </section>
      </main>
      <ContactBand />
      <Footer />
    </div>
  );
}
