import { CtaButton } from "../../components/CtaButton";
import { ServiceSelect } from "../../components/ServiceSelect";
import { contactInfo, serviceSelectOptions } from "../../gesab-data";

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
      <ServiceSelect defaultValue={defaultServiceSlug} options={serviceSelectOptions} />
      <CtaButton variant="yellow">Skicka förfrågan</CtaButton>
    </form>
  );
}
