"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo, PhoneIcon } from "../components/GesabIcons";
import styles from "./showcase.module.css";
import { contactInfo } from "../gesab-data";

const navItems = [
  ["Hem", "/"],
  ["Om oss", "/about"],
  ["Tjänster", "/service"],
  ["Blogg", "/blog"],
  ["Kontakt", "/contact"],
];

const variants = [
  { id: 1, name: "Floating Pill (Glas)", desc: "Den nuvarande. Svävande, centrerad med frostat glas. Modern och mjuk." },
  { id: 2, name: "Classic Corporate", desc: "Kant-till-kant, vit med subtil bottenlinje. Tidlös och ren." },
  { id: 3, name: "Centered Split", desc: "Logotypen i mitten, menyer till vänster, knapp till höger. Balanserad och elegant." },
  { id: 4, name: "Dark Mode Sleek", desc: "Mörk bakgrund, vit text. Kontrasterar starkt mot ljusa sidor." },
  { id: 5, name: "Two-Tier", desc: "Kontaktinfo i en smal topplist (gul), navigationen kant-i-kant under. Väldigt konverteringsdrivande." },
  { id: 6, name: "Neubrutalism", desc: "Hårda kanter, skarpa färger och svarta skuggor. Väldigt trendigt i tech/design just nu." },
  { id: 7, name: "GESAB Yellow", desc: "Märkets gula färg som bakgrund. Vågat, glatt och uppmärksamhetskrävande." },
  { id: 8, name: "Compact Left", desc: "Logga och länkar tätt ihop till vänster. Ger ett väldigt funktionellt intryck." },
  { id: 9, name: "Underline Glass", desc: "Större text, tjockare understrykning, kant-till-kant med lätt suddighet." },
  { id: 10, name: "Floating Bar", desc: "Fullbredd men med marginaler, som en mörk svävande linjal med rundade hörn." },
];

export default function NavShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const variant = variants[currentIndex];

  const handleNext = () => setCurrentIndex((c) => (c + 1) % variants.length);
  const handlePrev = () => setCurrentIndex((c) => (c - 1 + variants.length) % variants.length);

  return (
    <div className={styles.showcaseContainer}>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Hide global header for this page */
        .site-header { display: none !important; }
      `}} />

      {/* Render the selected header */}
      <HeaderVariant variantId={variant.id} />

      {/* Content to test scrolling */}
      <div className={styles.dummyContent}>
        <h1>Scrolla ner! 👇</h1>
        <p>Här kan du se hur navigationen känns när du rör dig över innehållet.</p>
        <p><strong>Design {variant.id} av 10:</strong> {variant.name}</p>
        <p>{variant.desc}</p>
        
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ marginTop: '60px' }}>
            <div style={{ background: '#e8e8e8', height: '200px', borderRadius: '12px', marginBottom: '20px' }} />
            <div style={{ background: '#e8e8e8', height: '24px', width: '60%', borderRadius: '4px', marginBottom: '12px' }} />
            <div style={{ background: '#e8e8e8', height: '24px', width: '80%', borderRadius: '4px' }} />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className={styles.controls}>
        <button onClick={handlePrev}>Föregående</button>
        <div className={styles.info}>
          <strong>{variant.name}</strong>
          <span>{variant.id} av 10</span>
        </div>
        <button onClick={handleNext}>Nästa</button>
      </div>
    </div>
  );
}

function HeaderVariant({ variantId }) {
  // Shared nav links
  const Links = () => (
    <nav className={styles.navBase}>
      {navItems.map(([label, href]) => (
        <a key={href} href="#" onClick={(e) => e.preventDefault()}>{label}</a>
      ))}
    </nav>
  );

  const Cta = () => (
    <a href="#" className={styles.btnBase} onClick={(e) => e.preventDefault()}>
      <PhoneIcon /> Ring: {contactInfo.phonePrimary}
    </a>
  );

  const LogoComponent = ({ dark = false }) => (
    <Link href="/" onClick={(e) => e.preventDefault()}>
      <Logo dark={dark} />
    </Link>
  );

  if (variantId === 1) {
    return (
      <header className={`${styles.headerBase} ${styles.v1}`}>
        <div className={styles.innerBase}>
          <div className={styles.left}>
            <LogoComponent dark={true} />
          </div>
          <Links />
          <div className={styles.right}>
            <Cta />
          </div>
        </div>
      </header>
    );
  }

  if (variantId === 2) {
    return (
      <header className={`${styles.headerBase} ${styles.v2}`}>
        <div className={styles.innerBase}>
          <LogoComponent dark={true} />
          <Links />
          <Cta />
        </div>
      </header>
    );
  }

  if (variantId === 3) {
    return (
      <header className={`${styles.headerBase} ${styles.v3}`}>
        <div className={styles.innerBase}>
          <div className={styles.left}>
            <Links />
          </div>
          <div className={styles.center}>
            <LogoComponent dark={true} />
          </div>
          <div className={styles.right}>
            <Cta />
          </div>
        </div>
      </header>
    );
  }

  if (variantId === 4) {
    return (
      <header className={`${styles.headerBase} ${styles.v4}`}>
        <div className={styles.innerBase}>
          <LogoComponent dark={false} />
          <Links />
          <Cta />
        </div>
      </header>
    );
  }

  if (variantId === 5) {
    return (
      <header className={`${styles.headerBase}`}>
        <div className={styles.v5Top}>
          <span>Öppet: 07-16</span>
          <span>info@gesab.se</span>
          <span>{contactInfo.phonePrimary}</span>
        </div>
        <div className={styles.v5Bottom}>
          <div className={styles.innerBase}>
            <LogoComponent dark={true} />
            <Links />
            <Cta />
          </div>
        </div>
      </header>
    );
  }

  if (variantId === 6) {
    return (
      <header className={`${styles.headerBase} ${styles.v6}`}>
        <div className={styles.innerBase}>
          <LogoComponent dark={true} />
          <Links />
          <Cta />
        </div>
      </header>
    );
  }

  if (variantId === 7) {
    return (
      <header className={`${styles.headerBase} ${styles.v7}`}>
        <div className={styles.innerBase}>
          <LogoComponent dark={true} />
          <Links />
          <Cta />
        </div>
      </header>
    );
  }

  if (variantId === 8) {
    return (
      <header className={`${styles.headerBase} ${styles.v8}`}>
        <div className={styles.innerBase}>
          <LogoComponent dark={true} />
          <Links />
          <div className={styles.right}>
            <Cta />
          </div>
        </div>
      </header>
    );
  }

  if (variantId === 9) {
    return (
      <header className={`${styles.headerBase} ${styles.v9}`}>
        <div className={styles.innerBase}>
          <LogoComponent dark={true} />
          <Links />
          <Cta />
        </div>
      </header>
    );
  }

  if (variantId === 10) {
    return (
      <header className={`${styles.headerBase} ${styles.v10}`}>
        <div className={styles.innerBase}>
          <LogoComponent dark={false} />
          <Links />
          <Cta />
        </div>
      </header>
    );
  }

  return null;
}