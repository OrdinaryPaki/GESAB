import { FaqSection } from "../components/FaqSection";
import { ProcessSection, TrustNotes } from "../components/HomeSections";
import { ContactBand } from "../components/ContactBand";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { AboutMissionSection, AboutStorySection } from "./about-sections";
import styles from "./about-page.module.css";
import { AboutRevealController } from "./reveal-controller";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Om Göteborgs Entreprenad Service AB",
  description:
    "Läs om GESAB, ett hantverksföretag i Göteborg med fokus på badrumsrenovering, bygg, säker arbetsmiljö, dokumentation och miljöansvar.",
  path: "/about",
  image: "/images/home/about-plumbing-detail.webp",
});

export default function AboutPage() {
  return (
    <div className={styles.page} id="about-page">
      <AboutRevealController />
      <Header dark />
      <AboutStorySection />
      <AboutMissionSection />
      <ProcessSection />
      <TrustNotes />
      <FaqSection />
      <ContactBand />
      <Footer />
    </div>
  );
}
