import Link from "next/link";
import styles from "./service-page.module.css";

export function ServiceGrid({ services }) {
  return (
    <div className={styles.serviceGrid}>
      {services.map((service, index) => (
        <Link href={`/service/${service.slug}`} key={service.slug} className={styles.serviceCard}>
          <img src={service.image} alt="" loading={index < 2 ? "eager" : "lazy"} decoding="async" className={styles.serviceCardImage} />
          <div className={styles.serviceCardOverlay} />
          <div className={styles.serviceCardContent}>
            <h2>{service.title}</h2>
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
