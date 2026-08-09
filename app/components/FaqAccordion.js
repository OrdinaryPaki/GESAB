"use client";

import { useState } from "react";

import {
  getInitialOpenFaqIndex,
  getNextOpenFaqIndex,
} from "./faq-accordion-state.mjs";

export function FaqAccordion({ items }) {
  const [openItemIndex, setOpenItemIndex] = useState(getInitialOpenFaqIndex);

  function toggleItem(index) {
    setOpenItemIndex((currentIndex) => getNextOpenFaqIndex(currentIndex, index));
  }

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = openItemIndex === index;
        const panelId = `faq-panel-${index}`;

        return (
          <div className={isOpen ? "faq-item open" : "faq-item"} key={item.question}>
            <button
              aria-controls={panelId}
              aria-expanded={isOpen}
              className="faq-question"
              onClick={() => toggleItem(index)}
              type="button"
            >
              {item.question}
            </button>
            <div aria-hidden={!isOpen} className="faq-panel" id={panelId}>
              <div className="faq-panel-inner">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
