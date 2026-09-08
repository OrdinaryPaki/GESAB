import "./globals.css";
import "./brand.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MobileNavigationEnhancement } from "./components/MobileNavigationEnhancement";
import { AdsConsent } from "./components/AdsConsent";
import { ContactClickTracking } from "./components/ContactClickTracking";
import { createLocalBusinessStructuredData } from "./seo";
import { siteConfig } from "./site-config";

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  title: {
    default: `${siteConfig.shortName} - Badrumsrenovering och entreprenad i Göteborg`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description:
    `${siteConfig.name} hjälper med badrumsrenovering, altanbygge, tvättstugsrenovering, köksrenovering, totalentreprenad, rivning och bygg i Göteborg.`,
  openGraph: {
    title: `${siteConfig.shortName} - Badrumsrenovering och entreprenad i Göteborg`,
    description:
      "Rådgivning, planering och utförande för badrum, kök, bygg och renovering i Göteborg.",
    locale: "sv_SE",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const structuredData = JSON.stringify(createLocalBusinessStructuredData()).replaceAll("<", "\\u003c");

  return (
    <html lang="sv" data-scroll-behavior="smooth">
      <head>
      </head>
      <body>
        <MobileNavigationEnhancement />
        {children}
        <AdsConsent />
        <ContactClickTracking />
        <Analytics />
        <SpeedInsights />
        <script dangerouslySetInnerHTML={{ __html: structuredData }} type="application/ld+json" />
      </body>
    </html>
  );
}
