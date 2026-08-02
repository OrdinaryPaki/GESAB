import { CtaButton } from "../../components/CtaButton";
import { contactInfo, services } from "../../gesab-data";

export function ServiceQuoteForm({ defaultServiceSlug, description, heading }) {
  return (
    <form className="appointment-card">
      <h2>{heading}</h2>
      <p className="appointment-card-intro">{description}</p>
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
        Tjänst
        <select defaultValue={defaultServiceSlug}>
          <option value="" disabled>
            Välj tjänst
          </option>
          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.title}
            </option>
          ))}
        </select>
      </label>
      <CtaButton variant="yellow">Skicka förfrågan</CtaButton>
    </form>
  );
}
