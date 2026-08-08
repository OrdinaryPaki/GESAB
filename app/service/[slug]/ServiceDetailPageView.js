import Link from "next/link";
import { Footer, Header } from "../../components/GesabShell";
import { CtaLink } from "../../components/CtaButton";
import { FaqAccordion } from "../../components/FaqAccordion";
import { ServiceQuoteForm } from "./ServiceQuoteForm";
import styles from "./service-detail.module.css";

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
          <div className={styles.container}>
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
          <div className={`${styles.container} ${styles.contentGrid}`}>
            <aside
              aria-label={`Begär offert för ${service.title}`}
              className={styles.quoteCard}
              data-service-quote={service.slug}
            >
              <ServiceQuoteForm
                defaultServiceSlug={service.slug}
                description="Berätta kort om platsen, omfattningen och när du vill komma igång. Vi återkommer med rätt nästa steg."
                heading="Få en tydlig offert"
              />
              <ul className={styles.quoteBenefits}>
                <li>Kostnadsfri första kontakt</li>
                <li>Tydlig omfattning före byggstart</li>
                <li>Samordning efter projektets behov</li>
              </ul>
            </aside>

            <article className={styles.article}>
              <p className={styles.lead}>{service.body}</p>

              <section className={styles.fitOverview} aria-label={`När ${service.title.toLowerCase()} passar och vad du kan förbereda`}>
                <div className={styles.fitColumn}>
                  <h2>Tjänsten passar för</h2>
                  <ul className={styles.fitList}>
                    {detail.suitableFor.map(([title, body], index) => (
                      <li data-service-fit={index + 1} key={title}>
                        <h3>{title}</h3>
                        <p>{body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.preparationColumn}>
                  <h2>Bra att ha inför första genomgången</h2>
                  <ul className={styles.preparationList}>
                    {detail.preparation.map((item, index) => (
                      <li data-service-preparation={index + 1} key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className={styles.articleSection}>
                <h2>{service.detail.introTitle}</h2>
                <p>{service.detail.intro}</p>
              </section>

              {service.detail.sections.map(([title, body], index) => (
                <section className={styles.articleSection} key={title}>
                  <h2>{title}</h2>
                  <p>{body}</p>
                  {index === 1 ? (
                    <img
                      alt={`${service.title} – planerat och fackmässigt arbete`}
                      className={styles.supportingImage}
                      decoding="async"
                      height="494"
                      loading="lazy"
                      src={detail.supportingImage}
                      width="827"
                    />
                  ) : null}
                </section>
              ))}

              <section className={styles.articleSection}>
                <h2>Det här ingår ofta</h2>
                <p>Den slutliga omfattningen anpassas efter platsen och det vi kommer överens om. Vanliga delar är:</p>
                <ul className={styles.includedList}>
                  {service.detail.bullets.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>

              <section className={styles.articleSection}>
                <h2>Så arbetar vi</h2>
                <p>En tydlig ordning minskar väntetid, missförstånd och kostsamma omtag.</p>
                <ol className={styles.processList}>
                  {detail.process.map(([title, body], index) => (
                    <li className={styles.processItem} key={title}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <h3>{title}</h3>
                        <p>{body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className={styles.articleSection}>
                <h2>Det här påverkar offert och tidplan</h2>
                <p>Vi lämnar hellre en genomarbetad bedömning än ett snabbt pris som inte speglar verkligheten.</p>
                <ul className={styles.considerationList}>
                  {detail.considerations.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>

              <aside className={styles.importantNote}>
                <h2>{detail.importantTitle}</h2>
                <p>{detail.important}</p>
              </aside>

              <section className={`${styles.articleSection} ${styles.faqSection}`}>
                <h2>Vanliga frågor</h2>
                <FaqAccordion allowMultiple={false} items={detail.faq} />
              </section>
            </article>
          </div>
        </section>

        <section className={styles.relatedSection} aria-labelledby="related-services-title">
          <div className={styles.container}>
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
      <Footer />
      <script dangerouslySetInnerHTML={{ __html: structuredData }} type="application/ld+json" />
    </div>
  );
}
