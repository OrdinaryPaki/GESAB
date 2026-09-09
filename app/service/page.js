import { ContactBand } from "../components/ContactBand";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { services } from "../gesab-data";
import { ServiceGrid } from "./ServiceGrid";
import styles from "./service-page.module.css";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Renovering och bygg i Göteborg – våra tjänster",
  description:
    "Hitta hjälp med badrum, kök, altan, golv och snickeri i Göteborg med omnejd. Se våra nio tjänster, läs vad som kan ingå och be om offert.",
  path: "/service",
  image: "/images/home/service-total-project.webp",
});

const serviceIndexCopy = {
  badrumsrenovering: "Från rivning till färdig yta – med en kontakt genom hela projektet.",
  altanbygge: "Altaner och trädäck byggda för västkusten – från grund till räcke, med fast pris.",
  tvattstugsrenovering: "Praktiskt våtrum med rätt tätskikt, smarta ytor och tydlig tidplan.",
  koksrenovering: "Planering, el, vatten och montage i rätt ordning – med tydlig tidplan.",
  totalentreprenad: "Ett avtal, en kontaktperson. Vi driver hela renoveringen åt dig.",
  rivningsarbeten: "Kontrollerad rivning som lämnar underlaget klart för nästa steg.",
  koksmontering: "Montering av ditt kök – med tydlig omfattning och kontroll av varje detalj.",
  snickeri: "Lister, foder, innerväggar och förvaring anpassade efter ditt hem.",
  golvlaggning: "Nytt golv med genomgång av underlag, material och avslut – med tydlig offert.",
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
              <h1>Bygg och renovering</h1>
              <p>Behöver du hjälp med ett rum, ett snickerijobb eller en större renovering? Här hittar du våra tjänster i Göteborg med omnejd. Välj tjänst för att läsa om omfattning, förberedelser och offert.</p>
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
