"use client";

import { useEffect } from "react";

const revealSelector = [
  "[class*='missionStage']",
  ".process-grid",
  ".testimonial-section > .container",
  ".faq-section > .container",
].join(",");

export function AboutRevealController() {
  useEffect(() => {
    const observedTargets = new WeakSet();
    const supportsIntersectionObserver = "IntersectionObserver" in window;
    const observer = supportsIntersectionObserver
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("about-revealed");
                observer.unobserve(entry.target);
              }
            });
          },
          { rootMargin: "0px 0px -12%", threshold: 0.08 },
        )
      : null;

    const observeCurrentTargets = () => {
      const page = document.getElementById("about-page");
      const targets = page ? Array.from(page.querySelectorAll(revealSelector)) : [];

      if (page && observer) {
        page.classList.add("about-animations-ready");
      }

      targets.forEach((target) => {
        if (observedTargets.has(target)) {
          return;
        }

        observedTargets.add(target);
        if (observer) {
          observer.observe(target);
        } else {
          target.classList.add("about-revealed");
        }
      });
    };

    observeCurrentTargets();

    const mutationObserver = new MutationObserver(observeCurrentTargets);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer?.disconnect();
      document.getElementById("about-page")?.classList.remove("about-animations-ready");
    };
  }, []);

  return null;
}
