"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getMobileNavigationState } from "./mobile-navigation-state.mjs";

const desktopMediaQuery = "(min-width: 981px)";

function synchronizeMenuState(menu, button) {
  const state = getMobileNavigationState(menu.open);

  button.setAttribute("aria-expanded", state.ariaExpanded);
  button.setAttribute("aria-label", state.ariaLabel);
  document.body.classList.toggle("mobile-navigation-open", state.locksPageScroll);
}

function closeMenu(menu, button, { restoreFocus = false } = {}) {
  if (!menu.open) return;

  menu.open = false;
  synchronizeMenuState(menu, button);

  if (restoreFocus) button.focus();
}

export function MobileNavigationEnhancement() {
  const pathname = usePathname();

  useEffect(() => {
    const menu = document.querySelector("[data-mobile-menu]");
    const button = menu?.querySelector("[data-mobile-menu-button]");

    if (!menu || !button) return undefined;

    const desktopQuery = window.matchMedia(desktopMediaQuery);
    const links = Array.from(menu.querySelectorAll("[data-mobile-menu-panel] a"));
    const handleToggle = () => synchronizeMenuState(menu, button);
    const handleEscape = (event) => {
      if (event.key === "Escape") closeMenu(menu, button, { restoreFocus: true });
    };
    const handleDesktopChange = (event) => {
      if (event.matches) closeMenu(menu, button);
    };
    const handleLinkClick = () => closeMenu(menu, button);

    synchronizeMenuState(menu, button);
    menu.addEventListener("toggle", handleToggle);
    document.addEventListener("keydown", handleEscape);
    desktopQuery.addEventListener("change", handleDesktopChange);
    links.forEach((link) => link.addEventListener("click", handleLinkClick));

    return () => {
      menu.removeEventListener("toggle", handleToggle);
      document.removeEventListener("keydown", handleEscape);
      desktopQuery.removeEventListener("change", handleDesktopChange);
      links.forEach((link) => link.removeEventListener("click", handleLinkClick));
      document.body.classList.remove("mobile-navigation-open");
    };
  }, [pathname]);

  return null;
}
