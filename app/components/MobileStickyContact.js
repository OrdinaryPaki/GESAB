"use client";

import { useState, useEffect } from "react";
import { MailIcon, PhoneIcon } from "./GesabIcons";
import { ServiceQuoteForm } from "../service/[slug]/ServiceQuoteForm";
import { contactInfo } from "../gesab-data";
import "./MobileStickyContact.css";

export function ChevronUpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 15l-6-6-6 6"/>
    </svg>
  );
}

export function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  );
}

export function MobileStickyContact({ defaultServiceSlug }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);

  return (
    <>
      {expanded && <div className="mobile-sticky-overlay" onClick={() => setExpanded(false)} />}
      <div className={`mobile-sticky-contact ${expanded ? "is-expanded" : ""}`}>
        <div className="mobile-sticky-panel">
          <div className="mobile-sticky-panel-inner">
            <button className="mobile-sticky-close" onClick={() => setExpanded(false)}>
              Stäng
            </button>
            <ServiceQuoteForm 
              defaultServiceSlug={defaultServiceSlug} 
              heading="Få en gratis offert"
              description="Beskriv dina önskemål eller skicka några bilder. Vi återkommer inom 24h med ett fast prisförslag."
              isMobile
            />
            <ul className="mobile-sticky-benefits">
              <li>Tydligt pris innan vi börjar</li>
              <li>ROT-avdrag direkt på fakturan</li>
            </ul>
          </div>
        </div>
        <div className="mobile-sticky-bar">
          <button className="mobile-sticky-btn primary" onClick={() => setExpanded(!expanded)}>
            <div className="mobile-sticky-btn-content">
              <MailIcon />
              <span>Kontakta oss</span>
            </div>
            {expanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </button>
          <a className="mobile-sticky-btn secondary" href={contactInfo.phonePrimaryHref}>
            <PhoneIcon />
            <span>Ring oss</span>
          </a>
        </div>
      </div>
    </>
  );
}
