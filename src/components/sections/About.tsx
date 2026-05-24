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
    <section ref={ref} id="about" className="section" style={{ opacity: 0 }}>
      <p className="mono-label" style={{ marginBottom: '48px' }}>
        // 02 — About
      </p>
      <h2 className="sr-only">About</h2>

      <div className="about-grid">
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(16px, 1.5vw, 22px)',
            lineHeight: 1.5,
            color: 'var(--text-dim)',
          }}
        >
          Three years in iGaming taught me to ship production canvas work under pressure — PixiJS
          UIs for live products, international clients, real deadlines. I'm based in Kent, available
          now, and looking for a team that still cares how it's built.
        </p>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(16px, 1.5vw, 22px)',
            lineHeight: 1.5,
            color: 'var(--text-dim)',
          }}
        >
          Outside that, I build to learn. The Bloodweb is a full-stack Dead by Daylight companion —
          Supabase for auth and Postgres with row-level security, Deno edge functions for
          server-side validation, Canvas API for build image export, and Vitest for test coverage I
          can actually trust. Sentry in a personal project isn't something you reach for unless you
          care about the craft.
        </p>

        <div ref={chipsRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {skills.map((skill) => (
            <span
              key={skill}
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
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
