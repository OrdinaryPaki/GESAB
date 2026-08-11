"use client";

import { useState } from "react";
import { 
  FaqConcept1, FaqConcept2, FaqConcept3, FaqConcept4, FaqConcept5, 
  FaqConcept6, FaqConcept7, FaqConcept8, FaqConcept9, FaqConcept10 
} from "./faq-concepts";
import { Header, Footer } from "../components/GesabShell";
import "./pagination.module.css";

const concepts = [
  { id: 1, name: "Minimalistisk", component: FaqConcept1 },
  { id: 2, name: "Kort-layout", component: FaqConcept2 },
  { id: 3, name: "Delad vy (Split)", component: FaqConcept3 },
  { id: 4, name: "Mörk bakgrund", component: FaqConcept4 },
  { id: 5, name: "Kompakt Grid", component: FaqConcept5 },
  { id: 6, name: "Stor typografi", component: FaqConcept6 },
  { id: 7, name: "Runda hörn (Blå)", component: FaqConcept7 },
  { id: 8, name: "Sido-flikar", component: FaqConcept8 },
  { id: 9, name: "Gul bakgrund", component: FaqConcept9 },
  { id: 10, name: "Boxad med ikon", component: FaqConcept10 },
];

export default function FaqConceptsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const CurrentConcept = concepts[currentIndex].component;

  const nextConcept = () => {
    setCurrentIndex((prev) => (prev + 1) % concepts.length);
  };

  const prevConcept = () => {
    setCurrentIndex((prev) => (prev - 1 + concepts.length) % concepts.length);
  };

  return (
    <>
      <Header dark />
      <main style={{ paddingTop: "120px", minHeight: "80vh", paddingBottom: "100px" }}>
        <div className="container">
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "60px",
            padding: "20px",
            background: "var(--soft)",
            borderRadius: "16px"
          }}>
            <button 
              onClick={prevConcept}
              style={{
                padding: "10px 20px",
                background: "white",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              ← Föregående
            </button>
            
            <div style={{ textAlign: "center" }}>
              <span style={{ display: "block", fontSize: "14px", color: "var(--muted)", marginBottom: "4px" }}>
                Koncept {currentIndex + 1} av {concepts.length}
              </span>
              <h1 style={{ margin: 0, fontSize: "24px" }}>
                {concepts[currentIndex].name}
              </h1>
            </div>

            <button 
              onClick={nextConcept}
              style={{
                padding: "10px 20px",
                background: "var(--blue)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Nästa →
            </button>
          </div>

          {/* Render the current concept */}
          <div style={{ padding: "40px 0" }}>
            <CurrentConcept />
          </div>
          
          {/* Pagination dots */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "8px",
            marginTop: "60px" 
          }}>
            {concepts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  padding: 0,
                  border: "none",
                  background: currentIndex === idx ? "var(--blue)" : "var(--line)",
                  cursor: "pointer",
                  transition: "background 0.2s ease"
                }}
                aria-label={`Gå till koncept ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
