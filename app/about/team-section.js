import { team } from "../gesab-data";

export function TeamSectionCopy() {
  return (
    <section className="team-section interior">
      <div className="container">
        <div className="section-title center">
          <span>Kompetenser</span>
          <h2>Yrkesroller som behövs i ett väl utfört projekt</h2>
        </div>
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
