export function getMobileNavigationState(isOpen) {
  return {
    ariaExpanded: String(isOpen),
    ariaLabel: isOpen ? "Stäng meny" : "Öppna meny",
    locksPageScroll: isOpen,
  };
}
