"use client";

import { useEffect, useRef, useState } from "react";

function getActiveIndex(scroller) {
  const cards = Array.from(scroller.querySelectorAll(".review-card"));
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

export function ReviewCarousel({ items, className = "", cardClassName = "" }) {
  const scrollerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return undefined;
    }

    let frame = 0;

    const updateActive = () => {
      setActiveIndex(getActiveIndex(scroller));
      // Use scrollWidth > clientWidth with a small threshold to account for rounding errors
      setCanScroll(scroller.scrollWidth > scroller.clientWidth + 5);
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
    if (!canScroll) return;
    
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % items.length;
      scrollToIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, items.length, canScroll]);

  function scrollToIndex(index) {
    const scroller = scrollerRef.current;
    const card = scroller?.querySelectorAll(".review-card")[index];
    if (!scroller || !card) {
      return;
    }

    scroller.scrollTo({
      left: card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  }

  return (
    <div className={`review-carousel ${className}`}>
      <div className="review-grid" ref={scrollerRef}>
        {items.map((review) => (
          <figure className={`review-card ${cardClassName}`} key={review.name}>
            <blockquote>{review.quote}</blockquote>
            <figcaption>
              {review.name}, {review.place}
            </figcaption>
          </figure>
        ))}
      </div>

      {canScroll && (
        <div className="review-pagination" role="tablist" aria-label="Kundomdömen">
          {items.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={item.name}
                type="button"
                className={isActive ? "review-dot is-active" : "review-dot"}
                aria-label={`Visa omdöme ${index + 1} av ${items.length}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => scrollToIndex(index)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
