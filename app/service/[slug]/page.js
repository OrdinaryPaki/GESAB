import { notFound } from "next/navigation";
import { services } from "../../plumbly-data";
import { ContactBand, Footer, Header } from "../../components/PlumblyShell";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <Header dark />
      <section className="detail-hero-section">
        <div className="container narrow">
          <h1>{service.title}</h1>
          <img src={service.image} alt="" />
        </div>
      </section>
      <section className="detail-article-section">
        <article className="detail-article">
          <h2>Protect Your Property from Hidden Water Damage</h2>
          <p>Leaks can be silent destroyers, often going unnoticed until serious damage has already been done. Whether it's a hidden pipe inside your wall or a slow leak under your slab foundation, early detection is key to preventing structural damage, mold growth, and costly repairs</p>
          <h2>Advanced Leak Detection Technology</h2>
          <p>We use non-invasive tools and cutting-edge equipment to detect leaks without tearing down walls or digging up your floors. From thermal imaging to acoustic sensors, our technology helps us pinpoint even the smallest leaks with incredible accuracy</p>
          <h2>Expert Diagnosis by Trained Professionals</h2>
          <p>Our certified plumbing technicians are trained to spot the signs of leaks and conduct a thorough inspection of your plumbing system. No guesswork—just precise, professional assessment to find the source quickly</p>
          <img src="https://framerusercontent.com/images/rYld1RtawTcSnr6YgGDpswY4Hg.jpg?scale-down-to=2048&width=3309&height=1976" alt="" />
          <h2>Fast and Reliable Leak Repairs</h2>
          <p>Once a leak is detected, we act fast. Our team is equipped to handle all types of repairs, including pipe replacement, joint sealing, and fixture upgrades. We use durable, long-lasting materials to ensure the problem doesn’t return</p>
          <h2>Why Timely Leak Repair Matters</h2>
          <ul>
            <li>Prevent water waste and lower utility bills</li>
            <li>Avoid foundation and structural damage</li>
            <li>Reduce the risk of mold and mildew</li>
            <li>Maintain the safety and comfort of your home</li>
          </ul>
          <h2>Your Safety Is Our Priority</h2>
          <p>We understand how stressful plumbing issues can be. That’s why we focus on delivering not just technical service, but peace of mind. Our work is clean, respectful, and backed by a satisfaction guarantee</p>
          <h2>Available 24/7 for Emergencies</h2>
          <p>Some leaks can’t wait. That’s why we offer 24/7 emergency response for sudden pipe bursts or flooding. Call us anytime—day or night—and we’ll be there to help</p>
          <h2>Schedule a Leak Inspection Today</h2>
          <p>Don’t wait for visible damage. If you hear dripping sounds, notice damp spots, or see a spike in your water bill, let us inspect your home. Early action can save thousands in repairs</p>
          <a href="/service" className="button dark">Go Back</a>
        </article>
      </section>
      <ContactBand />
      <Footer />
    </>
  );
}
