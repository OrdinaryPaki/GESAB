"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { CtaButton } from "../../components/CtaButton";
import "./ServiceQuoteForm.css";

const MESSAGE_MAX_HEIGHT = 280;

export function ServiceQuoteForm({ defaultServiceSlug, description, heading, isMobile = false }) {
  const messageRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, submitting, success

  useLayoutEffect(() => {
    const el = messageRef.current;
    if (!el) return;

    const computedMax = Number.parseFloat(getComputedStyle(el).maxHeight);
    const maxHeight = Number.isFinite(computedMax) && computedMax > 0 ? computedMax : MESSAGE_MAX_HEIGHT;

    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [formData.message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("submitting");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
    }, 1000);
  };

  return (
    <form className={`service-quote-form ${status === 'success' ? 'is-success' : ''}`} data-service-quote-form={!isMobile ? true : undefined} data-mobile-quote-form={isMobile ? true : undefined} onSubmit={handleSubmit} style={{ position: 'relative', overflow: 'hidden' }}>
      <div className={`service-quote-form-wrapper ${status === 'success' ? 'is-hidden' : ''}`}>
        <h2>{heading}</h2>
        <p className="service-quote-form-intro">{description}</p>
        <input type="hidden" name="service" value={defaultServiceSlug} />
        <label>
          Namn
          <input 
            type="text" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            autoComplete="name" 
            placeholder="För- och efternamn" 
            required
          />
        </label>
        <label>
          E-post
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            autoComplete="email" 
            placeholder="namn@exempel.se" 
            required
          />
        </label>
        <label>
          Telefon
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone}
            onChange={handleChange}
            autoComplete="tel" 
            placeholder="0700 00 00 00" 
            required
          />
        </label>
        <label>
          Meddelande
          <textarea
            ref={messageRef}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Beskriv kort vad du vill ha hjälp med."
            rows={3}
            required
          />
        </label>
        <div className="service-quote-form-actions">
          <CtaButton variant="yellow" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Skickar..." : "Få gratis offert"}
          </CtaButton>
        </div>
      </div>

      <div className={`service-quote-success-overlay ${status === 'success' ? 'visible' : ''}`}>
        <div className="success-icon-wrapper">
          <svg className="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Tack för din förfrågan!</h3>
        <p>Vi återkommer till dig så snart vi kan.</p>
        <CtaButton variant="yellow" className="success-reset-button" onClick={() => { setStatus("idle"); setFormData({ name: "", email: "", phone: "", message: "" }); }}>
          Skicka ett till meddelande
        </CtaButton>
      </div>
    </form>
  );
}
