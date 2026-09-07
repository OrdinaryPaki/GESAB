"use client";

import { useEffect, useRef, useState } from "react";
import { CONSENT_KEY, createAdsConsentController } from "../tracking/google-ads-consent.mjs";
import styles from "./ads-consent.module.css";
import { CookiePreferences } from "./CookiePreferences";
import { OPEN_COOKIE_PREFERENCES } from "../tracking/cookie-preferences-events.mjs";

export function AdsConsent() {
  const controller = useRef(null);
  const returnFocus = useRef(null);
  const openedFromPage = useRef(false);
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
    function showPreferences(event) {
      returnFocus.current = event.detail?.trigger;
      openedFromPage.current = true;
      setAdsAllowed(controller.current.restore() === true);
      setManaging(true);
      setOpen(true);
    }
    window.addEventListener(OPEN_COOKIE_PREFERENCES, showPreferences);
    return () => {
      window.removeEventListener("storage", syncChoice);
      window.removeEventListener(OPEN_COOKIE_PREFERENCES, showPreferences);
    };
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
    requestAnimationFrame(() => returnFocus.current?.focus({ preventScroll: true }));
  }

  if (!ready) return null;

  return open ? (
    <>
    <dialog ref={popup} className={styles.panel} aria-labelledby="ads-consent-heading" onCancel={(event) => {
      event.preventDefault();
      setOpen(false);
      requestAnimationFrame(() => returnFocus.current?.focus({ preventScroll: true }));
    }}>
      <div className={styles.brand}>
        <img src="/images/gesab/logo.webp" width="815" height="330" alt="GESAB" />
        <span>Ditt besök. Ditt val.</span>
      </div>
      <h2 id="ads-consent-heading" ref={heading} tabIndex={-1}>Cookies</h2>
      <p>
        Får vi använda cookies för att se hur våra annonser fungerar? Vi mäter med Google Ads,
        och du kan när som helst ändra ditt val.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.accept} aria-label="JA, tillåt annonsmätning med Google Ads" onClick={() => saveChoice(true)}>JA</button>
        <button type="button" aria-haspopup="dialog" onClick={() => setManaging(true)}>Hantera cookies</button>
      </div>
      {error ? <p role="alert">Webbläsaren kunde inte spara ditt nej. Rensa webbplatsens sparade data i webbläsarens inställningar för att ta bort ditt tidigare ja.</p> : null}
    </dialog>
    <CookiePreferences open={managing} allowed={adsAllowed} onChange={setAdsAllowed} onSave={saveChoice} error={error} onClose={() => {
      setManaging(false);
      if (openedFromPage.current) {
        setOpen(false);
        requestAnimationFrame(() => returnFocus.current?.focus({ preventScroll: true }));
      } else {
        requestAnimationFrame(() => heading.current?.focus());
      }
    }} />
    </>
  ) : null;
}
