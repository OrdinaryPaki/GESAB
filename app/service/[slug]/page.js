import { notFound } from "next/navigation";
import { services } from "../../gesab-data";
import { serviceDetailContent } from "../detail-content";
import { ServiceDetailPageView } from "./ServiceDetailPageView";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    return {
      title: "Tjänst saknas",
    };
  }

  return {
    title: `${service.title} i Göteborg`,
    description: service.body,
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  const detail = serviceDetailContent[slug];

  if (!service || !detail) {
    notFound();
  }

  const relatedServices = detail.related
    .map((relatedSlug) => services.find((item) => item.slug === relatedSlug))
    .filter(Boolean);

  return <ServiceDetailPageView detail={detail} relatedServices={relatedServices} service={service} />;
}
