import Link from "next/link";

import { faqItems } from "../gesab-data";
import { FaqAccordion } from "./FaqAccordion";
import { ArrowIcon } from "./GesabIcons";

function SectionTitle({ label, title }) {
  return (
    <div className="section-title">
      <span>{label}</span>
      <h2>{title}</h2>
    </div>
  );
}

export function FaqSection({
  items = faqItems,
  title = "Vanliga frågor inför renovering",
  ctaTitle = "Vill du stämma av ditt projekt?",
  ctaBody = "Beskriv projektet, så återkommer vi med nästa steg inför offert.",
  ctaHref = "/contact",
  ctaLabel = "Kontakta oss",
}) {
  return (
    <section className="faq-section">
      <div className="container faq-grid">
        <div className="faq-intro">
          <SectionTitle label="FAQ" title={title} />
          <div className="faq-cta">
            <h3>{ctaTitle}</h3>
            <p>{ctaBody}</p>
            <Link href={ctaHref}>
              {ctaLabel} <ArrowIcon />
            </Link>
          </div>
        </div>
        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
