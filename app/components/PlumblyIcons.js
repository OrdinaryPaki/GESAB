export function Logo({ dark = false }) {
  return (
    <span className="logo" aria-label="Plumbly">
      <span className="logo-mark">⌁</span>
      <span className={dark ? "logo-text dark" : "logo-text"}>Plumbly</span>
    </span>
  );
}

export function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.2 4.6 9.5 4l1.8 4.3-1.5 1.1c.8 1.7 2.2 3.1 3.9 3.9l1.1-1.5 4.3 1.8-.6 2.3c-.3 1.1-1.3 1.8-2.4 1.7C10.3 17.2 5 11.9 4.5 6.1c-.1-1.1.6-2.1 1.7-2.4Z" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 7.2 10.2 17 5 11.8l1.9-1.9 3.3 3.3 7.9-7.9z" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.2 5.4 19.8 12l-6.6 6.6-1.7-1.7 3.6-3.7H4v-2.4h11.1l-3.6-3.7z" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16v12H4zm2.2 2 5.8 4.4L17.8 8zm11.8 8v-5.4l-6 4.5-6-4.5V16z" />
    </svg>
  );
}
