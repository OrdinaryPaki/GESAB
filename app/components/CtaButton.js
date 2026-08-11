import Link from "next/link";

import "./CtaButton.css";

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

function ctaClassName(variant, className) {
  return classNames("cta-button", `cta-button-${variant}`, className);
}

export function CtaLink({ href, variant = "blue", className, children, ...props }) {
  return (
    <Link href={href} className={ctaClassName(variant, className)} {...props}>
      {children}
    </Link>
  );
}

export function CtaAnchor({ href, variant = "blue", className, children, ...props }) {
  return (
    <a href={href} className={ctaClassName(variant, className)} {...props}>
      {children}
    </a>
  );
}

export function CtaButton({ type = "button", variant = "blue", className, children, ...props }) {
  return (
    <button type={type} className={ctaClassName(variant, className)} {...props}>
      {children}
    </button>
  );
}
