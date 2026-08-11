"use client";

import styles from "./project-grid-asymmetric.module.css";

export function ProjectGridAsymmetric({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className={styles.grid}>
      {projects.map((project, i) => (
        <figure className={`${styles.card} ${styles['card' + (i % 5)]}`} key={project.src}>
          <img alt={project.alt} src={project.src} loading="lazy" />
          <figcaption>{project.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
