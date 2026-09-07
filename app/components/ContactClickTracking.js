"use client";

import { useEffect } from "react";
import { captureTrafficSource } from "../tracking/traffic-source.mjs";
import { recordPhoneClick } from "../tracking/phone-clicks.mjs";
import { trackContactClicked } from "../tracking/marketing-tracking.mjs";

export function ContactClickTracking() {
  useEffect(() => {
    captureTrafficSource(window);
    function onClick(event) {
      const anchor = event.target?.closest?.("a[href]");
      const href = anchor?.getAttribute("href") ?? "";
      const kind = href.startsWith("tel:") ? "phone" : href.startsWith("mailto:") ? "email" : null;
      if (kind === "phone") void recordPhoneClick({ href, page: window.location.pathname });
      if (kind) trackContactClicked({ kind, page: window.location.pathname });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
