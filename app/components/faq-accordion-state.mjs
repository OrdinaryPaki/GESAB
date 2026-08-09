export function getInitialOpenFaqIndex() {
  return 0;
}

export function getNextOpenFaqIndex(currentIndex, selectedIndex) {
  return currentIndex === selectedIndex ? null : selectedIndex;
}
