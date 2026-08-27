import missionStyles from "./about-mission.module.css";
import storyStyles from "./about-story.module.css";

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
    <section className={`about-story-section ${storyStyles.storySection}`}>
      <div className={`container ${storyStyles.storyGrid}`}>
        <div className={storyStyles.storyTitle}>
          <h1>Om GESAB</h1>
          <p>Från badrumsrenovering till bygg och entreprenad – GESAB samordnar yrkesrollerna och håller ihop projektet.</p>
        </div>
        <div className={storyStyles.storyCollage}>
          <img className={storyStyles.storyPrimaryImage} src="/images/home/about-team-workshop.webp" alt="Två hantverkare planerar ett badrumsarbete från ritning" />
          <img className={storyStyles.storySecondaryImage} src="/images/home/why-team-planning.webp" alt="GESAB-teamet samordnar nästa steg på arbetsplatsen" />
          <img className={storyStyles.storySecondaryImage} src="/images/home/why-final-inspection.webp" alt="Slutkontroll av ett färdigt renoveringsarbete" />
          <article className={storyStyles.quoteCard}>
            <img src="/images/home/why-site-measurement.webp" alt="Hantverkare mäter på plats inför renovering" />
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

export function AboutMissionSection() {
  return (
    <section className={missionStyles.missionSection}>
      <div className={`container ${missionStyles.missionInner}`}>
        <header className={missionStyles.missionIntro}>
          <span className={missionStyles.missionEyebrow}>Vårt ansvar</span>
          <div className={missionStyles.missionCopy}>
            <h2>Tryggt arbete med ansvar och ordning</h2>
            <div className={missionStyles.missionBody}>
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

        <div className={missionStyles.missionStage}>
          <figure className={missionStyles.missionImage}>
            <img
              src="/images/about/townhouse-landing.webp"
              alt="Färdig totalrenovering med kök, matplats och trappa i ett sammanhållet hem"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <div className={missionStyles.missionPrinciples}>
            {missionPrinciples.map(({ Icon, title, body }) => (
              <article key={title} className={missionStyles.missionPrinciple}>
                <span aria-hidden="true" className={missionStyles.missionPrincipleIcon}>
                  <Icon />
                </span>
                <div className={missionStyles.missionPrincipleCopy}>
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
