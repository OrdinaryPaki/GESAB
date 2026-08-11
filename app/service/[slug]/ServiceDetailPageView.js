import Link from "next/link";
import { ContactBand } from "../../components/ContactBand";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { CtaLink } from "../../components/CtaButton";
import { FaqAccordion } from "../../components/FaqAccordion";
import { ServiceQuoteForm } from "./ServiceQuoteForm";
import styles from "./service-detail-styles.js";

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
  const heroImage = service.image.replace("scale-down-to=512", "scale-down-to=1024");

  return (
    <div className={`${styles.page} service-detail-page`} data-service-detail-page={service.slug}>
      <Header dark />
      <main>
        <section className={styles.hero} aria-labelledby="service-title">
          <div className={`container ${styles.container}`}>
            <h1 className={styles.title} id="service-title">{service.title}</h1>
            <div className={styles.meta} aria-label="Tjänsteinformation">
              <span data-service-audience={detail.audience}>{detail.audience}</span>
              <span>Göteborg med omnejd</span>
            </div>
            <img
              alt={`${service.title} med GESAB i Göteborg`}
              className={styles.heroImage}
              decoding="async"
              fetchPriority="high"
              height="680"
              src={heroImage}
              width="1320"
            />
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className={`container ${styles.container} ${styles.contentGrid}`}>
            <aside
              aria-label={`Begär offert för ${service.title}`}
              className={styles.quoteCard}
              data-service-quote={service.slug}
            >
              <ServiceQuoteForm
                defaultServiceSlug={service.slug}
                description="Beskriv platsen och vad du vill göra. Bilder hjälper oss lämna ett tydligare pris."
                heading={`Få pris på ${service.title.toLowerCase()}`}
              />
              <ul className={styles.quoteBenefits}>
                <li>Kostnadsfri första kontakt</li>
                <li>Tydligt pris innan arbete börjar</li>
                <li>ROT-avdrag hanteras på fakturan</li>
              </ul>
            </aside>

            <article className={styles.article}>
              <p className={styles.lead}>{service.body}</p>

              <section className={styles.articleSection} data-service-introduction>
                <h2>{service.detail.introTitle}</h2>
                <p>{service.detail.intro}</p>

                <div className={`${styles.fitUnderIntro} ${styles.faqSection}`} data-service-fit-section>
                  <h3 className={styles.fitUnderIntroTitle}>När passar tjänsten?</h3>
                  <FaqAccordion
                    items={detail.suitableFor.map(([title, body]) => ({
                      question: title,
                      answer: body,
                    }))}
                  />
                </div>

                <img
                  alt={`${service.title} – planerat och fackmässigt arbete`}
                  className={styles.supportingImage}
                  data-service-supporting-image
                  decoding="async"
                  height="494"
                  loading="lazy"
                  src={detail.supportingImage}
                  width="827"
                />
              </section>

              <section className={styles.articleSection} data-service-detail-section>
                <h2>Därför väljer kunder GESAB</h2>
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
                <h2>Det här kan ingå</h2>
                <p>Omfattningen anpassas efter platsen och dina behov. Vanliga delar i uppdraget är:</p>
                <ul className={styles.standardList}>
                  {service.detail.bullets.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>

              <section className={styles.articleSection} data-service-process-section>
                <h2>Så går det till</h2>
                <p>Målet är att du ska veta vad som ingår innan arbetet startar.</p>
                <div className={styles.textBlocks}>
                  {detail.process.map(([title, body], index) => (
                    <div className={styles.textBlock} key={title}>
                      <h3>{index + 1}. {title}</h3>
                      <p>{body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className={styles.articleSection} data-service-preparation-section>
                <h2>Inför första kontakten</h2>
                <p>Det räcker med ett enkelt underlag. Skicka gärna:</p>
                <ul className={styles.standardList}>
                  {detail.preparation.map((item, index) => (
                    <li data-service-preparation={index + 1} key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className={styles.articleSection}>
                <h2>Vad påverkar priset?</h2>
                <p>Vi lämnar hellre ett genomarbetat pris än en snabb gissning. Offerten styrs bland annat av:</p>
                <ul className={styles.standardList}>
                  {detail.considerations.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>

              <section className={styles.articleSection}>
                <h2>{detail.importantTitle}</h2>
                <p>{detail.important}</p>
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
      <script dangerouslySetInnerHTML={{ __html: structuredData }} type="application/ld+json" />
    </div>
  );
}
