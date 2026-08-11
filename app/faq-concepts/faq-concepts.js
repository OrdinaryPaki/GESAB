import Link from "next/link";
import { faqItems } from "../../gesab-data";
import { FaqAccordion } from "../components/FaqAccordion";
import { ArrowIcon } from "../components/GesabIcons";
import "./faq-concepts.css";

// Koncept 1: Minimalistisk med tunna linjer
export function FaqConcept1({ items = faqItems }) {
  return (
    <div className="faq-concept-1">
      <div className="faq-header">
        <h2>Vanliga frågor</h2>
        <p>Här hittar du svar på de vanligaste frågorna vi får.</p>
      </div>
      <div className="faq-list-minimal">
        {items.map((item, i) => (
          <details key={i} className="faq-item-minimal">
            <summary>
              {item.question}
              <span className="icon">+</span>
            </summary>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// Koncept 2: Kort-layout med blå hover
export function FaqConcept2({ items = faqItems }) {
  return (
    <div className="faq-concept-2">
      <div className="faq-header">
        <h2>Vanliga frågor</h2>
      </div>
      <div className="faq-grid-cards">
        {items.map((item, i) => (
          <details key={i} className="faq-card">
            <summary>
              {item.question}
              <span className="icon">
                <ArrowIcon />
              </span>
            </summary>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// Koncept 3: Delad vy (Split view) med gul accent
export function FaqConcept3({ items = faqItems }) {
  return (
    <div className="faq-concept-3">
      <div className="faq-split-layout">
        <div className="faq-split-left">
          <h2>Vanliga frågor</h2>
          <p>Hittar du inte det du söker? Tveka inte att höra av dig till oss.</p>
          <Link href="/contact" className="cta-button cta-button-yellow">
            Kontakta oss
          </Link>
        </div>
        <div className="faq-split-right">
          <div className="faq-list-split">
            {items.map((item, i) => (
              <details key={i} className="faq-item-split">
                <summary>
                  <span className="number">0{i + 1}</span>
                  {item.question}
                </summary>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Koncept 4: Mörk bakgrund med vita kort
export function FaqConcept4({ items = faqItems }) {
  return (
    <div className="faq-concept-4">
      <div className="faq-header dark">
        <h2>Vanliga frågor</h2>
      </div>
      <div className="faq-list-dark">
        {items.map((item, i) => (
          <details key={i} className="faq-item-dark">
            <summary>
              {item.question}
              <span className="icon">+</span>
            </summary>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// Koncept 5: Kompakt grid (2 kolumner)
export function FaqConcept5({ items = faqItems }) {
  return (
    <div className="faq-concept-5">
      <div className="faq-header">
        <h2>Vanliga frågor</h2>
      </div>
      <div className="faq-compact-grid">
        {items.map((item, i) => (
          <details key={i} className="faq-item-compact">
            <summary>{item.question}</summary>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// Koncept 6: Stor typografi, ingen ram
export function FaqConcept6({ items = faqItems }) {
  return (
    <div className="faq-concept-6">
      <div className="faq-header">
        <h2>Vanliga frågor</h2>
      </div>
      <div className="faq-list-huge">
        {items.map((item, i) => (
          <details key={i} className="faq-item-huge">
            <summary>
              {item.question}
            </summary>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// Koncept 7: Blå accentfärg med runda hörn
export function FaqConcept7({ items = faqItems }) {
  return (
    <div className="faq-concept-7">
      <div className="faq-header">
        <h2>Vanliga frågor</h2>
      </div>
      <div className="faq-list-rounded">
        {items.map((item, i) => (
          <details key={i} className="faq-item-rounded">
            <summary>
              {item.question}
              <span className="icon">↓</span>
            </summary>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// Koncept 8: Sido-flikar (Tabs-liknande)
export function FaqConcept8({ items = faqItems }) {
  return (
    <div className="faq-concept-8">
      <div className="faq-header">
        <h2>Vanliga frågor</h2>
      </div>
      <div className="faq-list-tabs">
        {items.map((item, i) => (
          <details key={i} className="faq-item-tabs">
            <summary>
              <span className="indicator"></span>
              {item.question}
            </summary>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// Koncept 9: Gul bakgrund, svart text (High contrast)
export function FaqConcept9({ items = faqItems }) {
  return (
    <div className="faq-concept-9">
      <div className="faq-header">
        <h2>Vanliga frågor</h2>
      </div>
      <div className="faq-list-yellow">
        {items.map((item, i) => (
          <details key={i} className="faq-item-yellow">
            <summary>
              {item.question}
              <span className="icon">+</span>
            </summary>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// Koncept 10: Boxad med ikon till vänster
export function FaqConcept10({ items = faqItems }) {
  return (
    <div className="faq-concept-10">
      <div className="faq-header">
        <h2>Vanliga frågor</h2>
      </div>
      <div className="faq-list-boxed">
        {items.map((item, i) => (
          <details key={i} className="faq-item-boxed">
            <summary>
              <span className="q-icon">?</span>
              {item.question}
            </summary>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
