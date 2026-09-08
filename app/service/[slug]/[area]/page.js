import { notFound } from "next/navigation";
import { services } from "../../../gesab-data";
import { createPageMetadata } from "../../../seo";
import { serviceDetailContent } from "../../detail-content";
import { localAreas, localServicePath } from "../../local-areas";
import { createLocalServiceDetail } from "../../local-service-content";
import { ServiceDetailPageView } from "../ServiceDetailPageView";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.flatMap(({ slug }) => localAreas.map(({ slug: area }) => ({ slug, area })));
}

function getLocalPage(params) {
  const service = services.find(({ slug }) => slug === params.slug);
  const area = localAreas.find(({ slug }) => slug === params.area);
  const baseDetail = serviceDetailContent[params.slug];
  if (!service || !area || !baseDetail) notFound();
  return { service, area, detail: createLocalServiceDetail(service, baseDetail, area) };
}

export async function generateMetadata({ params }) {
  const { service, area, detail } = getLocalPage(await params);
  return createPageMetadata({
    title: detail.heroTitle,
    description: detail.localDescription,
    path: localServicePath(service.slug, area.slug),
    image: detail.heroImage ?? service.image,
  });
}

export default async function LocalServicePage({ params }) {
  const { service, area, detail } = getLocalPage(await params);
  const relatedServices = detail.related.map(slug => services.find(service => service.slug === slug)).filter(Boolean);
  return <ServiceDetailPageView service={service} detail={detail} relatedServices={relatedServices} area={area} />;
}
