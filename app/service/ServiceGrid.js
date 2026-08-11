import Link from "next/link";
import styles from "./service-page.module.css";

export function ServiceGrid({ services }) {
  return (
    <div className={styles.serviceGrid}>
      {services.map((service) => (
        <Link href={`/service/${service.slug}`} key={service.slug} className={styles.serviceCard}>
          <img src={service.image} alt="" className={styles.serviceCardImage} />
          <div className={styles.serviceCardOverlay} />
          <div className={styles.serviceCardContent}>
            <h3>{service.title}</h3>
            <div className={styles.serviceCardHidden}>
              <p>{service.body}</p>
              <span className={styles.serviceCardButton}>Läs mer</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
