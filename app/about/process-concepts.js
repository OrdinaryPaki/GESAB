"use client";

import { useState } from "react";
import styles from "./process-concepts.module.css";
import { ArrowIcon } from "../components/GesabIcons";

const steps = [
  { num: "01", title: "Första kontakt", body: "Vi lyssnar in dina idéer och behov. Tillsammans går vi igenom vad som behöver göras." },
  { num: "02", title: "Platsbesök", body: "Vi bedömer befintligt skick, mäter och identifierar eventuella tekniska utmaningar." },
  { num: "03", title: "Offert & Plan", body: "Du får en detaljerad offert där arbetsmoment, material och tidplan framgår tydligt." },
  { num: "04", title: "Utförande", body: "Våra hantverkare arbetar i rätt ordning. Vi projektleder hela processen åt dig." },
  { num: "05", title: "Överlämning", body: "Gemensam genomgång. Du får all dokumentation och kvalitetsbevis för våtrum." }
];

export function ProcessConcepts() {
  const [concept, setConcept] = useState(1);

  return (
    <section className={styles.wrapper}>
      <div className="container">
        
        {/* Pagination UI specifically for switching concepts */}
        <div className={styles.paginationHeader}>
          <div className="section-title center">
            <span>Vår arbetsprocess</span>
            <h2>Vägen till ett färdigt resultat</h2>
          </div>
          
          <div className={styles.paginationControls}>
            <button 
              className={`${styles.arrowBtn} ${styles.prev}`} 
              onClick={() => setConcept(c => Math.max(1, c-1))} 
              disabled={concept === 1}
              aria-label="Föregående koncept"
            >
              <ArrowIcon/>
            </button>
            
            <div className={styles.dots}>
              {[1,2,3,4,5,6,7,8,9,10].map(i => (
                <button 
                  key={i} 
                  className={`${styles.dot} ${concept === i ? styles.activeDot : ''}`} 
                  onClick={() => setConcept(i)}
                  aria-label={`Visa koncept ${i}`}
                >
                  {i}
                </button>
              ))}
            </div>
            
            <button 
              className={styles.arrowBtn} 
              onClick={() => setConcept(c => Math.min(10, c+1))} 
              disabled={concept === 10}
              aria-label="Nästa koncept"
            >
              <ArrowIcon/>
            </button>
          </div>
          <p className={styles.conceptLabel}>Visar designkoncept {concept} av 10</p>
        </div>

        {/* Render the selected concept */}
        <div className={styles.conceptContainer}>
          {concept === 1 && <Concept1 />}
          {concept === 2 && <Concept2 />}
          {concept === 3 && <Concept3 />}
          {concept === 4 && <Concept4 />}
          {concept === 5 && <Concept5 />}
          {concept === 6 && <Concept6 />}
          {concept === 7 && <Concept7 />}
          {concept === 8 && <Concept8 />}
          {concept === 9 && <Concept9 />}
          {concept === 10 && <Concept10 />}
        </div>

      </div>
    </section>
  );
}

function Concept1() {
  return (
    <div className={styles.c1List}>
      {steps.map(step => (
        <article key={step.num} className={styles.c1Card}>
          <div className={styles.c1Num}>{step.num}</div>
          <div>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function Concept2() {
  return (
    <div className={styles.c2Grid}>
      {steps.map(step => (
        <article key={step.num} className={styles.c2Card}>
          <span className={styles.c2Num}>{step.num}</span>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </article>
      ))}
    </div>
  );
}

function Concept3() {
  return (
    <div className={styles.c3Timeline}>
      {steps.map(step => (
        <article key={step.num} className={styles.c3Item}>
          <div className={styles.c3Dot} />
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </article>
      ))}
    </div>
  );
}

function Concept4() {
  return (
    <div className={styles.c4List}>
      {steps.map(step => (
        <article key={step.num} className={styles.c4Item}>
          <div className={styles.c4NumBox}>{step.num}</div>
          <div className={styles.c4Content}>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function Concept5() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div>
      <div className={styles.c5Tabs}>
        {steps.map((step, idx) => (
          <button 
            key={step.num} 
            className={`${styles.c5Tab} ${activeTab === idx ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {step.num}. {step.title}
          </button>
        ))}
      </div>
      <div className={styles.c5Content}>
        <h3>{steps[activeTab].title}</h3>
        <p>{steps[activeTab].body}</p>
      </div>
    </div>
  );
}

function Concept6() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className={styles.c6List}>
      {steps.map((step, idx) => (
        <article key={step.num} className={styles.c6Item}>
          <div className={styles.c6Header} onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}>
            <div><span>{step.num}</span> {step.title}</div>
            <div>{openIdx === idx ? '−' : '+'}</div>
          </div>
          {openIdx === idx && (
            <div className={styles.c6Body}>
              {step.body}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function Concept7() {
  return (
    <div className={styles.c7Scroll}>
      {steps.map(step => (
        <article key={step.num} className={styles.c7Card}>
          <span className={styles.c1Num} style={{display: 'block', marginBottom: '16px'}}>{step.num}</span>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </article>
      ))}
    </div>
  );
}

function Concept8() {
  return (
    <div className={styles.c8Wrapper}>
      <div className={styles.c8Grid}>
        {steps.map(step => (
          <article key={step.num} className={styles.c8Card}>
            <span className={styles.c8Num}>{step.num}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function Concept9() {
  return (
    <div className={styles.c9Grid}>
      {steps.map(step => (
        <article key={step.num} className={styles.c9Card}>
          <div className={styles.c9NumBg}>{step.num}</div>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </article>
      ))}
    </div>
  );
}

function Concept10() {
  return (
    <div className={styles.c10List}>
      {steps.map(step => (
        <article key={step.num} className={styles.c10Item}>
          <div className={styles.c10Num}>{step.num}</div>
          <div className={styles.c10Content}>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}