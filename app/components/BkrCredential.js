import styles from "./BkrCredential.module.css";

// Official BKR register entry, verified 2026-09-07. Logo from bkr.se.
const BKR_PROFILE =
  "https://www.bkr.se/hitta-foretag/vastra-gotaland/goteborgs-kommun/goteborgs-entreprenad-service-ab/685601";

export function BkrCredential() {
  return (
    <a className={styles.credential} href={BKR_PROFILE}>
      <img src="/images/certifications/bkr.svg" alt="Byggkeramikrådet" width="72" height="72" loading="lazy" />
      <span className={styles.copy}>
        <strong>Behörigt våtrumsföretag</strong>
        <span>Göteborgs Entreprenad Service AB</span>
        <span className={styles.link}>Se vår behörighet hos BKR ↗</span>
      </span>
    </a>
  );
}
