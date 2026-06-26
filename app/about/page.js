import { ProcessSection, TeamSection, Testimonials } from "../components/HomeSections";
import { ContactBand, Footer, Header } from "../components/PlumblyShell";
import { gallery } from "../plumbly-data";

export default function AboutPage() {
  return (
    <>
      <Header dark />
      <section className="about-story-section">
        <div className="container about-story-grid">
          <div>
            <h1>Our Story</h1>
            <p>What started as a small, family-run plumbing service has grown into a trusted name in the community</p>
            <blockquote>“Our goal has always been simple — to provide honest, dependable plumbing services that people can trust</blockquote>
            <strong>Jacob Jones</strong>
            <span>CEO at Plumbly</span>
          </div>
          <div className="about-collage">
            <img src={gallery[0]} alt="" />
            <img src={gallery[1]} alt="" />
            <img src={gallery[2]} alt="" />
            <img src="https://framerusercontent.com/images/HCfKCgyvxfEFHbm0ViUBM4r7css.jpg?scale-down-to=512&width=788&height=768" alt="" />
          </div>
        </div>
      </section>
      <section className="mission-section">
        <div className="container">
          <h2>Delivering Trust, Quality Plumbing Solutions</h2>
          <p>Our mission is to provide top-notch plumbing services that combine quality, integrity, and efficiency. We strive to solve problems quickly and effectively while ensuring every customer feels heard, valued, and fully satisfied with the results.</p>
          <p>Through innovation and commitment, we aim to raise the standard for plumbing care in our community.</p>
          <img src="https://framerusercontent.com/images/K6GgsUDd5GcllgsX9N0Xah7Y.jpg?scale-down-to=2048&width=4800&height=2396" alt="" />
          <div className="mission-card-row">
            {["Expert Craftsmanship", "Fast & Reliable Service", "Fair Honest Pricing"].map((item) => (
              <article key={item}>
                <span>✓</span>
                <h3>{item}</h3>
                <p>{item === "Fair Honest Pricing" ? "No hidden fees or surprise costs. We offer transparent pricing and clear communication" : item === "Fast & Reliable Service" ? "We respond quickly and work efficiently to resolve your plumbing issues without delay" : "Our licensed technicians bring years of hands-on experience, ensuring every job with care"}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ProcessSection />
      <TeamSection />
      <Testimonials />
      <ContactBand />
      <Footer />
    </>
  );
}
