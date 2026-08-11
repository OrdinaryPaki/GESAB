import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ContactBand } from "../components/ContactBand";
import GalleryView from "./GalleryView";
import styles from "./galleri.module.css";

export const metadata = {
  title: "Galleri | GESAB",
  description: "Se våra tidigare projekt och inspireras av våra badrumsrenoveringar, köksrenoveringar och andra byggprojekt.",
};

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
