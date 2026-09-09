import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ContactBand } from "../components/ContactBand";
import GalleryView from "./GalleryView";
import styles from "./galleri.module.css";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Badrum och kök – bilder och renoveringsinspiration",
  description: "Utforska bilder på badrum, kök och renovering hos GESAB. Hitta idéer för material, färger och planlösning inför ditt eget projekt.",
  path: "/galleri",
  image: "/images/home/gallery-bathroom-result.webp",
});

export default function GalleriPage() {
  return (
    <div className={styles.page}>
      <Header dark />
      <GalleryView />
      <ContactBand />
      <Footer />
    </div>
  );
}
