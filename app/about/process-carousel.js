"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./about.module.css";
import { ArrowIcon } from "../components/GesabIcons";

const processSteps = [
  {
    number: "01",
    title: "Första kontakt",
    body: "Vi lyssnar in dina idéer, behov och förutsättningar. Tillsammans går vi igenom vad som behöver göras och vilka yrkesroller som kommer att krävas för projektet.",
  },
  {
    number: "02",
    title: "Behovsanalys",
    body: "Vi kartlägger projektets omfattning, budgetramar och tekniska krav för att säkerställa att vi har rätt utgångspunkt från början.",
  },
  {
    number: "03",
    title: "Platsbesök",
    body: "Vi besöker platsen för att bedöma befintligt skick, mäta och identifiera eventuella tekniska utmaningar innan vi går vidare.",
  },
  {
    number: "04",
    title: "Kalkyl & Offert",
    body: "Du får en detaljerad offert där arbetsmoment, material, tidplan och eventuellt ROT-avdrag framgår tydligt. Inga dolda avgifter.",
  },
  {
    number: "05",
    title: "Avtal & Tidsplan",
    body: "När offerten är godkänd skriver vi ett tydligt avtal och spikar en detaljerad tidsplan för hela projektet.",
  },
  {
    number: "06",
    title: "Materialval",
    body: "Vi hjälper dig att välja rätt material, inredning och ytskikt som passar både din vision och gällande branschregler.",
  },
  {
    number: "07",
    title: "Rivning & Grundarbete",
    body: "Arbetet inleds med kontrollerad rivning och noggrant grundarbete för att säkerställa en stabil bas för nästa steg.",
  },
  {
    number: "08",
    title: "Installation & Bygg",
    body: "Våra certifierade hantverkare utför VVS, el, plattsättning och snickeri i rätt ordning och med högsta precision.",
  },
  {
    number: "09",
    title: "Kvalitetskontroll",
    body: "Löpande besiktning och egenkontroller utförs under hela byggprocessen för att garantera ett fackmässigt resultat.",
  },
  {
    number: "10",
    title: "Överlämning & Garanti",
    body: "Gemensam slutbesiktning. Du får nycklar, skötselråd, garantibevis och kvalitetsdokument för våtrum.",
  },
];

export function ProcessCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  const updateItemsPerView = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    }
  }, []);

  useEffect(() => {
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, [updateItemsPerView]);

  const totalSlides = Math.max(1, processSteps.length - itemsPerView + 1);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? totalSlides - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselViewport}>
        <div
          className={styles.carouselTrack}
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {processSteps.map((step) => (
            <div
              key={step.number}
              className={styles.carouselSlide}
              style={{ flex: `0 0 ${100 / itemsPerView}%` }}
            >
              <article className={styles.carouselCard}>
                <div className={styles.carouselHeader}>
                  <span className={styles.carouselNumber}>{step.number}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.carouselControls}>
        <button onClick={prevSlide} className={styles.carouselArrow} aria-label="Föregående">
          <svg viewBox="0 0 24 24" aria-hidden="true" style={{ transform: "rotate(180deg)" }}>
            <path d="M13.2 5.4 19.8 12l-6.6 6.6-1.7-1.7 3.6-3.7H4v-2.4h11.1l-3.6-3.7z" />
          </svg>
        </button>

        <div className={styles.carouselPagination}>
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`${styles.carouselDot} ${index === currentIndex ? styles.activeDot : ""}`}
              aria-label={`Gå till sida ${index + 1}`}
            />
          ))}
        </div>

        <button onClick={nextSlide} className={styles.carouselArrow} aria-label="Nästa">
          <ArrowIcon />
        </button>
      </div>
    </div>
  );
}
