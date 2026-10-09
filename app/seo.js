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
    alternates: { canonical: url },
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

export function createFaqPageNode(items) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function createWebSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.shortName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "sv-SE",
    publisher: { "@id": `${siteConfig.url}/#business` },
  };
}

export function createLocalBusinessStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.shortName,
    legalName: siteConfig.name,
    alternateName: siteConfig.name,
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
