"use client";

import { useEffect } from "react";

export function HomeReveal() {
  useEffect(() => {
    const homePage = document.querySelector(".home-page");

    if (!homePage) {
      return undefined;
    }

    const sections = Array.from(homePage.querySelectorAll(":scope > section:not(.hero)"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    homePage.classList.add("home-reveal-ready");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10%", threshold: 0.08 },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return null;
}
