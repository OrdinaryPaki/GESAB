import { services } from "./gesab-data";
import { siteConfig } from "./site-config";

export default function sitemap() {
  const paths = ["/", "/about", "/service", "/galleri", "/contact", "/cookies"];
  return [...paths, ...services.map(({ slug }) => `/service/${slug}`)].map((path) => ({
    url: new URL(path, siteConfig.url).href,
  }));
}
