import { contactInfo } from "../gesab-data";
import { CtaButton } from "./CtaButton";
import "./AppointmentForm.css";

export function AppointmentForm() {
  return (
    <form className="appointment-card" data-appointment-form>
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
        <textarea name="message" placeholder="Beskriv kort vad du vill ha hjälp med." />
      </label>
      <CtaButton variant="yellow">Skicka förfrågan</CtaButton>
    </form>
  );
}
