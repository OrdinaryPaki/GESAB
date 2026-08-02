import { ContactBand, Footer, Header } from "../components/GesabShell";
import styles from "./blog.module.css";

export default function BlogLayout({ children }) {
  return (
    <div className={styles.blogRoot}>
      <Header dark />
      {children}
      <ContactBand />
      <Footer />
    </div>
  );
}
