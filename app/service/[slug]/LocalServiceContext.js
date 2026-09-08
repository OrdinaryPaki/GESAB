import Link from "next/link";
import { getLocalGuidance } from "../local-guidance";
import styles from "./service-detail-styles.js";

export function LocalServiceContext({ service, detail, area }) {
  const guidance = getLocalGuidance(service.slug, area.slug);
  return (
    <>
      <section className={styles.articleSection} data-local-service-context>
        <h2>Ditt projekt i {area.name}</h2>
        <p>{area.planning}</p>
        <p><Link href={`/service/${service.slug}`}>Läs mer om {service.title.toLocaleLowerCase("sv-SE")} hos GESAB</Link></p>
      </section>
      <section className={styles.articleSection} data-local-service-decisions>
        <h2>Välj rätt omfattning för ditt projekt</h2>
        <div className={styles.textBlocks}>
          {detail.localDecisions.map(([title, body]) => (
            <div className={styles.textBlock} key={title}><h3>{title}</h3><p>{body}</p></div>
          ))}
        </div>
      </section>
      {guidance ? (
        <section className={styles.articleSection} data-local-guidance>
          <h2>Inför arbetet: vägledning i {area.name}</h2>
          <p>{guidance.body}</p>
          <p><a href={guidance.href}>{guidance.label}</a></p>
        </section>
      ) : null}
    </>
  );
}
