export const siteConfig = {
  name: "Göteborgs Entreprenad Service AB",
  shortName: "GESAB",
  url: "https://www.ges-ab.se",
  locale: "sv_SE",
  areaServed: "Göteborg med omnejd",
};

const ADDRESS_LINE = "Östergärde Industriväg 39, 417 29 Göteborg";
const CONTACT_EMAIL = "kontakt@ges-ab.se";

export const contactInfo = {
  company: siteConfig.name,
  shortName: siteConfig.shortName,
  addressLine: ADDRESS_LINE,
  streetAddress: "Östergärde Industriväg 39",
  postalCode: "417 29",
  addressLocality: "Göteborg",
  addressCountry: "SE",
  mapsSearchHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_LINE)}`,
  map: {
    lat: 57.7502526,
    lng: 11.8808103,
    zoom: 14,
  },
  phonePrimary: "0707 299 633",
  phoneSecondary: "0760 50 44 08",
  phonePrimaryInternational: "+46707299633",
  phoneSecondaryInternational: "+46760504408",
  phonePrimaryHref: "tel:+46707299633",
  phoneSecondaryHref: "tel:+46760504408",
  email: CONTACT_EMAIL,
  emailHref: `mailto:${CONTACT_EMAIL}`,
};
