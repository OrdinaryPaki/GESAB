import Link from "next/link";
import { faqItems } from "../gesab-data";
import { FaqAccordion } from "./FaqAccordion";
import { ArrowIcon } from "./GesabIcons";

export function FaqSectionAlternative({
  items = faqItems,
  title = "Vanliga frågor inför renovering",
  subtitle = "Här hittar du svar på de vanligaste frågorna vi får. Hittar du inte det du söker? Tveka inte att höra av dig.",
  ctaHref = "/contact",
  ctaLabel = "Kontakta oss",
}) {
  return (
    <section className="faq-section-alt">
      <div className="container faq-container-alt">
        <div className="faq-header-alt">
          <h2>{title}</h2>
          <p>{subtitle}</p>
          <Link href={ctaHref} className="faq-cta-btn-alt">
            {ctaLabel} <ArrowIcon />
          </Link>
        </div>
        <div className="faq-content-alt">
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  );
}
