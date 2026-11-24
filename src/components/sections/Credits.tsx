import { experiences } from '../../data/experience'

// Experience, set like the credits page at the back of a game manual.
export default function Credits() {
  return (
    <section id="experience" className="credits" aria-labelledby="experience-title">
      <div className="credits__inner">
        <h2 id="experience-title" className="credits__title">
          Experience
        </h2>
        <ol className="credits__list">
          {experiences.map((e) => (
            <li key={e.id} className="credit">
              <p className="credit__line">
                <span className="credit__role">{e.role}</span>
                <span className="credit__leader" aria-hidden="true" />
                <span className="credit__company">{e.company}</span>
              </p>
              <p className="credit__period">{e.period}</p>
              <p className="credit__desc">{e.description}</p>
              <p className="credit__tools">
                <span className="credit__tools-label">Tools</span> {e.tags.join(', ')}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
