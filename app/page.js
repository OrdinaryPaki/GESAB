import { HomePageFidelity } from "./components/HomePageFidelity";
import { faqItems, image } from "./gesab-data";
import { createFaqPageNode, createPageMetadata } from "./seo";

export const metadata = createPageMetadata({
  title: "Badrumsrenovering, kök och bygg i Göteborg",
  description:
    "Renovera badrum, kök eller hela hemmet med GESAB i Göteborg med omnejd. Vi samordnar arbetet och tydliggör vad som ingår. Be om offert.",
  path: "/",
  image: image.heroPhoto,
});

const faqStructuredData = JSON.stringify({
  "@context": "https://schema.org",
  ...createFaqPageNode(faqItems),
}).replaceAll("<", "\\u003c");

export default function Home() {
  return (
    <>
      <HomePageFidelity />
      <script dangerouslySetInnerHTML={{ __html: faqStructuredData }} type="application/ld+json" />
    </>
  );
}
