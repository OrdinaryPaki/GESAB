import { ContactBand } from "../components/ContactBand";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { services } from "../gesab-data";
import { ServiceGrid } from "./ServiceGrid";
import styles from "./service-page.module.css";

export const metadata = {
  title: "Tjänster för badrum, bygg och renovering i Göteborg",
  description:
    "Se GESABs tjänster inom badrumsrenovering, tvättstugsrenovering, köksrenovering, totalentreprenad, rivning och bygg i Göteborg.",
};

const serviceIndexCopy = {
  badrumsrenovering: "Från rivning till färdig yta – med en kontakt genom hela projektet.",
  tvattstugsrenovering: "Praktiskt våtrum med rätt tätskikt, smarta ytor och tydlig tidplan.",
  koksrenovering: "Planering, el, vatten och montage i rätt ordning – med tydlig tidplan.",
  totalentreprenad: "Ett avtal, en kontaktperson. Vi driver hela renoveringen åt dig.",
  rivningsarbeten: "Kontrollerad rivning som lämnar underlaget klart för nästa steg.",
  bygg: "Renovering och ombyggnad, samordnat med el, VVS och ytskikt.",
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
              <p>Badrum, kök, bygg och renovering i Göteborg – med tydlig plan och en kontaktperson.</p>
            </header>
            <ServiceGrid services={allServicesWithCopy} />
          </div>
        </section>
      </main>
      <ContactBand />
      <Footer />
    </div>
  );
}
