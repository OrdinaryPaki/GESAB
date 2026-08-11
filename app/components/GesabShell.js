import Link from "next/link";
import { contactInfo, image, services } from "../gesab-data";
import { CtaAnchor, CtaButton } from "./CtaButton";
import { Logo, MailIcon, PhoneIcon } from "./GesabIcons";
import { placeholderImages } from "./placeholder-images";

const navItems = [
  ["Hem", "/"],
  ["Om oss", "/about"],
  ["Tjänster", "/service"],
  ["Blogg", "/blog"],
  ["Kontakt", "/contact"],
];

const footerBadges = Array.from({ length: 4 }, () => placeholderImages.round);

export function Header({ dark = false, hero = false }) {
  const className = [dark ? "site-header dark" : "site-header", hero ? "hero-header" : ""].filter(Boolean).join(" ");

  return (
    <header className={className}>
      <div className="container header-inner">
        <div className="header-left">
          <Link href="/" className="logo-link">
            <Logo dark />
          </Link>
        </div>
        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-right">
          <details className="mobile-menu">
            <summary className="mobile-menu-button" aria-label="Öppna meny">
              <span />
              <span />
            </summary>
            <div className="mobile-menu-panel">
              {navItems.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
              <CtaAnchor className="mobile-phone-link" href={contactInfo.phonePrimaryHref}>
                <PhoneIcon />
                <span>Ring: {contactInfo.phonePrimary}</span>
              </CtaAnchor>
            </div>
          </details>
          <CtaAnchor className="phone-button" href={contactInfo.phonePrimaryHref}>
            <PhoneIcon />
            <span>Ring: {contactInfo.phonePrimary}</span>
          </CtaAnchor>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo dark />
          <p>Badrumsrenovering, köksrenovering och entreprenadarbeten i Göteborg med fokus på tydlig planering och fackmässigt utförande.</p>
          <div className="socials" aria-label="Snabba kontaktvägar">
            <a href={contactInfo.phonePrimaryHref} aria-label="Ring GESAB">
              <PhoneIcon />
            </a>
            <a href={contactInfo.emailHref} aria-label="Mejla GESAB">
              <MailIcon />
            </a>
          </div>
        </div>
        <div className="footer-list footer-services">
          <span>Tjänster</span>
          {services.slice(0, 4).map((service) => (
            <Link key={service.slug} href={`/service/${service.slug}`}>
              {service.title}
            </Link>
          ))}
        </div>
        <div className="footer-list footer-pages">
          <span>Sidor</span>
          <Link href="/">Hem</Link>
          <Link href="/about">Om oss</Link>
          <Link href="/service">Tjänster</Link>
          <Link href="/blog">Blogg</Link>
          <Link href="/contact">Kontakt</Link>
        </div>
        <div className="footer-list footer-contact">
          <span>Kontakt</span>
          <a href={contactInfo.phonePrimaryHref}>{contactInfo.phonePrimary}</a>
          <a href={contactInfo.emailHref}>{contactInfo.email}</a>
          <p>{contactInfo.addressLine}</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <div className="footer-bottom-left">
          Copyright © {new Date().getFullYear()} GESAB. Alla rättigheter förbehålls.
        </div>
        <div className="badge-grid" aria-label="GESAB bilder">
          {footerBadges.map((src, index) => (
            <img key={`${src}-${index}`} src={src} alt="" />
          ))}
        </div>
      </div>
    </footer>
  );
}

export function ContactBand() {
  return (
    <section className="contact-band">
      <img className="contact-band-bg" src={image.ctaBg} alt="" />
      <div className="contact-band-overlay" />
      <div className="container contact-band-inner">
        <div className="contact-copy">
          <span>VI ÄR REDO ATT HJÄLPA DIG</span>
          <h2>Låt oss prata</h2>
          <div className="contact-methods">
            <a href={contactInfo.phonePrimaryHref}>
              <PhoneIcon /> {contactInfo.phonePrimary}
            </a>
            <a href={contactInfo.phoneSecondaryHref}>
              <PhoneIcon /> {contactInfo.phoneSecondary}
            </a>
            <a href={contactInfo.emailHref}>
              <MailIcon /> {contactInfo.email}
            </a>
            <a href="/contact">
              <MailIcon /> Skicka förfrågan
            </a>
          </div>
        </div>
        <AppointmentForm />
      </div>
    </section>
  );
}

export function AppointmentForm() {
  return (
    <form className="appointment-card">
      <h2>Boka offert</h2>
      <label>
        Namn
        <input type="text" placeholder="För- och efternamn" />
      </label>
      <label>
        E-post
        <input type="email" placeholder={contactInfo.email} />
      </label>
      <label>
        Telefon
        <input type="tel" placeholder="0700 00 00 00" />
      </label>
      <label>
        Meddelande
        <textarea
          name="message"
          placeholder="Beskriv kort vad du vill ha hjälp med."
        />
      </label>
      <CtaButton variant="yellow">Skicka förfrågan</CtaButton>
    </form>
  );
}
