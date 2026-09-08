import { services } from "./gesab-data";
import { siteConfig } from "./site-config";
import { localAreas, localServicePath } from "./service/local-areas";

export default function sitemap() {
  const paths = ["/", "/about", "/service", "/galleri", "/contact", "/cookies"];
  const localPaths = services.flatMap(({ slug }) => localAreas.map(area => localServicePath(slug, area.slug)));
  return [...paths, ...services.map(({ slug }) => `/service/${slug}`), ...localPaths].map((path) => ({
    url: new URL(path, siteConfig.url).href,
  }));
}
