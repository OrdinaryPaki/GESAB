import { gallery } from "../gesab-data";
import styles from "./about.module.css";

const missionCards = [
  {
    icon: "✓",
    title: "Fackmässigt utförande",
    body: "Rätt material och metod i varje steg, utfört med omsorg om nästa moment.",
  },
  {
    icon: "↗",
    title: "Säker arbetsplats",
    body: "Planerat skydd, god ordning och rätt behörighet för uppgiften.",
  },
  {
    icon: "□",
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
          <img className={styles.storyPrimaryImage} src={gallery[0]} alt="" />
          <img className={styles.storySecondaryImage} src={gallery[1]} alt="" />
          <img className={styles.storySecondaryImage} src={gallery[2]} alt="" />
          <article className={styles.quoteCard}>
            <img
              src="https://framerusercontent.com/images/HCfKCgyvxfEFHbm0ViUBM4r7css.jpg?scale-down-to=512&width=788&height=768"
              alt=""
            />
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
    <section className={`mission-section ${styles.missionSection}`}>
      <div className={`container ${styles.missionInner}`}>
        <div className={styles.missionCopy}>
          <h2>Tryggt arbete med ansvar och ordning</h2>
          <div className={styles.missionBody}>
            <p>GESAB skapar trygga renoveringar där kunden vet vad som ska göras, varför det görs och vilka yrkesroller som behövs. I våtrum är ordning, dokumentation och rätt arbetsmetod avgörande.</p>
            <p>Vi tar arbetsmiljö och miljöansvar på allvar, med säkrare arbetsplatser, sorterat avfall och omsorg om materialen.</p>
          </div>
        </div>
        <img
          className={styles.missionImage}
          src="https://framerusercontent.com/images/K6GgsUDd5GcllgsX9N0Xah7Y.jpg?scale-down-to=2048&width=4800&height=2396"
          alt=""
        />
        <div className={`mission-card-row ${styles.missionCards}`}>
          {missionCards.map((card) => (
            <article key={card.title}>
              <span aria-hidden="true">{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
