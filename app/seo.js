import { contactInfo, siteConfig } from "./site-config";

function absoluteUrl(pathOrUrl) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  return new URL(pathOrUrl, `${siteConfig.url}/`).toString();
}

export function createPageMetadata({ title, description, path, image }) {
  const url = absoluteUrl(path);
  const socialImage = absoluteUrl(image);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.shortName,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: socialImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export function createLocalBusinessStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    telephone: contactInfo.phonePrimaryInternational,
    email: contactInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contactInfo.streetAddress,
      postalCode: contactInfo.postalCode,
      addressLocality: contactInfo.addressLocality,
      addressCountry: contactInfo.addressCountry,
    },
    areaServed: {
      "@type": "City",
      name: "Göteborg",
    },
  };
}
