"use client";

import { useEffect, useRef, useState } from "react";
import { CONSENT_KEY, createAdsConsentController } from "../tracking/google-ads-consent.mjs";
import styles from "./ads-consent.module.css";
import { CookiePreferences } from "./CookiePreferences";

export function AdsConsent() {
  const controller = useRef(null);
  const settingsButton = useRef(null);
  const heading = useRef(null);
  const popup = useRef(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [managing, setManaging] = useState(false);
  const [adsAllowed, setAdsAllowed] = useState(false);

  useEffect(() => {
    controller.current ??= createAdsConsentController(window, document);
    const savedChoice = controller.current.restore();
    setOpen(savedChoice === null);
    setAdsAllowed(savedChoice === true);
    setReady(true);
    function syncChoice(event) {
      if (event.key === CONSENT_KEY || event.key === null) window.location.reload();
    }
    window.addEventListener("storage", syncChoice);
    return () => window.removeEventListener("storage", syncChoice);
  }, []);

  useEffect(() => {
    const dialog = popup.current;
    if (!dialog) return;
    if (ready && open && !managing) {
      if (!dialog.open) dialog.showModal();
      heading.current?.focus();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [ready, open, managing]);

  function saveChoice(allowed) {
    if (controller.current.choose(allowed) === false) {
      setError(true);
      return;
    }
    setError(false);
    setAdsAllowed(allowed);
    setManaging(false);
    setOpen(false);
    requestAnimationFrame(() => settingsButton.current?.focus());
  }

  if (!ready) return null;

  return open ? (
    <>
    <dialog ref={popup} className={styles.panel} aria-labelledby="ads-consent-heading" onCancel={(event) => {
      event.preventDefault();
      setOpen(false);
      requestAnimationFrame(() => settingsButton.current?.focus());
    }}>
      <div className={styles.brand}>
        <img src="/images/gesab/logo.webp" width="815" height="330" alt="GESAB" />
        <span>Ditt besök. Ditt val.</span>
      </div>
      <h2 id="ads-consent-heading" ref={heading} tabIndex={-1}>Cookies</h2>
      <p>
        Får vi använda cookies för annonsmätning med Google Ads? Då delas besöksuppgifter
        med Google så att vi kan se vilka annonser som fungerar. Inga personanpassade annonser.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.accept} aria-label="JA, tillåt annonsmätning med Google Ads" onClick={() => saveChoice(true)}>JA</button>
        <button type="button" aria-haspopup="dialog" onClick={() => setManaging(true)}>Hantera cookies</button>
      </div>
      <button type="button" className={styles.reject} onClick={() => saveChoice(false)}>Neka alla</button>
      {error ? <p role="alert">Webbläsaren kunde inte spara ditt nej. Rensa webbplatsens sparade data i webbläsarens inställningar för att ta bort ditt tidigare ja.</p> : null}
    </dialog>
    <CookiePreferences open={managing} allowed={adsAllowed} onChange={setAdsAllowed} onSave={saveChoice} error={error} onClose={() => {
      setManaging(false);
      requestAnimationFrame(() => heading.current?.focus());
    }} />
    </>
  ) : (
    <button
      type="button"
      className={styles.settings}
      ref={settingsButton}
      onClick={() => {
        setManaging(true);
        setOpen(true);
        requestAnimationFrame(() => heading.current?.focus());
      }}
    >
      Cookieinställningar
    </button>
  );
}
