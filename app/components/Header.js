import Link from "next/link";

import { contactInfo } from "../gesab-data";
import { CtaAnchor } from "./CtaButton";
import { Logo, PhoneIcon } from "./GesabIcons";
import "./Header.css";

const navItems = [
  ["Hem", "/"],
  ["Om oss", "/about"],
  ["Tjänster", "/service"],
  ["Kontakt", "/contact"],
];

export function Header({ dark = false, hero = false }) {
  const className = [dark ? "site-header dark" : "site-header", hero ? "hero-header" : ""]
    .filter(Boolean)
    .join(" ");

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
          <details className="mobile-menu" data-mobile-menu>
            <summary
              className="mobile-menu-button"
              data-mobile-menu-button
              aria-label="Öppna meny"
            >
              <span />
              <span />
            </summary>
            <div className="mobile-menu-panel" data-mobile-menu-panel>
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
