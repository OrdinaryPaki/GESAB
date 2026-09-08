import { HomePageFidelity } from "./components/HomePageFidelity";
import { image } from "./gesab-data";
import { createPageMetadata } from "./seo";

export const metadata = createPageMetadata({
  title: "Badrumsrenovering och entreprenad i Göteborg",
  description:
    "GESAB hjälper dig att renovera ditt hem i Göteborg. Badrumsrenovering, köksrenovering, golvläggning och totalentreprenad. Kontakta oss för en offert.",
  path: "/",
  image: image.heroPhoto,
});

export default function Home() {
  return <HomePageFidelity />;
}
