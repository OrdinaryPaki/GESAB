import Link from "next/link";
import { ContactBand, Footer, Header } from "../components/PlumblyShell";
import { ArrowIcon, CheckIcon } from "../components/PlumblyIcons";
import { services, testimonials } from "../plumbly-data";

export default function ServicePage() {
  return (
    <>
      <Header dark />
      <section className="service-index-section">
        <div className="container">
          <div className="service-index-title">
            <h1>Our Services</h1>
            <p>We offer a full range of reliable plumbing solutions tailored to meet your residential and commercial needs.</p>
          </div>
          <div className="services-grid white">
            {services.map((service) => (
              <Link href={`/service/${service.slug}`} key={service.slug} className="service-card">
                <img src={service.image} alt="" />
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.body}</p>
                  <span>Read More <ArrowIcon /></span>
                </div>
              </Link>
            ))}
          </div>
          <button className="load-more" type="button">Load More</button>
        </div>
      </section>
      <section className="service-trust-section">
        <div className="container service-trust-grid">
          <div>
            <h2>Complete Plumbing Services You Can Trust</h2>
            <p>Our licensed plumbers handle every job with care, precision, and a commitment to quality</p>
            <Link href="/service/leak-detection-repair" className="button dark">Read More</Link>
          </div>
          <div className="trust-list">
            {["24/7 Emergency Support", "Fast & Reliable Service", "Trusted Experts"].map((item) => (
              <p key={item}><CheckIcon /> {item}</p>
            ))}
          </div>
          <img src="https://framerusercontent.com/images/9R9tsiBykeVoZizc3GBOcvQMKs.jpg?scale-down-to=1024&width=2160&height=2196" alt="" />
        </div>
      </section>
      <section className="service-review-section">
        <div className="container">
          <span>CUSTOMER REVIEWS</span>
          <h2>Stories from Happy Clients</h2>
          <div className="review-grid">
            {testimonials.concat(testimonials, testimonials).slice(0, 6).map((item, index) => (
              <article key={`${item.name}-${index}`}>
                <div className="stars">★★★★★</div>
                <p>{item.quote}</p>
                <strong>{item.name}</strong>
                <small>{index % 2 ? "New York, NY" : "San Diego Ca"}</small>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ContactBand />
      <Footer />
    </>
  );
}
