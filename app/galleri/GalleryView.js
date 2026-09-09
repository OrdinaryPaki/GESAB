"use client";

import { useMemo, useState } from "react";
import { gesabImages } from "../components/gesab-image-data";
import { services } from "../gesab-data";
import styles from "./galleri.module.css";

const allCategories = ["Alla", "Badrum", "Altan", "Tvättstuga", "Kök", "Totalentreprenad", "Bygg"];

const galleryProjects = [
  {
    id: 1,
    title: "Modern badrumsrenovering",
    category: "Badrum",
    size: "large",
    image: gesabImages.bathtub.src,
  },
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
    id: 15,
    title: "Renoverad tvättstuga",
    category: "Tvättstuga",
    size: "normal",
    image: services.find((s) => s.slug === "tvattstugsrenovering")?.image,
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
    id: 7,
    title: "Badrum med belyst spegel",
    category: "Badrum",
    size: "tall",
    image: gesabImages.vanity.src,
  },
  {
    id: 8,
    title: "Köksrenovering i Göteborg",
    category: "Kök",
    size: "normal",
    image: "/images/services/koksrenovering/project-06-dark-green-townhouse.webp",
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
    <main className={styles.main}>
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
                <img className={styles.galleryImage} src={project.image} alt={project.title} loading="lazy" />
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
