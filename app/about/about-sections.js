import { placeholderImages } from "../components/placeholder-images";
import { ProcessCarousel } from "./process-carousel";
import styles from "./about.module.css";

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScopeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

const missionPrinciples = [
  {
    Icon: CheckIcon,
    title: "Fackmässigt utförande",
    body: "Rätt material och metod i varje steg, utfört med omsorg om nästa moment.",
  },
  {
    Icon: ArrowUpIcon,
    title: "Säker arbetsplats",
    body: "Planerat skydd, god ordning och rätt behörighet för uppgiften.",
  },
  {
    Icon: ScopeIcon,
    title: "Tydlig omfattning",
    body: "Du vet vad som ingår, vilka moment som krävs och vad som påverkar tiden.",
  },
];

export function AboutStorySection() {
  return (
    <section className={`about-story-section ${styles.storySection}`}>
      <div className={`container ${styles.storyGrid}`}>
        <div className={styles.storyTitle}>
          <h1>Om GESAB</h1>
          <p>Från badrumsrenovering till bygg och entreprenad – GESAB samordnar yrkesrollerna och håller ihop projektet.</p>
        </div>
        <div className={styles.storyCollage}>
          <img className={styles.storyPrimaryImage} src={placeholderImages.content} alt="" />
          <img className={styles.storySecondaryImage} src={placeholderImages.content} alt="" />
          <img className={styles.storySecondaryImage} src={placeholderImages.content} alt="" />
          <article className={styles.quoteCard}>
            <img src={placeholderImages.round} alt="" />
            <div>
              <blockquote>“Vårt mål är enkelt – tydlig planering, pålitlig service och ett fackmässigt resultat du kan känna dig trygg med.”</blockquote>
              <strong>GESAB</strong>
              <span>Göteborg</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export function AboutProcessSection() {
  return (
    <section className={`process-section ${styles.aboutProcessSection}`}>
      <div className={`container ${styles.aboutProcessGrid}`}>
        <div className="section-title center">
          <span>Vår arbetsprocess</span>
          <h2>Vägen till ett färdigt resultat</h2>
        </div>
        <ProcessCarousel />
      </div>
    </section>
  );
}

export function AboutMissionSection() {
  return (
    <section className={styles.missionSection}>
      <div className={`container ${styles.missionInner}`}>
        <header className={styles.missionIntro}>
          <span className={styles.missionEyebrow}>Vårt ansvar</span>
          <div className={styles.missionCopy}>
            <h2>Tryggt arbete med ansvar och ordning</h2>
            <div className={styles.missionBody}>
              <p>
                GESAB skapar trygga renoveringar där kunden vet vad som ska göras, varför det görs och vilka
                yrkesroller som behövs. I våtrum är ordning, dokumentation och rätt arbetsmetod avgörande.
              </p>
              <p>
                Vi tar arbetsmiljö och miljöansvar på allvar, med säkrare arbetsplatser, sorterat avfall och
                omsorg om materialen.
              </p>
            </div>
          </div>
        </header>

        <div className={styles.missionStage}>
          <figure className={styles.missionImage}>
            <img src={placeholderImages.content} alt="" loading="lazy" decoding="async" />
          </figure>

          <div className={styles.missionPrinciples}>
            {missionPrinciples.map(({ Icon, title, body }) => (
              <article key={title} className={styles.missionPrinciple}>
                <span aria-hidden="true" className={styles.missionPrincipleIcon}>
                  <Icon />
                </span>
                <div className={styles.missionPrincipleCopy}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
