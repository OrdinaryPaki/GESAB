import Link from "next/link";
import { Header } from "./components/Header";
import { CtaLink } from "./components/CtaButton";
import { ArrowIcon } from "./components/GesabIcons";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <Header dark />
      <main className={styles.main}>
        <div className={styles.content}>
          <p className={styles.code} aria-label="Fel 404">404<span aria-hidden="true">.</span></p>
          <h1>Här finns inget att<br className={styles.desktopBreak} /> bygga vidare på.</h1>
          <p className={styles.description}>
            Sidan du letar efter kan ha flyttats eller så har länken blivit fel.
            Vi hjälper dig gärna att hitta hem igen.
          </p>
          <div className={styles.actions}>
            <CtaLink href="/">Till startsidan <ArrowIcon /></CtaLink>
            <CtaLink href="/service" variant="yellow">Se våra tjänster</CtaLink>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>Rätt hantverk. Rätt väg hem.</p>
          <div className={styles.links}>
            <Link href="/galleri">Se våra projekt <ArrowIcon /></Link>
            <Link href="/contact">Kontakta oss <ArrowIcon /></Link>
          </div>
        </div>
      </main>
    </div>
  );
}
