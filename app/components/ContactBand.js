import { contactInfo, image } from "../gesab-data";
import { AppointmentForm } from "./AppointmentForm";
import { MailIcon, PhoneIcon } from "./GesabIcons";
import "./ContactBand.css";

export function ContactBand() {
  return (
    <section className="contact-band" data-contact-band>
      <img className="contact-band-bg" src={image.ctaBg} alt="" />
      <div className="contact-band-overlay" />
      <div className="container contact-band-inner">
        <div className="contact-copy">
          <span>VI ÄR REDO ATT HJÄLPA DIG</span>
          <h2>Låt oss prata</h2>
          <div className="contact-methods">
            <a href={contactInfo.phonePrimaryHref}>
              <PhoneIcon /> {contactInfo.phonePrimary}
            </a>
            <a href={contactInfo.phoneSecondaryHref}>
              <PhoneIcon /> {contactInfo.phoneSecondary}
            </a>
            <a href={contactInfo.emailHref}>
              <MailIcon /> {contactInfo.email}
            </a>
            <a href="/contact">
              <MailIcon /> Skicka förfrågan
            </a>
          </div>
        </div>
        <AppointmentForm />
      </div>
    </section>
  );
}
