import { useEffect, useRef } from 'react'
import { gsap, ease, prefersReducedMotion } from '../../lib/gsap'
import { experiences } from '../../data/experience'
import SectionHeading from '../ui/SectionHeading'

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const entriesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const entries = entriesRef.current?.children
    if (!entries) return

    if (prefersReducedMotion()) {
      gsap.set(Array.from(entries), { opacity: 1, x: 0 })
      gsap.set(progressRef.current, { scaleY: 1 })
      return
    }

    const reveal = gsap.fromTo(
      Array.from(entries),
      { opacity: 0, x: -24 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: ease.draw,
        scrollTrigger: { trigger: entriesRef.current, start: 'top 85%' },
      }
    )

    // Accent rail draws down as the timeline scrolls through the viewport.
    const draw = gsap.fromTo(
      progressRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 75%',
          end: 'bottom 45%',
          scrub: 0.4,
        },
      }
    )

    return () => {
      reveal.scrollTrigger?.kill()
      reveal.kill()
      draw.scrollTrigger?.kill()
      draw.kill()
    }
  }, [])

  return (
    <section id="experience" className="section">
      <SectionHeading index="03" label="Experience" title="Where I've shipped" />

      <div ref={timelineRef} className="timeline">
        <div className="timeline__rail" aria-hidden="true" />
        <div ref={progressRef} className="timeline__progress" aria-hidden="true" />

        <div ref={entriesRef} style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
          {experiences.map((exp) => (
            <div key={exp.id} className="timeline-entry" style={{ opacity: 0 }}>
              <p className="mono-label" style={{ marginBottom: '6px' }}>{exp.period}</p>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(20px, 2.4vw, 36px)',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: 'var(--text)',
                  marginBottom: '2px',
                }}
              >
                {exp.role}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--fs-label)',
                  letterSpacing: '0.06em',
                  color: 'var(--accent)',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                }}
              >
                {exp.company}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(14px, 0.95vw, 18px)',
                  lineHeight: 1.6,
                  color: 'var(--text-dim)',
                  maxWidth: '720px',
                }}
              >
                {exp.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '20px' }}>
                {exp.tags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
