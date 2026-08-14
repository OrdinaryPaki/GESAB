import "./globals.css";
import { MobileNavigationEnhancement } from "./components/MobileNavigationEnhancement";
import { createLocalBusinessStructuredData } from "./seo";
import { siteConfig } from "./site-config";

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "GESAB - Badrumsrenovering och entreprenad i Göteborg",
    template: "%s | GESAB",
  },
  description:
    "Göteborgs Entreprenad Service AB hjälper med badrumsrenovering, tvättstugsrenovering, köksrenovering, totalentreprenad, rivning och bygg i Göteborg.",
  openGraph: {
    title: "GESAB - Badrumsrenovering och entreprenad i Göteborg",
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
        <script dangerouslySetInnerHTML={{ __html: structuredData }} type="application/ld+json" />
      </body>
    </html>
  );
}
