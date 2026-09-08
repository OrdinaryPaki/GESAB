import { services } from "./gesab-data";
import { siteConfig } from "./site-config";

export default function sitemap() {
  // Area-specific service pages will be submitted in a later indexing phase.
  const paths = ["/", "/about", "/service", "/galleri", "/contact", "/cookies"];
  return [...paths, ...services.map(({ slug }) => `/service/${slug}`)].map((path) => ({
    url: new URL(path, siteConfig.url).href,
  }));
}
