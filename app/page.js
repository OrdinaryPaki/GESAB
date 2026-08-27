import { HomePageFidelity } from "./components/HomePageFidelity";
import { image } from "./gesab-data";
import { createPageMetadata } from "./seo";

export const metadata = createPageMetadata({
  title: "Badrumsrenovering och entreprenad i Göteborg",
  description:
    "GESAB hjälper privatpersoner, företag och offentlig sektor i Göteborg med badrumsrenovering, köksrenovering, bygg och totalentreprenad.",
  path: "/",
  image: image.heroPhoto,
});

export default function Home() {
  return <HomePageFidelity />;
}
