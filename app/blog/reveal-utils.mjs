export function isElementInRevealRange(rect, viewportHeight) {
  const revealBoundary = viewportHeight * 0.92;
  return rect.top < revealBoundary && rect.bottom > 0;
}
