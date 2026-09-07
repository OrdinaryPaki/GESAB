"use client";

import { useEffect, useRef } from "react";
import styles from "./ads-consent.module.css";

export function CookiePreferences({ open, allowed, onChange, onSave, onClose, error }) {
  const dialog = useRef(null);

  useEffect(() => {
    if (open && !dialog.current.open) dialog.current.show();
    if (!open && dialog.current.open) dialog.current.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      className={styles.preferences}
      aria-labelledby="cookie-preferences-title"
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        onClose();
      }}
    >
      <div className={styles.dialogHeader}>
        <span className={styles.eyebrow}>GESAB · COOKIES</span>
        <button type="button" className={styles.close} aria-label="Stäng cookieinställningar" onClick={onClose}>×</button>
      </div>
      <h2 id="cookie-preferences-title">Hantera cookies</h2>
      <p>Du väljer. Annonsmätning är frivillig och hemsidan fungerar även utan den.</p>
      <div className={styles.preferenceCard}>
        <label className={styles.preference}>
          <span>Annonsmätning med Google Ads</span>
          <span className={styles.switch}>
            <input type="checkbox" role="switch" checked={allowed} onChange={(event) => onChange(event.target.checked)} />
            <span className={styles.switchTrack} aria-hidden="true" />
          </span>
        </label>
        <p>Hjälper oss se vilka annonser som leder till besök och skickade förfrågningar. Cookies används och uppgifter om besöket och händelsen delas med Google. Personanpassade annonser är avstängda.</p>
        <span className={styles.choiceState}>{allowed ? "På" : "Av"}</span>
      </div>
      <p className={styles.note}>Ditt val sparas i den här webbläsaren i 180 dagar och kan ändras via Integritet och cookies i sidfoten. Återkallar du ett ja laddas sidan om för att stoppa mätningen.</p>
      <a href="https://business.safety.google/privacy/" target="_blank" rel="noopener noreferrer">Så använder Google uppgifterna</a>
      {error ? <p role="alert">Ditt nej kunde inte sparas. Rensa webbplatsens sparade data i webbläsaren för att ta bort ditt tidigare ja.</p> : null}
      <div className={styles.actions}>
        <button type="button" className={styles.accept} onClick={() => onSave(allowed)}>Spara mitt val</button>
      </div>
    </dialog>
  );
}
