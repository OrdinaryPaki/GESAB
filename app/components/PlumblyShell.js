import Link from "next/link";
import { image, services } from "../plumbly-data";
import { Logo, MailIcon, PhoneIcon } from "./PlumblyIcons";

export function Header({ dark = false }) {
  return (
    <header className={dark ? "site-header dark" : "site-header"}>
      <div className="container header-inner">
        <Link href="/" className="logo-link">
          <Logo dark={dark} />
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/">Pages⌄</Link>
          <Link href="/about">About</Link>
          <Link href="/service">Services</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <button className="mobile-menu-button" type="button" aria-label="Open menu">
          <span />
          <span />
        </button>
        <a className="phone-button" href="tel:+14065550120">
          <PhoneIcon />
          <span>Call Us: +1 406 555 0120</span>
        </a>
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
          <p>We offer fast, reliable, and affordable solutions to keep your home running smoothly</p>
          <div className="socials" aria-label="Social links">
            <a href="https://www.facebook.com/">f</a>
            <a href="https://www.linkedin.com/">in</a>
            <a href="https://www.instagram.com/">◎</a>
            <a href="https://telegram.org/">↗</a>
          </div>
        </div>
        <div className="footer-list">
          <span>Service</span>
          {services.map((service) => (
            <Link key={service.slug} href={`/service/${service.slug}`}>
              {service.title}
            </Link>
          ))}
        </div>
        <div className="footer-list">
          <span>Help</span>
          <Link href="/terms-privacy/privacy-policy">Privacy policy</Link>
          <Link href="/terms-privacy/terms-conditions">Terms conditions</Link>
          <Link href="/404">404</Link>
        </div>
        <div className="badge-grid" aria-label="Certification badges">
          {image.badges.map((badge) => (
            <img key={badge} src={badge} alt="" />
          ))}
        </div>
      </div>
      <div className="container footer-bottom">Copyright & design by ©Mezario 2025 plumbly, Inc. All rights reserved</div>
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
          <span>WE ARE READY TO HELP YOU</span>
          <h2>Let’s discuss</h2>
          <div className="contact-methods">
            <a href="tel:+14065550120">
              <PhoneIcon /> +1 406 555 0120
            </a>
            <a href="mailto:admin@plumbly.com">
              <MailIcon /> admin@plumbly.com
            </a>
            <a href="mailto:plumbly@gmail.com">
              <MailIcon /> plumbly@gmail.com
            </a>
            <a href="tel:+14065550121">
              <PhoneIcon /> +1 406 555 0121
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
      <h2>Book Your Service</h2>
      <label>
        Full Name
        <input type="text" placeholder="Robert Downe" />
      </label>
      <label>
        Email
        <input type="email" placeholder="plumbly@gmail.com" />
      </label>
      <label>
        Phone
        <input type="tel" placeholder="xxx-xxx-xxx" />
      </label>
      <label>
        Service
        <select defaultValue="">
          <option value="" disabled>
            Select...
          </option>
          {services.map((service) => (
            <option key={service.slug}>{service.title}</option>
          ))}
        </select>
      </label>
      <button type="button">Make An Appointment</button>
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
