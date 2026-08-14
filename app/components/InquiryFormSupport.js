import "./InquiryFormSupport.css";

export function InquiryHoneypot({ value, onChange }) {
  return (
    <label className="inquiry-honeypot" aria-hidden="true">
      Webbplats
      <input
        type="text"
        name="website"
        value={value}
        onChange={onChange}
        autoComplete="off"
        tabIndex={-1}
      />
    </label>
  );
}

export function InquiryFormError({ visible }) {
  if (!visible) return null;

  return (
    <p className="inquiry-form-error" role="alert">
      Din förfrågan kunde inte skickas. Försök igen eller kontakta oss via telefon.
    </p>
  );
}
