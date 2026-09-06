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
    <section className={styles.panel} aria-labelledby="ads-consent-heading">
      <div className={styles.brand}>
        <img src="/images/gesab/logo.webp" width="815" height="330" alt="GESAB" />
        <span>Ditt besök. Ditt val.</span>
      </div>
      <h2 id="ads-consent-heading" ref={heading} tabIndex={-1}>Cookies</h2>
      <p>
        Med ditt ja använder vi cookies för att se vilka annonser som leder till besök hos
        GESAB. Besöksuppgifter delas då med Google för annonsmätning, utan personanpassade annonser.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.accept} onClick={() => saveChoice(true)}>Ja, tillåt annonsmätning</button>
        <button type="button" aria-expanded={managing} aria-controls="cookie-preferences" onClick={() => setManaging(!managing)}>Hantera cookies</button>
      </div>
      <button type="button" className={styles.reject} onClick={() => saveChoice(false)}>Neka alla</button>
      {error ? <p role="alert">Webbläsaren kunde inte spara ditt nej. Rensa webbplatsens sparade data i webbläsarens inställningar för att ta bort ditt tidigare ja.</p> : null}
      <div id="cookie-preferences" className={styles.details} hidden={!managing}>
        <label className={styles.preference}>
          <input type="checkbox" checked={adsAllowed} onChange={(event) => setAdsAllowed(event.target.checked)} />
          Annonsmätning med Google Ads
        </label>
        <p>
        Vi använder Google-taggen och annonscookies för Google Ads.
        Ditt ja eller nej sparas separat i den här webbläsaren i 180 dagar. Du kan när som helst
        ändra valet via Cookieinställningar. Om du återkallar ett ja laddas sidan om för att
        stoppa mätningen. {" "}
        <a href="https://business.safety.google/privacy/" target="_blank" rel="noopener noreferrer">
          Så använder Google uppgifterna
        </a>.
        </p>
        <div className={styles.actions}>
          <button type="button" onClick={() => saveChoice(adsAllowed)}>Spara mitt val</button>
        </div>
      </div>
    </section>
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
