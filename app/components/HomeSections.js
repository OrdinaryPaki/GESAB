import Link from "next/link";
import { gallery, image, processSteps, services, team, testimonials } from "../plumbly-data";
import { ArrowIcon, CheckIcon } from "./PlumblyIcons";
import { Footer, Header, ContactBand } from "./PlumblyShell";

function SectionTitle({ label, title, center = false, light = false }) {
  return (
    <div className={center ? "section-title center" : "section-title"}>
      <span className={light ? "light" : ""}>{label}</span>
      <h2 className={light ? "light" : ""}>{title}</h2>
    </div>
  );
}

export function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <SupportStrip />
      <WhyChoose />
      <ServicesPreview />
      <AboutPreview />
      <TeamSection />
      <Testimonials />
      <ProcessSection />
      <GallerySection />
      <FaqSection />
      <ContactBand />
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section className="hero">
      <img className="hero-pattern" src={image.heroPattern} alt="" />
      <img className="hero-photo" src={image.heroPlumber} alt="Plumber repairing sink" />
      <div className="container hero-content">
        <div className="rating-line">
          <span className="rating-pill">★ 4.8 Rated</span>
          <span>By Satisfied Customers</span>
        </div>
        <h1>All type of Plumbing Care for your home</h1>
        <p>We provide all types of plumbing care to keep your home safe, comfortable and worry free</p>
        <Link href="/contact" className="button yellow">
          Book a Free Consultation
        </Link>
        <div className="trusted">
          <img src={image.avatars} alt="" />
          <span>10,500+ Individuals who have trusted Plumbly</span>
        </div>
      </div>
    </section>
  );
}

function SupportStrip() {
  const items = [
    ["By Satisfied Customers", "Our team is made up of fully trained and certified professionals who bring years of hands"],
    ["Transparent pricing", "Before we start any work, you’ll know exactly what to expect, so there are never any surprises"],
    ["24/7 Support", "Day or night, you can count on us for quick response, reliable service and peace of mind"],
  ];
  return (
    <section className="support-strip">
      <div className="container support-grid">
        {items.map(([title, body]) => (
          <article key={title} className="support-item">
            <span className="blue-icon">
              <CheckIcon />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function WhyChoose() {
  return (
    <section className="why-section">
      <div className="container why-grid">
        <div className="image-stack">
          <img src={image.chooseOne} alt="Plumber speaking with customer" />
          <img src={image.chooseTwo} alt="Plumber smiling at work" />
        </div>
        <div className="why-copy">
          <SectionTitle label="Why Choose Us" title="Why Choose Our Plumbing Team" />
          <p>We’re not just plumbers—we’re dependable form professionals committed to solving your problems quickly and efficiently</p>
          <div className="check-list">
            <div>
              <span className="blue-icon small">
                <CheckIcon />
              </span>
              <strong>Licensed technicians</strong>
              <p>Expert care from fully licensed technicians</p>
            </div>
            <div>
              <span className="blue-icon small">
                <CheckIcon />
              </span>
              <strong>24/7 Emergency Support</strong>
              <p>Always here to help whenever you need us</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesPreview({ compact = false }) {
  return (
    <section className={compact ? "services-section compact" : "services-section"}>
      <div className="container">
        <div className="split-title">
          <SectionTitle label="Our Services" title="Plumbing Services That Keep Life Flowing" />
          <Link href="/service" className="button dark">
            See All Services
          </Link>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <Link href={`/service/${service.slug}`} key={service.slug} className="service-card">
              <img src={service.image} alt="" />
              <div>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
                <span>
                  Read More <ArrowIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutPreview() {
  return (
    <section className="about-section">
      <div className="container about-grid">
        <div className="about-copy">
          <SectionTitle label="About Us" title="Your Trusted Plumbing Experts in Town" />
          <div className="about-row">
            <div className="metric-card">
              <img src={image.aboutPattern} alt="" />
              <strong>10K+</strong>
              <span>Homes Served with Care</span>
            </div>
            <div>
              <p>From quick fixes to major repairs, our skilled professionals are committed to delivering to reliable service with and personal touch</p>
              <Link href="/about" className="button yellow">
                More About Us
              </Link>
            </div>
          </div>
        </div>
        <img className="about-photo" src={image.aboutPlumber} alt="Plumber repairing bathroom sink" />
      </div>
      <div className="container stat-grid">
        <div>
          <strong>95%</strong>
          <span>First time fix rate</span>
        </div>
        <div>
          <strong>500+</strong>
          <span>Emergency Calls Handled</span>
        </div>
        <div>
          <strong>24/7</strong>
          <span>Support You Can Count On</span>
        </div>
        <div>
          <strong>99%</strong>
          <span>Customer Satisfaction</span>
        </div>
      </div>
    </section>
  );
}

export function TeamSection() {
  return (
    <section className="team-section">
      <div className="container">
        <SectionTitle label="Team Members" title="Our Hard working Members" center />
        <div className="team-grid">
          {team.map((member) => (
            <article key={member.name} className="team-card">
              <img src={member.image} alt="" />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="testimonial-section">
      <div className="container">
        <SectionTitle label="Testimonials" title="Trusted by 10,000+ Customers" center light />
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article key={item.name} className="testimonial-card">
              <div className="person">
                <img src={item.image} alt="" />
                <div>
                  <h3>{item.name}</h3>
                  <span>{item.place}</span>
                </div>
              </div>
              <p>"{item.quote}</p>
              <div className="stars">★★★★★</div>
            </article>
          ))}
        </div>
        <div className="dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section className="process-section">
      <div className="container process-grid">
        <SectionTitle label="Work Process" title="Fixing Your Plumbing the Simple Way" />
        <div className="process-list">
          {processSteps.map((step) => (
            <article key={step.number} className="process-card">
              <strong>{step.number}</strong>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  return (
    <section className="gallery-section">
      <div className="container">
        <SectionTitle label="Project Gallery" title="Gallery of Trusted Repairs & Installations" center />
        <div className="gallery-grid">
          {gallery.map((src, index) => (
            <img key={src} className={index < 2 ? "wide" : ""} src={src} alt="" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section className="faq-section">
      <div className="container faq-grid">
        <div>
          <SectionTitle label="FAQ" title="Frequently Asked Questions" />
          <div className="still">
            <h3>Still have Questions?</h3>
            <p>Can’t find the answer you’re looking for? Please contact with our customer service</p>
            <Link href="/contact">
              Contact Us <ArrowIcon />
            </Link>
          </div>
        </div>
        <div className="faq-list">
          <details open>
            <summary>What plumbing services do you offer?</summary>
            <p>We offer a full range of services including leak detection pipe repairs, drain cleaning, water heater installation faucet/toilet repairs, emergency plumbing</p>
          </details>
          <details>
            <summary>Are your plumbers licensed and insured?</summary>
          </details>
          <details>
            <summary>Do you offer 24/7 Services?</summary>
          </details>
          <details>
            <summary>How much do your services cost?</summary>
          </details>
        </div>
      </div>
    </section>
  );
}
