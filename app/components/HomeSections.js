import Link from "next/link";
import { image, processSteps, services, testimonials } from "../gesab-data";
import { CtaLink } from "./CtaButton";
import { FaqSection } from "./FaqSection";
import { ArrowIcon, CheckIcon } from "./GesabIcons";
import { ContactBand } from "./ContactBand";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { homeImages } from "./home-image-data";
import { TestimonialCarousel } from "./TestimonialCarousel";
import "./HomePage.css";
import "./HomeHero.css";
import "./HomeSupportWhy.css";
import "./HomeServices.css";
import "./HomeAbout.css";
import "./HomeTrustProcess.css";
import "./HomeGalleryFaq.css";

const servicePreviewCopy = {
  badrumsrenovering: "Planering, tätskikt, VVS och plattsättning i rätt ordning.",
  koksrenovering: "Praktisk planering för ytskikt, el, vatten, snickeri och montage.",
  totalentreprenad: "En samlad kontakt när flera moment ska planeras och följas upp.",
  rivningsarbeten: "Kontrollerad rivning inför nästa byggsteg med ordning på avfall.",
};

const aboutStats = [
  { value: "100+", label: "renoveringar över tid" },
  { value: "30%", label: "möjligt ROT-avdrag" },
  { value: "100%", label: "dokumenterat arbete" },
  { value: "6+", label: "samordnade yrkesroller" },
];

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
      <Header hero />
      <Hero />
      <SupportStrip />
      <WhyChoose />
      <ServicesPreview />
      <AboutPreview />
      <TrustNotes />
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
      <img
        alt=""
        className="hero-pattern"
        decoding="async"
        height="1024"
        src={image.heroPattern}
        width="949"
      />
      <img
        alt="Hantverkare arbetar vid en diskho"
        className="hero-photo"
        decoding="async"
        fetchPriority="high"
        height="1024"
        src={image.heroPlumber}
        width="856"
      />
      <div className="container hero-content">
        <div className="rating-line">
          <span className="rating-pill">GESAB</span>
          <span>Göteborgs Entreprenad Service AB</span>
        </div>
        <h1>Badrum och bygg för hela ditt hem</h1>
        <p>Vi samordnar badrum, kök och bygg från första planering till färdigt resultat.</p>
        <CtaLink href="/contact" variant="yellow">
          Be om offert
        </CtaLink>
        <div className="trusted">
          <span>Kostnadsfri första genomgång inför offert.</span>
        </div>
      </div>
    </section>
  );
}

function SupportStrip() {
  const items = [
    ["Badrum som specialitet", "Vi planerar våtrum med rätt ordning, rätt yrkesroller och fokus på fukt, funktion och dokumentation."],
    ["Ett samlat team", "VVS, el, plattsättning, snickeri, målning och montage kan samordnas inom samma projekt."],
    ["Tydlig offert", "Du får en genomgång av omfattning, material, tidplan och vad som påverkar priset innan arbetet startar."],
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
          <img {...homeImages.why[0]} loading="lazy" decoding="async" />
          <img {...homeImages.why[1]} loading="lazy" decoding="async" />
        </div>
        <div className="why-copy">
          <SectionTitle label="Varför GESAB" title="Trygg renovering med rätt team" />
          <p>Vi samordnar badrum, kök och bygg med tydlig planering, rätt yrkesroller och ett resultat som håller över tid.</p>
          <div className="check-list">
            <div>
              <span className="blue-icon small">
                <CheckIcon />
              </span>
              <strong>Rätt yrkesroller på plats</strong>
              <p>Rätt ordning från första planering.</p>
            </div>
            <div>
              <span className="blue-icon small">
                <CheckIcon />
              </span>
              <strong>Tydlig offert och ansvar</strong>
              <p>Tydliga steg innan arbetet börjar.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesPreview({ compact = false }) {
  const homeServices = services.slice(0, 4);

  return (
    <section className={compact ? "services-section compact" : "services-section"}>
      <div className="container">
        <div className="split-title">
          <SectionTitle label="Tjänster" title="Renovering och bygg som håller" />
          <CtaLink href="/service" variant="dark">
            Se alla tjänster
          </CtaLink>
        </div>
        <div className="services-grid">
          {homeServices.map((service) => {
            const serviceImage = homeImages.services[service.slug] ?? { src: service.image, alt: "" };

            return (
              <Link href={`/service/${service.slug}`} key={service.slug} className="service-card">
                <img {...serviceImage} loading="lazy" decoding="async" />
                <div>
                  <h3>{service.title}</h3>
                  <p>{servicePreviewCopy[service.slug] ?? service.body}</p>
                  <span>
                    Läs mer <ArrowIcon />
                  </span>
                </div>
              </Link>
            );
          })}
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
          <SectionTitle label="Om GESAB" title="Trygg renovering med rätt team i Göteborg" />
          <div className="about-row">
            <div className="metric-card">
              <img src={image.aboutPattern} alt="" />
              <strong>100+</strong>
              <span>projekt med tydlig ordning</span>
            </div>
            <div className="about-row-copy">
              <p>GESAB samordnar badrum, kök och bygg med tydlig planering, rätt yrkesroller och ansvar från första genomgång till färdigt resultat.</p>
              <CtaLink href="/about" variant="yellow">
                Läs mer om oss
              </CtaLink>
            </div>
          </div>
        </div>
        <img className="about-photo" {...homeImages.about} loading="lazy" decoding="async" />
      </div>
      <div className="container stat-grid">
        {aboutStats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TrustNotes() {
  return (
    <section className="testimonial-section">
      <div className="container">
        <SectionTitle label="Kundomdömen" title="Tryggt val för renovering i Göteborg" center light />
        <TestimonialCarousel items={testimonials} />
      </div>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section className="process-section">
      <div className="container process-grid">
        <SectionTitle label="Arbetsprocess" title="Renovering i tre tydliga steg" />
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
        <SectionTitle label="Galleri" title="Renoveringar och byggarbeten i urval" center />
        <div className="gallery-grid">
          {homeImages.gallery.map((photo, index) => (
            <img key={`${photo.src}-${index}`} className={index < 2 ? "wide" : ""} {...photo} loading="lazy" decoding="async" />
          ))}
        </div>
      </div>
    </section>
  );
}
