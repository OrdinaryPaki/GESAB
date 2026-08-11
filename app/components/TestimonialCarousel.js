"use client";

import { useEffect, useRef, useState } from "react";
import { StarIcon } from "./GesabIcons";

function getActiveIndex(scroller) {
  const cards = Array.from(scroller.querySelectorAll(".testimonial-card"));
  if (!cards.length) {
    return 0;
  }

  const center = scroller.scrollLeft + scroller.clientWidth / 2;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  cards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const distance = Math.abs(cardCenter - center);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

export function TestimonialCarousel({ items, className = "" }) {
  const scrollerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return undefined;
    }

    let frame = 0;

    const updateActive = () => {
      setActiveIndex(getActiveIndex(scroller));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActive);
    };

    updateActive();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActive);

    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % items.length;
      scrollToIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, items.length]);

  function scrollToIndex(index) {
    const scroller = scrollerRef.current;
    const card = scroller?.querySelectorAll(".testimonial-card")[index];
    if (!scroller || !card) {
      return;
    }

    scroller.scrollTo({
      left: card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  }

  return (
    <div className={`testimonial-carousel ${className}`}>
      <div className="testimonial-grid" ref={scrollerRef}>
        {items.map((item) => (
          <article key={item.name} className="testimonial-card">
            <div className="person">
              <div>
                <h3>{item.name}</h3>
                <span>{item.place}</span>
              </div>
            </div>
            <p>{item.quote}</p>
            <div className="rating-stars" aria-label="Fem av fem">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <StarIcon key={starIndex} />
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="testimonial-pagination" role="tablist" aria-label="Kundomdömen">
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={item.name}
              type="button"
              className={isActive ? "testimonial-dot is-active" : "testimonial-dot"}
              aria-label={`Visa omdöme ${index + 1} av ${items.length}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => scrollToIndex(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
