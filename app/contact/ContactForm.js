"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ServiceSelect } from "../components/ServiceSelect";
import { CtaButton } from "../components/CtaButton";
import { InquiryFormError, InquiryHoneypot } from "../components/InquiryFormSupport";
import { serviceSelectOptions } from "../gesab-data";
import { createInquirySubmissionSession } from "../lib/inquiries/submit-inquiry.mjs";
import styles from "./contact-form.module.css";
import "./ContactForm.css";

const MESSAGE_MAX_HEIGHT = 280;

export function ContactForm() {
  const messageRef = useRef(null);
  const submissionSessionRef = useRef(null);
  submissionSessionRef.current ??= createInquirySubmissionSession();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    service: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState("idle");

  useLayoutEffect(() => {
    const el = messageRef.current;
    if (!el) return;

    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, MESSAGE_MAX_HEIGHT);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > MESSAGE_MAX_HEIGHT ? "auto" : "hidden";
  }, [formData.message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    submissionSessionRef.current.invalidate();
    setStatus((current) => current === "error" ? "idle" : current);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value) => {
    submissionSessionRef.current.invalidate();
    setStatus((current) => current === "error" ? "idle" : current);
    setFormData((prev) => ({ ...prev, service: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    try {
      await submissionSessionRef.current.submit({ source: "contact", ...formData });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const resetForm = () => {
    submissionSessionRef.current.invalidate();
    setStatus("idle");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      service: "",
      message: "",
      website: "",
    });
  };

  if (status === "success") {
    return (
      <div className="contact-success-card">
        <div className="success-icon-wrapper">
          <svg className="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Tack för din förfrågan!</h3>
        <p>Vi återkommer till dig så snart vi kan.</p>
        <button 
          type="button"
          className="success-reset-button" 
          onClick={resetForm}
        >
          Skicka ett till meddelande
        </button>
      </div>
    );
  }

  return (
    <form className="contact-main-form" onSubmit={handleSubmit}>
      <div className={styles.contactFormFields}>
          <label>
            Förnamn*
            <input 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Förnamn" 
              required
            />
          </label>
          <label>
            Efternamn*
            <input 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Efternamn" 
              required
            />
          </label>
          <label className="wide">
            E-post*
            <input 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="namn@exempel.se" 
              type="email" 
              required
            />
          </label>
          <ServiceSelect 
            className="wide" 
            label="Tjänst*" 
            options={serviceSelectOptions} 
            value={formData.service}
            onChange={handleServiceChange}
          />
          <label className="wide">
            Meddelande*
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
        </div>
        <div className="contact-form-actions">
          <InquiryFormError visible={status === "error"} />
          <CtaButton type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Skickar..." : "Skicka förfrågan"}
          </CtaButton>
        </div>
    </form>
  );
}
