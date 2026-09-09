import Link from "next/link";

import { contactInfo, services } from "../gesab-data";
import { siteConfig } from "../site-config";
import { Logo, MailIcon, PhoneIcon } from "./GesabIcons";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo dark />
          <p>
            Badrumsrenovering, köksrenovering och entreprenadarbeten i Göteborg med fokus på
            tydlig planering och fackmässigt utförande.
          </p>
          <div className="socials" aria-label="Snabba kontaktvägar">
            <a href={contactInfo.phonePrimaryHref} aria-label={`Ring ${siteConfig.shortName}`}>
              <PhoneIcon />
            </a>
            <a href={contactInfo.emailHref} aria-label={`Mejla ${siteConfig.shortName}`}>
              <MailIcon />
            </a>
          </div>
        </div>
        <div className="footer-list footer-services">
          <span>Tjänster</span>
          {services.map((service) => (
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
          <Link href="/galleri">Galleri</Link>
          <Link href="/contact">Kontakt</Link>
          <Link href="/cookies">Integritet och cookies</Link>
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
          Copyright © {new Date().getFullYear()} {siteConfig.shortName}. Alla rättigheter förbehålls.
          <p className="footer-credit">
            Utvecklad och drivs av <a href="https://modernasidor.se">Moderna Sidor AB</a>
          </p>
        </div>
        <Link className="footer-area" href="/contact">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <span><strong>Göteborg med omnejd</strong><span>Fråga om ditt område →</span></span>
        </Link>
      </div>
    </footer>
  );
}
