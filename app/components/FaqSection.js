import { faqItems } from "../gesab-data";
import { FaqAccordion } from "./FaqAccordion";
import "./FaqSection.css";

export function FaqSection({
  items = faqItems,
}) {
  return (
    <section className="faq-section">
      <div className="container faq-grid">
        <div className="faq-intro">
          <span className="faq-label">FAQ</span>
          <h2>Vanliga frågor & svar</h2>
          <p>Här har vi samlat svaren på de vanligaste frågorna vi får inför en renovering eller ett byggprojekt.</p>
        </div>
        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
