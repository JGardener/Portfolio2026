import { useEffect, useRef } from 'react'
import { gsap, ease } from '../../lib/gsap'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const skillGroups = [
  {
    label: 'Frontend',
    skills: ['React', 'TypeScript', 'PixiJS', 'WebGL', 'Canvas API', 'GSAP', 'Zustand', 'Tailwind', 'SCSS'],
  },
  {
    label: 'Backend',
    skills: ['Node', 'Deno', 'Supabase', 'PostgreSQL', 'Google OAuth'],
  },
  {
    label: 'AI & APIs',
    skills: ['Claude AI', 'REST API'],
  },
  {
    label: 'Testing & Observability',
    skills: ['Vitest', 'Sentry'],
  },
  {
    label: 'Tooling',
    skills: ['Figma', 'Texture Packer'],
  },
]

export default function About() {
  const ref = useScrollReveal({ y: 30, duration: 0.8 })
  const chipsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chips = chipsRef.current?.querySelectorAll('.skill-chip')
    if (!chips?.length) return
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
          Outside work, I build to learn. Across personal projects I've pushed into full-stack
          territory — Supabase auth with Google OAuth, PostgreSQL with row-level security, and Deno
          edge functions for server-side validation. I've integrated the Claude API to generate live
          PixiJS scenes from natural language, consumed REST APIs with typed error handling and
          rate-limit recovery, and shipped a generic object-pooled game engine as a standalone npm
          package. Vitest for real test coverage, Sentry for production observability — the same
          standards I'd apply on a team.
        </p>

        <div ref={chipsRef} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {skillGroups.map((group) => (
            <div key={group.label}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--fs-xs)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-mute)',
                  marginBottom: '8px',
                }}
              >
                {group.label}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="skill-chip"
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
          ))}
        </div>
      </div>
    </section>
  )
}
