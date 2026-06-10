import { useEffect, useRef } from 'react'
import { gsap, ease, prefersReducedMotion } from '../../lib/gsap'
import SectionHeading from '../ui/SectionHeading'

const stats = [
  { value: 3, suffix: '+', label: 'Years shipping production UIs' },
  { value: 4, suffix: '', label: 'Featured projects' },
  { value: 20, suffix: '+', label: 'Technologies in production' },
]

const skillGroups = [
  {
    label: 'Frontend',
    skills: ['React', 'TypeScript', 'PixiJS', 'WebGL', 'Canvas API', 'Web Audio API', 'GSAP', 'Zustand', 'Tailwind', 'SCSS'],
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
  const statsRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const chipsRef = useRef<HTMLDivElement>(null)

  // Count-up stat values on scroll.
  useEffect(() => {
    const root = statsRef.current
    if (!root) return
    const values = Array.from(root.querySelectorAll<HTMLElement>('.stat__num'))

    if (prefersReducedMotion()) {
      gsap.set(root.children, { opacity: 1, y: 0 })
      return
    }

    const reveal = gsap.fromTo(
      Array.from(root.children),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: ease.draw,
        scrollTrigger: { trigger: root, start: 'top 85%' },
      }
    )

    const counters = values.map((el) => {
      const target = Number(el.dataset.value ?? '0')
      const obj = { v: 0 }
      return gsap.to(obj, {
        v: target,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: root, start: 'top 85%' },
        onUpdate: () => {
          el.textContent = String(Math.round(obj.v)).padStart(2, '0')
        },
      })
    })

    return () => {
      reveal.scrollTrigger?.kill()
      reveal.kill()
      for (const c of counters) {
        c.scrollTrigger?.kill()
        c.kill()
      }
    }
  }, [])

  // Body copy + skill chips reveal.
  useEffect(() => {
    const body = bodyRef.current
    const chips = chipsRef.current?.querySelectorAll('.skill-chip')

    if (prefersReducedMotion()) {
      if (body) gsap.set(Array.from(body.children), { opacity: 1, y: 0 })
      if (chips?.length) gsap.set(Array.from(chips), { opacity: 1, scale: 1 })
      return
    }

    const anims: gsap.core.Tween[] = []
    if (body) {
      anims.push(
        gsap.fromTo(
          Array.from(body.children),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: ease.draw,
            scrollTrigger: { trigger: body, start: 'top 85%' },
          }
        )
      )
    }
    if (chips?.length) {
      anims.push(
        gsap.fromTo(
          Array.from(chips),
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.03,
            ease: ease.out,
            scrollTrigger: { trigger: chipsRef.current, start: 'top 88%' },
          }
        )
      )
    }
    return () => {
      for (const anim of anims) {
        anim.scrollTrigger?.kill()
        anim.kill()
      }
    }
  }, [])

  return (
    <section id="about" className="section">
      <SectionHeading index="02" label="About" title="Built under pressure" />

      <div ref={statsRef} className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat" style={{ opacity: 0 }}>
            <p className="stat__value">
              <span className="stat__num" data-value={stat.value}>
                00
              </span>
              <span className="stat__suffix">{stat.suffix}</span>
            </p>
            <p className="mono-label">{stat.label}</p>
          </div>
        ))}
      </div>

      <div ref={bodyRef} className="about-grid">
        <p className="about-copy" style={{ opacity: 0 }}>
          Three years in iGaming taught me to ship production canvas work under pressure — PixiJS
          UIs for live products, international clients, real deadlines. I'm based in Kent, available
          now, and looking for a team that still cares how it's built.
        </p>

        <p className="about-copy" style={{ opacity: 0 }}>
          Outside work, I build to learn. Across personal projects I've pushed into full-stack
          territory — Supabase auth with Google OAuth, PostgreSQL with row-level security, and Deno
          edge functions for server-side validation. I've integrated the Claude API to generate live
          PixiJS scenes from natural language, consumed REST APIs with typed error handling and
          rate-limit recovery, and shipped a generic object-pooled game engine as a standalone npm
          package. Vitest for real test coverage, Sentry for production observability — the same
          standards I'd apply on a team.
        </p>
      </div>

      <div ref={chipsRef} className="skills-block">
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
                <span key={skill} className="tag-chip skill-chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
