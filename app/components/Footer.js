import Link from "next/link";

import { contactInfo, services } from "../gesab-data";
import { Logo, MailIcon, PhoneIcon } from "./GesabIcons";
import { placeholderImages } from "./placeholder-images";
import "./Footer.css";

const footerBadges = Array.from({ length: 4 }, () => placeholderImages.round);

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
