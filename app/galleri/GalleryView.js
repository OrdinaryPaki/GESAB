"use client";

import { useMemo, useState } from "react";
import { bathroomImages } from "../components/bathroom-image-data.js";
import { services } from "../gesab-data";
import styles from "./galleri.module.css";

const allCategories = ["Alla", "Badrum", "Altan", "Kök", "Totalentreprenad", "Bygg"];

const galleryProjects = [
  ...bathroomImages.map((image, index) => ({
    id: `bathroom-${index}`,
    title: image.title,
    alt: image.alt,
    category: "Badrum",
    size: index === 0 ? "large" : "normal",
    image: image.src,
    srcSet: image.srcSet,
    width: image.width,
    height: image.height,
  })),
  {
    id: 2,
    title: "Stilrent platsbyggt kök",
    category: "Kök",
    size: "normal",
    image: services.find((s) => s.slug === "koksrenovering")?.image,
  },
  {
    id: 3,
    title: "Ombyggnad i bostad",
    category: "Bygg",
    size: "tall",
    image: "/images/services/bygg/hero-new-doorway-opening.webp",
  },
  {
    id: 4,
    title: "Totalrenovering villa",
    category: "Totalentreprenad",
    size: "normal",
    image: services.find((s) => s.slug === "totalentreprenad")?.image,
  },
  {
    id: 5,
    title: "Nybyggd altan",
    category: "Altan",
    size: "normal",
    image: services.find((s) => s.slug === "altanbygge")?.image,
  },
  {
    id: 6,
    title: "Rivning inför ombyggnad",
    category: "Bygg",
    size: "large",
    image: services.find((s) => s.slug === "rivningsarbeten")?.image,
  },
  {
    id: 8,
    title: "Köksrenovering i Göteborg",
    category: "Kök",
    size: "normal",
    image: "/images/services/koksrenovering/project-03-mork-ek-villa.webp",
  },
  {
    id: 9,
    title: "Samordnad totalentreprenad",
    category: "Totalentreprenad",
    size: "normal",
    image: "/images/services/totalentreprenad/project-07-old-meets-new.webp",
  },
];

export default function GalleryView() {
  const [activeCategory, setActiveCategory] = useState("Alla");

  const filteredProjects = useMemo(() => {
    return activeCategory === "Alla"
      ? galleryProjects
      : galleryProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <main id="main-content" className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Inspiration för ditt hem</h1>
        <p className={styles.subtitle}>
          Utforska bilder på badrum, kök och bygg. Filtrera på kategori och hitta idéer för färger, material och utformning. Berätta gärna vilka detaljer du gillar när du kontaktar oss om din renovering.
        </p>
      </div>

      <div className={styles.filterContainer}>
        {allCategories.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={activeCategory === category}
            className={`${styles.filterButton} ${activeCategory === category ? styles.active : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.galleryGrid}>
        {filteredProjects.length === 0 ? (
          <p className={styles.emptyState}>Inga projekt i den här kategorin ännu.</p>
        ) : (
          filteredProjects.map((project, index) => (
            <article
              key={project.id}
              className={`${styles.galleryItem} ${styles[project.size] || styles.normal}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {project.image ? (
                <img
                  className={styles.galleryImage}
                  src={project.image}
                  srcSet={project.srcSet}
                  sizes={project.srcSet
                    ? project.size === "large"
                      ? "(max-width: 1024px) 90vw, 850px"
                      : "(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 420px"
                    : undefined}
                  width={project.width}
                  height={project.height}
                  alt={project.alt ?? project.title}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <div className={styles.overlay}>
                <h2 className={styles.itemTitle}>{project.title}</h2>
                <p className={styles.itemCategory}>{project.category}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
