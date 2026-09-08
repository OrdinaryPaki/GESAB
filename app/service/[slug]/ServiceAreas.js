import styles from "./ServiceAreas.module.css";

export function ServiceAreas({ quoteAnchor }) {
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
          Vi utgår från Göteborg och tar uppdrag runt om i regionen. Berätta var
          du behöver hjälp, så återkommer vi om ditt projekt.
        </p>
        <a href={`#${quoteAnchor}`}>Berätta om ditt projekt <span aria-hidden="true">→</span></a>
      </div>
    </details>
  );
}
