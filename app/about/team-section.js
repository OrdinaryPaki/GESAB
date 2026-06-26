import { team } from "../plumbly-data";

export function TeamSectionCopy() {
  return (
    <section className="team-section interior">
      <div className="container">
        <div className="section-title center">
          <span>Team Members</span>
          <h2>Our Hard working Members</h2>
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
