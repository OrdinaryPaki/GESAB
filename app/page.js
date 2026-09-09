import { HomePageFidelity } from "./components/HomePageFidelity";
import { image } from "./gesab-data";
import { createPageMetadata } from "./seo";

export const metadata = createPageMetadata({
  title: "Badrumsrenovering, kök och bygg i Göteborg",
  description:
    "Renovera badrum, kök eller hela hemmet med GESAB i Göteborg med omnejd. Vi samordnar arbetet och tydliggör vad som ingår. Be om offert för ditt projekt.",
  path: "/",
  image: image.heroPhoto,
});

export default function Home() {
  return <HomePageFidelity />;
}
