"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowIcon } from "../components/GesabIcons";
import styles from "./ServiceConcepts.module.css";

export function ServiceConcepts({ services }) {
  const [activeConcept, setActiveConcept] = useState(1);

  return (
    <div className={styles.conceptsWrapper}>
      <div className={styles.pagination}>
        <span className={styles.paginationLabel}>Välj designkoncept:</span>
        <div className={styles.paginationButtons}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              onClick={() => setActiveConcept(num)}
              className={`${styles.pageButton} ${activeConcept === num ? styles.active : ""}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.conceptContainer}>
        {activeConcept === 1 && <Concept1 services={services} />}
        {activeConcept === 2 && <Concept2 services={services} />}
        {activeConcept === 3 && <Concept3 services={services} />}
        {activeConcept === 4 && <Concept4 services={services} />}
        {activeConcept === 5 && <Concept5 services={services} />}
        {activeConcept === 6 && <Concept6 services={services} />}
        {activeConcept === 7 && <Concept7 services={services} />}
        {activeConcept === 8 && <Concept8 services={services} />}
        {activeConcept === 9 && <Concept9 services={services} />}
        {activeConcept === 10 && <Concept10 services={services} />}
      </div>
    </div>
  );
}

// 1. Classic Grid (Current layout)
function Concept1({ services }) {
  return (
    <div className={styles.concept1}>
      {services.map((service) => (
        <Link href={`/service/${service.slug}`} key={service.slug} className={styles.c1Card}>
          <img src={service.image} alt="" />
          <div className={styles.c1Content}>
            <h3>{service.title}</h3>
            <p>{service.body}</p>
            <span className={styles.readMore}>
              Läs mer <ArrowIcon />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// 2. Masonry / Staggered Cards
function Concept2({ services }) {
  return (
    <div className={styles.concept2}>
      {services.map((service, i) => (
        <Link 
          href={`/service/${service.slug}`} 
          key={service.slug} 
          className={styles.c2Card}
          style={{ marginTop: i % 2 !== 0 ? '40px' : '0' }}
        >
          <div className={styles.c2ImageWrapper}>
            <img src={service.image} alt="" />
          </div>
          <div className={styles.c2Content}>
            <h3>{service.title}</h3>
            <p>{service.body}</p>
            <span className={styles.readMore}>
              Läs mer <ArrowIcon />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// 3. List View
function Concept3({ services }) {
  return (
    <div className={styles.concept3}>
      {services.map((service) => (
        <Link href={`/service/${service.slug}`} key={service.slug} className={styles.c3Card}>
          <img src={service.image} alt="" />
          <div className={styles.c3Content}>
            <h3>{service.title}</h3>
            <p>{service.body}</p>
          </div>
          <div className={styles.c3Action}>
            <span className={styles.c3Button}>Läs mer</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// 4. Large Hero Cards
function Concept4({ services }) {
  return (
    <div className={styles.concept4}>
      {services.map((service) => (
        <Link href={`/service/${service.slug}`} key={service.slug} className={styles.c4Card}>
          <img src={service.image} alt="" />
          <div className={styles.c4Overlay}>
            <div className={styles.c4Content}>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
              <span className={styles.readMore}>
                Läs mer <ArrowIcon />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// 5. Minimalist Text-focused
function Concept5({ services }) {
  return (
    <div className={styles.concept5}>
      {services.map((service, i) => (
        <Link href={`/service/${service.slug}`} key={service.slug} className={styles.c5Card}>
          <div className={styles.c5Number}>0{i + 1}</div>
          <div className={styles.c5Content}>
            <h3>{service.title}</h3>
            <p>{service.body}</p>
          </div>
          <div className={styles.c5Arrow}>
            <ArrowIcon />
          </div>
        </Link>
      ))}
    </div>
  );
}

// 6. Accordion/Expandable
function Concept6({ services }) {
  const [expanded, setExpanded] = useState(services[0].slug);

  return (
    <div className={styles.concept6}>
      {services.map((service) => (
        <div 
          key={service.slug} 
          className={`${styles.c6Card} ${expanded === service.slug ? styles.c6Expanded : ""}`}
        >
          <button 
            className={styles.c6Header} 
            onClick={() => setExpanded(expanded === service.slug ? null : service.slug)}
          >
            <h3>{service.title}</h3>
            <span className={styles.c6Toggle}>{expanded === service.slug ? "−" : "+"}</span>
          </button>
          <div className={styles.c6BodyWrapper}>
            <div className={styles.c6Body}>
              <div className={styles.c6BodyContent}>
                <p>{service.body}</p>
                <Link href={`/service/${service.slug}`} className={styles.c6Link}>
                  Läs mer om {service.title.toLowerCase()} <ArrowIcon />
                </Link>
              </div>
              <img src={service.image} alt="" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 7. Carousel/Slider
function Concept7({ services }) {
  return (
    <div className={styles.concept7}>
      <div className={styles.c7Track}>
        {services.map((service) => (
          <Link href={`/service/${service.slug}`} key={service.slug} className={styles.c7Card}>
            <img src={service.image} alt="" />
            <div className={styles.c7Content}>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
              <span className={styles.readMore}>
                Läs mer <ArrowIcon />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// 8. Asymmetrical/Editorial
function Concept8({ services }) {
  return (
    <div className={styles.concept8}>
      {services.map((service, i) => (
        <div key={service.slug} className={`${styles.c8Row} ${i % 2 !== 0 ? styles.c8Reverse : ""}`}>
          <div className={styles.c8Image}>
            <img src={service.image} alt="" />
          </div>
          <div className={styles.c8Content}>
            <h3>{service.title}</h3>
            <p>{service.body}</p>
            <Link href={`/service/${service.slug}`} className={styles.c8Button}>
              Läs mer
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

// 9. Grid with Icons (using small circular images as a stand-in for icons)
function Concept9({ services }) {
  return (
    <div className={styles.concept9}>
      {services.map((service) => (
        <Link href={`/service/${service.slug}`} key={service.slug} className={styles.c9Card}>
          <div className={styles.c9Icon}>
            <img src={service.image} alt="" />
          </div>
          <h3>{service.title}</h3>
          <p>{service.body}</p>
          <span className={styles.readMore}>
            Läs mer <ArrowIcon />
          </span>
        </Link>
      ))}
    </div>
  );
}

// 10. Interactive Hover Cards
function Concept10({ services }) {
  return (
    <div className={styles.concept10}>
      {services.map((service) => (
        <Link href={`/service/${service.slug}`} key={service.slug} className={styles.c10Card}>
          <img src={service.image} alt="" className={styles.c10Image} />
          <div className={styles.c10Overlay}></div>
          <div className={styles.c10Content}>
            <h3>{service.title}</h3>
            <div className={styles.c10Hidden}>
              <p>{service.body}</p>
              <span className={styles.c10Button}>Läs mer</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
