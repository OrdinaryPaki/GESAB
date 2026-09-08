export const localAreas = [
  {
    slug: "boras",
    name: "Borås",
    planning: "Vi utgår från Göteborg och tar uppdrag i Borås. Ange din adress och önskad start när du kontaktar oss, så kan vi planera genomgång, platsbesök och utförande utifrån ditt projekt.",
  },
  {
    slug: "kungsbacka",
    name: "Kungsbacka",
    planning: "Vi utgår från Göteborg och arbetar även i Kungsbacka. Berätta var arbetet ska utföras och hur bostaden används under tiden, så går vi igenom åtkomst, leveranser och en lämplig ordningsföljd tillsammans med dig.",
  },
];

export function localServicePath(serviceSlug, areaSlug) {
  return `/service/${serviceSlug}/${areaSlug}`;
}
