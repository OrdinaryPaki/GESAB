import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ContactBand } from "../components/ContactBand";
import GalleryView from "./GalleryView";
import styles from "./galleri.module.css";
import { createPageMetadata } from "../seo";

export const metadata = createPageMetadata({
  title: "Galleri",
  description: "Se våra tidigare projekt och inspireras av våra badrumsrenoveringar, köksrenoveringar och andra byggprojekt.",
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
