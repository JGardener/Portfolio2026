import { useEffect, useRef } from 'react'
import { gsap, ease } from '../../lib/gsap'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const skills = [
  'React',
  'TypeScript',
  'PixiJS',
  'WebGL',
  'Node',
  'Figma',
  'Framer Motion',
  'GSAP',
  'Texture Packer',
  'Tailwind',
]

export default function About() {
  const ref = useScrollReveal({ y: 30, duration: 0.8 })
  const chipsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chips = chipsRef.current?.children
    if (!chips) return
    const anim = gsap.fromTo(
      Array.from(chips),
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.04,
        ease: ease.out,
        scrollTrigger: { trigger: chipsRef.current, start: 'top 88%' },
      }
    )
    return () => {
      anim.scrollTrigger?.kill()
    }
  }, [])

  return (
    <section
      ref={ref}
      id="about"
      className="section"
      style={{ opacity: 0 }}
    >
      <p className="mono-label" style={{ marginBottom: '48px' }}>// 02 — About</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '96px',
          alignItems: 'start',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '20px',
            lineHeight: 1.5,
            color: 'var(--text-dim)',
          }}
        >
          I'm a creative frontend developer based in Kent, building interactive web experiences
          that sit at the intersection of design and engineering. Three years in iGaming taught
          me how to ship production-grade canvas work under pressure. Now I'm looking for
          mid-level roles where that craft matters.
        </p>

        <div ref={chipsRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {skills.map((skill) => (
            <span
              key={skill}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
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
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
