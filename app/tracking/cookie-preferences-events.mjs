export const OPEN_COOKIE_PREFERENCES = "gesab:open-cookie-preferences";

export function openCookiePreferences(trigger) {
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_PREFERENCES, { detail: { trigger } }));
}
