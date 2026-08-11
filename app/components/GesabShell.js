import Link from "next/link";
import { contactInfo, image, services } from "../gesab-data";
import { CtaAnchor, CtaButton } from "./CtaButton";
import { Logo, MailIcon, PhoneIcon } from "./GesabIcons";

const navItems = [
  ["Hem", "/"],
  ["Om oss", "/about"],
  ["Tjänster", "/service"],
  ["Kontakt", "/contact"],
];

export function Header({ dark = false, hero = false }) {
  const className = [dark ? "site-header dark" : "site-header", hero ? "hero-header" : ""].filter(Boolean).join(" ");

  return (
    <header className={className}>
      <div className="container header-inner">
        <Link href="/" className="logo-link">
          <Logo dark={dark} />
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
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
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <nav className="footer-list footer-pages" aria-label="Snabbmeny">
          <span>Snabbmeny</span>
          {navItems.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="footer-list footer-services">
          <span>Tjänster</span>
          {services.slice(0, 4).map((service) => (
            <Link key={service.slug} href={`/service/${service.slug}`}>
              {service.title}
            </Link>
          ))}
        </div>
        <div className="footer-list footer-services-more">
          <span>Fler tjänster</span>
          {services.slice(4).map((service) => (
            <Link key={service.slug} href={`/service/${service.slug}`}>
              {service.title}
            </Link>
          ))}
        </div>
        <address className="footer-list footer-contact">
          <span>Kontakta GESAB</span>
          <a href={contactInfo.phonePrimaryHref}>
            <PhoneIcon />
            {contactInfo.phonePrimary}
          </a>
          <a href={contactInfo.phoneSecondaryHref}>
            <PhoneIcon />
            {contactInfo.phoneSecondary}
          </a>
          <a href={contactInfo.emailHref}>
            <MailIcon />
            {contactInfo.email}
          </a>
          <p>{contactInfo.addressLine}</p>
        </address>
      </div>
      <div className="container footer-bottom">
        <Link href="/" className="footer-bottom-brand" aria-label="GESAB – till startsidan">
          <Logo dark />
        </Link>
        <div className="footer-bottom-meta">
          <div className="socials" aria-label="Snabba kontaktvägar">
            <a href={contactInfo.phonePrimaryHref} aria-label="Ring GESAB">
              <PhoneIcon />
            </a>
            <a href={contactInfo.emailHref} aria-label="Mejla GESAB">
              <MailIcon />
            </a>
          </div>
          <p>Copyright © GESAB. Alla rättigheter förbehålls.</p>
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

export function PageFrame({ children, headerDark = false }) {
  return (
    <>
      <Header dark={headerDark} />
      {children}
      <ContactBand />
      <Footer />
    </>
  );
}

export function InnerHero({ label, title }) {
  return (
    <section className="inner-hero">
      <div className="container inner-hero-content">
        <span>{label}</span>
        <h1>{title}</h1>
      </div>
    </section>
  );
}
