"use client";

import { useEffect, useRef, useState } from "react";
import { CONSENT_KEY, createAdsConsentController } from "../tracking/google-ads-consent.mjs";
import styles from "./ads-consent.module.css";

export function AdsConsent() {
  const controller = useRef(null);
  const settingsButton = useRef(null);
  const heading = useRef(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    controller.current ??= createAdsConsentController(window, document);
    setOpen(controller.current.restore() === null);
    setReady(true);
    function syncChoice(event) {
      if (event.key === CONSENT_KEY || event.key === null) window.location.reload();
    }
    window.addEventListener("storage", syncChoice);
    return () => window.removeEventListener("storage", syncChoice);
  }, []);

  function saveChoice(allowed) {
    if (controller.current.choose(allowed) === false) {
      setError(true);
      return;
    }
    setError(false);
    setOpen(false);
    requestAnimationFrame(() => settingsButton.current?.focus());
  }

  if (!ready) return null;

  return open ? (
    <section className={styles.panel} aria-labelledby="ads-consent-heading">
      <div className={styles.brand}>
        <img src="/images/gesab/logo.webp" width="815" height="330" alt="GESAB" />
        <span>Ditt besök. Ditt val.</span>
      </div>
      <h2 id="ads-consent-heading" ref={heading} tabIndex={-1}>Får vi mäta vad som fungerar?</h2>
      <p>
        Med ditt ja använder vi cookies för att se vilka annonser som leder till besök hos
        GESAB. Besöksuppgifter delas då med Google för annonsmätning, utan personanpassade annonser.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.accept} onClick={() => saveChoice(true)}>Tillåt annonsmätning</button>
        <button type="button" onClick={() => saveChoice(false)}>Nej tack</button>
      </div>
      <p className={styles.note}>Hemsidan fungerar lika bra om du tackar nej.</p>
      {error ? <p role="alert">Webbläsaren kunde inte spara ditt nej. Rensa webbplatsens sparade data i webbläsarens inställningar för att ta bort ditt tidigare ja.</p> : null}
      <details className={styles.details}>
        <summary>Om cookies och ditt val</summary>
        <p>
        Vi använder Google-taggen och annonscookies för Google Ads.
        Ditt ja eller nej sparas separat i den här webbläsaren i 180 dagar. Du kan när som helst
        ändra valet via Cookieinställningar. Om du återkallar ett ja laddas sidan om för att
        stoppa mätningen. {" "}
        <a href="https://business.safety.google/privacy/" target="_blank" rel="noopener noreferrer">
          Så använder Google uppgifterna
        </a>.
        </p>
      </details>
    </section>
  ) : (
    <button
      type="button"
      className={styles.settings}
      ref={settingsButton}
      onClick={() => {
        setOpen(true);
        requestAnimationFrame(() => heading.current?.focus());
      }}
    >
      Cookieinställningar
    </button>
  );
}
