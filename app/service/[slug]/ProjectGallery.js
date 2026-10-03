"use client";

import { useState } from "react";
import styles from "./project-gallery.module.css";

export function ProjectGallery({ projects }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!projects || projects.length === 0) return null;

  const activeProject = projects[activeIndex];

  return (
    <div className={styles.container}>
      <figure className={styles.hero}>
        <img
          alt={activeProject.alt}
          src={activeProject.src}
          srcSet={activeProject.srcSet}
          sizes={activeProject.srcSet ? "(max-width: 900px) 100vw, 827px" : undefined}
          width={activeProject.width}
          height={activeProject.height}
          decoding="async"
          loading="lazy"
          data-service-supporting-image
        />
        <figcaption>{activeProject.caption}</figcaption>
      </figure>

      <div className={styles.thumbnails}>
        {projects.map((project, index) => (
          <button
            key={project.src}
            className={`${styles.thumb} ${index === activeIndex ? styles.thumbActive : ""}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Visa projektbild ${index + 1}`}
          >
            <img alt={project.alt} src={project.thumbnailSrc ?? project.src} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
    </div>
  );
}
