import { ContactBand, Footer, Header } from "../components/PlumblyShell";
import { MailIcon, PhoneIcon } from "../components/PlumblyIcons";
import { FaqSection } from "../components/HomeSections";

export default function ContactPage() {
  return (
    <>
      <Header dark />
      <section className="contact-hero-section">
        <div className="contact-hero-inner">
          <h1>Lat’s talk, we’re here</h1>
          <p>We’re here to help, so contact us with any questions or feedback</p>
          <form className="contact-main-form">
            <label>
              First Name*
              <input placeholder="Jane" />
            </label>
            <label>
              Last Name*
              <input placeholder="Copper" />
            </label>
            <label className="wide">
              Email*
              <input placeholder="plumbly@gmail.com" type="email" />
            </label>
            <label className="wide">
              Services*
              <select defaultValue="">
                <option value="" disabled>
                  Select...
                </option>
                <option>AC Services</option>
                <option>Freeze Services</option>
              </select>
            </label>
            <label className="wide">
              Message*
              <textarea placeholder="Write message" />
            </label>
            <button className="wide" type="button">Send message</button>
          </form>
        </div>
      </section>
      <section className="contact-info-section">
        <div className="container">
          <div className="section-title center">
            <h2>Let’s Get In Touch</h2>
            <p>Have questions or ready to start a conversation? We’d love to hear from you</p>
          </div>
          <div className="contact-card-row">
            <article>
              <span><PhoneIcon /></span>
              <h3>Phone</h3>
              <p>+1 480 555-0103</p>
              <p>+1 704 555-0127</p>
            </article>
            <article>
              <span><MailIcon /></span>
              <h3>Email</h3>
              <p>plumbly@gmai.com</p>
              <p>support@mail.com</p>
            </article>
            <article>
              <span>⌖</span>
              <h3>Address</h3>
              <p>2972 Westheimer Rd. Santa Ana, Illinois 85486</p>
            </article>
          </div>
        </div>
      </section>
      <FaqSection />
      <ContactBand />
      <Footer />
    </>
  );
}
