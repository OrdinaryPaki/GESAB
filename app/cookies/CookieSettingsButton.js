"use client";

import { openCookiePreferences } from "../tracking/cookie-preferences-events.mjs";
import styles from "./cookies.module.css";

export function CookieSettingsButton() {
  return (
    <button className={styles.settingsButton} type="button" aria-haspopup="dialog" onClick={(event) => openCookiePreferences(event.currentTarget)}>
      Hantera cookies
    </button>
  );
}
