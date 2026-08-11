import "./globals.css";
import "./responsive.css";
import { MobileNavigationEnhancement } from "./components/MobileNavigationEnhancement";

export const metadata = {
  metadataBase: new URL("https://www.ges-ab.se"),
  title: {
    default: "GESAB - Badrumsrenovering och entreprenad i Göteborg",
    template: "%s | GESAB",
  },
  description:
    "Göteborgs Entreprenad Service AB hjälper med badrumsrenovering, köksrenovering, totalentreprenad, bygg, fasad, snickeri, målning och montage i Göteborg.",
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
  return (
    <html lang="sv" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MobileNavigationEnhancement />
        {children}
      </body>
    </html>
  );
}
