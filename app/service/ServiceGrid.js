"use client";

import { useState } from "react";
import Link from "next/link";
import { CtaButton } from "../components/CtaButton";
import { ArrowIcon } from "../components/GesabIcons";
import styles from "./service-page.module.css";

export function ServiceGrid({ services }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div
        id="service-overview-grid"
        className={`${styles.serviceGrid} ${isExpanded ? styles.serviceGridExpanded : ""}`}
      >
        {services.map((service) => (
          <Link href={`/service/${service.slug}`} key={service.slug} className={styles.serviceCard}>
            <img src={service.image} alt="" />
            <div className={styles.serviceCardContent}>
              <div className={styles.serviceCardCopy}>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
              </div>
              <span className={styles.readMore}>
                Läs mer <ArrowIcon />
              </span>
            </div>
          </Link>
        ))}
      </div>
      {services.length > 6 && (
        <div className={styles.loadMoreSlot}>
          {!isExpanded ? (
            <CtaButton
              variant="yellow"
              className={styles.loadMore}
              aria-controls="service-overview-grid"
              aria-expanded="false"
              onClick={() => setIsExpanded(true)}
            >
              Visa fler
            </CtaButton>
          ) : null}
        </div>
      )}
    </>
  );
}
