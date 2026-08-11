import { FaqSection } from "../components/FaqSection";
import { TrustNotes } from "../components/HomeSections";
import { ContactBand, Footer, Header } from "../components/GesabShell";
import { AboutMissionSection, AboutStorySection } from "./about-sections";
import { ProcessConcepts } from "./process-concepts";
import styles from "./about.module.css";
import { AboutRevealController } from "./reveal-controller";

export const metadata = {
  title: "Om Göteborgs Entreprenad Service AB",
  description:
    "Läs om GESAB, ett hantverksföretag i Göteborg med fokus på badrumsrenovering, bygg, säker arbetsmiljö, dokumentation och miljöansvar.",
};

export default function AboutPage() {
  return (
    <div className={styles.page} id="about-page">
      <AboutRevealController />
      <Header dark />
      <AboutStorySection />
      <AboutMissionSection />
      <ProcessConcepts />
      <TrustNotes />
      <FaqSection />
      <ContactBand />
      <Footer />
    </div>
  );
}
