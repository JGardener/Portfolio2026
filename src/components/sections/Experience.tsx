import { useEffect, useRef } from 'react'
import { gsap, ease } from '../../lib/gsap'
import { experiences } from '../../data/experience'

export default function Experience() {
  const entriesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const entries = entriesRef.current?.children
    if (!entries) return
    const anim = gsap.fromTo(
      Array.from(entries),
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: ease.draw,
        scrollTrigger: { trigger: entriesRef.current, start: 'top 88%' },
      }
    )
    return () => {
      anim.scrollTrigger?.kill()
    }
  }, [])

  return (
    <section
      id="experience"
      className="section"
    >
      <p className="mono-label" style={{ marginBottom: '64px' }}>// 03 — Experience</p>

      <div style={{ position: 'relative', paddingLeft: '48px' }}>
        <div
          style={{
            position: 'absolute',
            left: '32px',
            top: 0,
            bottom: 0,
            width: '1px',
            backgroundColor: 'var(--accent)',
            opacity: 0.4,
          }}
        />

        <div ref={entriesRef} style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {experiences.map((exp) => (
            <div key={exp.id}>
              <p className="mono-label" style={{ marginBottom: '4px' }}>{exp.period}</p>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(18px, 2vw, 32px)',
                  fontWeight: 600,
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
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}
              >
                {exp.company}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(14px, 0.85vw, 17px)',
                  lineHeight: 1.55,
                  color: 'var(--text-dim)',
                }}
              >
                {exp.description}
              </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
            {exp.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-dim)',
                border: '1px solid var(--line-2)',
                borderRadius: 'var(--r-sm)',
                padding: '8px 12px',
                backgroundColor: 'transparent',
                transition: 'border-color 150ms, color 150ms',
              }}
            >
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
