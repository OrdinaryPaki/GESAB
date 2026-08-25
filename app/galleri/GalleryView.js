"use client";

import { useMemo, useState } from "react";
import { services } from "../gesab-data";
import styles from "./galleri.module.css";

const allCategories = ["Alla", "Badrum", "Altan", "Tvättstuga", "Kök", "Totalentreprenad", "Bygg"];

const mockProjects = [
  {
    id: 1,
    title: "Modern badrumsrenovering",
    category: "Badrum",
    size: "large",
    image: services.find((s) => s.slug === "badrumsrenovering")?.image,
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
    image: services.find((s) => s.slug === "bygg")?.image,
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
    title: "Klassiskt badrum",
    category: "Badrum",
    size: "tall",
    image: "/images/services/badrumsrenovering/project-01-white-classic.webp",
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
      ? mockProjects
      : mockProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Vårt Galleri</h1>
        <p className={styles.subtitle}>
          Här har vi samlat ett urval av våra tidigare projekt. Filtrera på kategori för att hitta inspiration för ditt kommande projekt.
        </p>
      </div>

      <div className={styles.filterContainer}>
        {allCategories.map((category) => (
          <button
            key={category}
            type="button"
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
