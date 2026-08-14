"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { CtaButton } from "./CtaButton";
import { InquiryFormError, InquiryHoneypot } from "./InquiryFormSupport";
import { createInquirySubmissionSession } from "../lib/inquiries/submit-inquiry.mjs";
import "./AppointmentForm.css";

const MESSAGE_MAX_HEIGHT = 280;

export function AppointmentForm() {
  const messageRef = useRef(null);
  const submissionSessionRef = useRef(null);
  submissionSessionRef.current ??= createInquirySubmissionSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState("idle");

  const adjustMessageHeight = useCallback(() => {
    const el = messageRef.current;
    if (!el) return;

    el.style.height = "0px";
    const contentHeight = el.scrollHeight;
    const nextHeight = Math.min(contentHeight, MESSAGE_MAX_HEIGHT);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = contentHeight > MESSAGE_MAX_HEIGHT ? "auto" : "hidden";
  }, []);

  useLayoutEffect(() => {
    adjustMessageHeight();
  }, [formData.message, adjustMessageHeight]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    submissionSessionRef.current.invalidate();
    setStatus((current) => current === "error" ? "idle" : current);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    try {
      await submissionSessionRef.current.submit({ source: "footer", ...formData });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const resetForm = () => {
    submissionSessionRef.current.invalidate();
    setStatus("idle");
    setFormData({ name: "", email: "", phone: "", message: "", website: "" });
  };

  return (
    <form className={`appointment-card ${status === 'success' ? 'is-success' : ''}`} data-appointment-form onSubmit={handleSubmit} style={{ position: 'relative', overflow: 'hidden' }}>
      <div className={`appointment-form-wrapper ${status === 'success' ? 'is-hidden' : ''}`}>
        <h2>Boka offert</h2>
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
        <InquiryHoneypot value={formData.website} onChange={handleChange} />
        <InquiryFormError visible={status === "error"} />
        <div className="appointment-form-actions">
          <CtaButton variant="yellow" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Skickar..." : "Skicka förfrågan"}
          </CtaButton>
        </div>
      </div>

      <div className={`appointment-success-overlay ${status === 'success' ? 'visible' : ''}`}>
        <div className="success-icon-wrapper">
          <svg className="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Tack för din förfrågan!</h3>
        <p>Vi återkommer till dig så snart vi kan.</p>
        <CtaButton variant="yellow" className="success-reset-button" onClick={resetForm}>
          Skicka ett till meddelande
        </CtaButton>
      </div>
    </form>
  );
}
