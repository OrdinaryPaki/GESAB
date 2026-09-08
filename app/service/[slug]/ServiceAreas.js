import Link from "next/link";
import { localAreas, localServicePath } from "../local-areas";
import styles from "./ServiceAreas.module.css";

export function ServiceAreas({ quoteAnchor, service, currentArea }) {
  return (
    <details className={styles.areas} data-service-areas>
      <summary className={styles.summary}>
        <h2>Här arbetar vi</h2>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </summary>
      <div className={styles.content}>
        <p>
          Vi hjälper privatpersoner i Göteborg med omnejd, bland annat i Borås och
          Kungsbacka. Berätta var du behöver hjälp, så återkommer vi om ditt projekt.
        </p>
        <p>Läs om {service.title.toLocaleLowerCase("sv-SE")} på några av orterna där vi arbetar:</p>
        <ul>
          {localAreas.filter(area => area.slug !== currentArea?.slug).map(area => (
            <li key={area.slug}><Link href={localServicePath(service.slug, area.slug)}>{service.title} i {area.name}</Link></li>
          ))}
        </ul>
        <a href={`#${quoteAnchor}`}>Berätta om ditt projekt <span aria-hidden="true">→</span></a>
      </div>
    </details>
  );
}
