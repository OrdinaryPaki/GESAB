"use client";

import { useEffect, useRef, useState } from "react";

import { isElementInRevealRange } from "./reveal-utils.mjs";
import styles from "./blog.module.css";

export default function RevealOnView({ children, className = "" }) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return undefined;
    }

    if (isElementInRevealRange(element.getBoundingClientRect(), window.innerHeight)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const classes = [styles.reveal, isVisible ? styles.revealed : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={elementRef} className={classes}>
      {children}
    </div>
  );
}
