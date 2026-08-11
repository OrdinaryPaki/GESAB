import Link from "next/link";
import { ContactBand } from "../../components/ContactBand";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { CtaAnchor, CtaLink } from "../../components/CtaButton";
import { FaqAccordion } from "../../components/FaqAccordion";
import { MobileStickyContact } from "../../components/MobileStickyContact";
import { ReviewCarousel } from "../../components/ReviewCarousel";
import { contactInfo, testimonials } from "../../gesab-data";
import { ServiceQuoteForm } from "./ServiceQuoteForm";
import { ProjectGallery } from "./ProjectGallery";
import styles from "./service-detail-styles.js";

const QUOTE_ANCHOR = "boka";

function buildStructuredData(service, detail) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.title,
        description: service.detail.intro,
        areaServed: "Göteborg med omnejd",
        provider: {
          "@type": "LocalBusiness",
          name: "Göteborgs Entreprenad Service AB",
          telephone: "+46707299633",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: detail.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}

export function ServiceDetailPageView({ detail, relatedServices, service }) {
  const structuredData = JSON.stringify(buildStructuredData(service, detail)).replaceAll("<", "\\u003c");
  const heroImage = (detail.heroImage ?? service.image).replace("scale-down-to=512", "scale-down-to=1024");
  const heroTitle = detail.heroTitle ?? service.title;
  const heroLead = detail.heroLead ?? service.body;
  const reviews = (detail.reviewNames ?? [])
    .map((name) => testimonials.find((item) => item.name === name))
    .filter(Boolean);

  return (
    <div className={`${styles.page} service-detail-page`} data-service-detail-page={service.slug}>
      <Header dark />
      <main>
        <section className={styles.hero} aria-labelledby="service-title">
          <div className={`container ${styles.container}`}>
            <h1
              className={`${styles.title} ${detail.heroTitle ? styles.titleLong : ""}`}
              id="service-title"
            >
              {heroTitle}
            </h1>
            <div className={styles.meta} aria-label="Tjänsteinformation">
              <span data-service-audience={detail.audience}>{detail.audience}</span>
              <span>Göteborg med omnejd</span>
            </div>
            <p className={styles.heroLead}>{heroLead}</p>
            <div className={styles.heroActions}>
              <CtaAnchor href={`#${QUOTE_ANCHOR}`} variant="yellow">
                Få gratis offert & rådgivning
              </CtaAnchor>
              <CtaAnchor href={contactInfo.phonePrimaryHref} variant="dark">
                Ring {contactInfo.phonePrimary}
              </CtaAnchor>
            </div>
            <img
              alt={detail.heroImageAlt ?? `${service.title} med GESAB i Göteborg`}
              className={styles.heroImage}
              decoding="async"
              fetchPriority="high"
              height="680"
              src={heroImage}
              width="1320"
            />
            {detail.highlights ? (
              <dl className={styles.highlights}>
                {detail.highlights.map(([value, label]) => (
                  <div key={label}>
                    <dt>{value}</dt>
                    <dd>{label}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className={`container ${styles.container} ${styles.contentGrid}`}>
            <aside
              aria-label={`Begär offert för ${service.title}`}
              className={styles.quoteCard}
              data-service-quote={service.slug}
              id={QUOTE_ANCHOR}
            >
              <ServiceQuoteForm
                defaultServiceSlug={service.slug}
                description={
                  detail.quoteDescription ??
                  "Beskriv dina önskemål eller skicka några bilder. Vi återkommer inom 24h med rådgivning och ett fast prisförslag."
                }
                heading={detail.quoteHeading ?? "Få en gratis offert"}
              />
              <ul className={styles.quoteBenefits}>
                {(detail.quoteBenefits ?? [
                  "100% gratis hembesök & rådgivning",
                  "Fast pris utan obehagliga överskridanden",
                  "En kontaktperson genom hela projektet",
                  "30% ROT-avdrag direkt på fakturan",
                ]).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>

            <article className={styles.article}>
              <section className={styles.articleSection} data-service-introduction>
                <h2>{service.detail.introTitle}</h2>
                <p>{service.detail.intro}</p>

                {detail.projects ? (
                  <ProjectGallery projects={detail.projects} />
                ) : (
                  <img
                    alt={detail.supportingImageAlt ?? `${service.title} – planerat och fackmässigt arbete`}
                    className={styles.supportingImage}
                    data-service-supporting-image
                    decoding="async"
                    height="494"
                    loading="lazy"
                    src={detail.supportingImage}
                    width="827"
                  />
                )}
              </section>

              <section className={styles.articleSection} data-service-detail-section>
                <h2>{detail.sectionsTitle ?? "Därför väljer kunder GESAB"}</h2>
                <div className={styles.textBlocks}>
                  {service.detail.sections.map(([title, body]) => (
                    <div className={styles.textBlock} key={title}>
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className={styles.articleSection}>
                <h2>{detail.bulletsTitle ?? "Det här kan ingå"}</h2>
                <p>{detail.bulletsIntro ?? "Omfattningen anpassas efter platsen och dina behov. Vanliga delar i uppdraget är:"}</p>
                <ul className={styles.standardList}>
                  {service.detail.bullets.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>

              {reviews.length > 0 ? (
                <section className={styles.reviewBreakout} data-service-reviews>
                  <div className={styles.reviewBreakoutInner}>
                    <h2>{detail.reviewsTitle ?? "Vad kunderna säger"}</h2>
                    <ReviewCarousel
                      items={reviews}
                      className={styles.serviceCarousel}
                      cardClassName={styles.reviewCard}
                    />
                  </div>
                </section>
              ) : null}

              <section className={styles.articleSection} data-service-process-section>
                <h2>{detail.processTitle ?? "Så går det till"}</h2>
                <p>{detail.processIntro ?? "Målet är att du ska veta vad som ingår innan arbetet startar."}</p>
                <div className={styles.textBlocks}>
                  {detail.process.map(([title, body], index) => (
                    <div className={styles.textBlock} key={title}>
                      <h3>{index + 1}. {title}</h3>
                      <p>{body}</p>
                    </div>
                  ))}
                </div>
              </section>

              {detail.timeline ? (
                <section className={styles.articleSection} data-service-timeline>
                  <h2>{detail.timelineTitle}</h2>
                  <p>{detail.timelineIntro}</p>
                  <ol className={styles.timeline}>
                    {detail.timeline.map(([label, body]) => (
                      <li key={label}>
                        <span className={styles.timelineLabel}>{label}</span>
                        <span className={styles.timelineBody}>{body}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}

              <section className={styles.articleSection} data-service-preparation-section>
                <h2>{detail.preparationTitle ?? "Inför första kontakten"}</h2>
                <p>{detail.preparationIntro ?? "Det räcker med ett enkelt underlag. Skicka gärna:"}</p>
                <ul className={styles.standardList}>
                  {detail.preparation.map((item, index) => (
                    <li data-service-preparation={index + 1} key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className={`${styles.articleSection} ${styles.segmentCard}`}>
                <h2>{detail.considerationsTitle ?? "Vad påverkar priset?"}</h2>
                <p>
                  {detail.considerationsIntro ??
                    "Vi lämnar hellre ett genomarbetat pris än en snabb gissning. Offerten styrs bland annat av:"}
                </p>
                <ul className={styles.standardList}>
                  {detail.considerations.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>

              <section className={styles.articleSection}>
                <h2>{detail.importantTitle}</h2>
                <p>{detail.importantIntro ?? detail.important}</p>
                {detail.credentials ? (
                  <ul className={styles.standardList}>
                    {detail.credentials.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                ) : null}
              </section>

              <section className={`${styles.articleSection} ${styles.faqSection}`}>
                <h2>Vanliga frågor</h2>
                <FaqAccordion items={detail.faq} />
              </section>
            </article>
          </div>
        </section>

        <section className={styles.relatedSection} aria-labelledby="related-services-title">
          <div className={`container ${styles.container}`}>
            <div className={styles.relatedHeader}>
              <h2 id="related-services-title">Fler tjänster som kan passa</h2>
              <CtaLink href="/service" variant="dark">Visa alla tjänster</CtaLink>
            </div>
            <div className={styles.relatedGrid}>
              {relatedServices.map((relatedService) => (
                <Link
                  className={styles.relatedCard}
                  data-related-service={relatedService.slug}
                  href={`/service/${relatedService.slug}`}
                  key={relatedService.slug}
                >
                  <img
                    alt={`${relatedService.title} med GESAB i Göteborg`}
                    height="240"
                    loading="lazy"
                    src={relatedService.image}
                    width="400"
                  />
                  <div>
                    <h3>{relatedService.title}</h3>
                    <p>{relatedService.body}</p>
                    <span>Läs mer om tjänsten <span aria-hidden="true">→</span></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <ContactBand />
      <Footer />
      <MobileStickyContact defaultServiceSlug={service.slug} />
      <script dangerouslySetInnerHTML={{ __html: structuredData }} type="application/ld+json" />
    </div>
  );
}
