import styles from "./ServiceAreas.module.css";

const areas = ["Hisingen", "Torslanda", "Askim", "Västra Frölunda"];

export function ServiceAreas({ quoteAnchor }) {
  return (
    <details className={styles.areas} data-service-areas>
      <summary className={styles.summary}>
        <h2>Områden vi arbetar i</h2>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </summary>
      <div className={styles.content}>
        <p>Vi arbetar i hela Göteborg, bland annat i följande områden:</p>
        <ul>
          {areas.map((area) => <li key={area}>{area}</li>)}
        </ul>
        <p>
          Bor du i en annan del av Göteborg? Du är också välkommen att höra av dig.
          Berätta var arbetet ska utföras och vad du vill ha hjälp med.
        </p>
        <a href={`#${quoteAnchor}`}>Berätta om ditt projekt <span aria-hidden="true">→</span></a>
      </div>
    </details>
  );
}
