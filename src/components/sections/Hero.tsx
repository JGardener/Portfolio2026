import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from '../../lib/gsap'
import { initPixiHero } from '../../lib/pixiHero'

interface HeroProps {
  loaded: boolean
}

export default function Hero({ loaded }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const introRef = useRef<HTMLDivElement>(null)

  // WebGL particle field + scroll-scrubbed dispersal.
  useEffect(() => {
    const host = canvasHostRef.current
    const section = sectionRef.current
    if (!host || !section) return

    const hero = initPixiHero(host)
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => hero.setScatter(self.progress),
    })

    return () => {
      trigger.kill()
      hero.destroy()
    }
  }, [])

  // Entrance — fires once the loader finishes.
  useEffect(() => {
    if (!loaded) return
    const intro = introRef.current
    const name = nameRef.current
    if (!intro || !name) return

    const fadeEls = Array.from(intro.querySelectorAll<HTMLElement>('[data-hero-fade]'))

    if (prefersReducedMotion()) {
      gsap.set([name, ...fadeEls], { opacity: 1, y: 0 })
      return
    }

    let cancelled = false
    let split: SplitText | null = null
    let tl: gsap.core.Timeline | null = null

    document.fonts.ready.then(() => {
      if (cancelled) return
      // 'words,chars' keeps whole words as wrap units so the name never
      // breaks mid-word on narrow viewports.
      split = new SplitText(name, { type: 'words,chars', mask: 'chars' })
      tl = gsap.timeline()
      tl.set(name, { opacity: 1 })
        .fromTo(
          split.chars,
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9, stagger: 0.035, ease: 'power4.out' }
        )
        .fromTo(
          fadeEls,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out' },
          '-=0.5'
        )
    })

    return () => {
      cancelled = true
      tl?.kill()
      split?.revert()
    }
  }, [loaded])

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        overflow: 'hidden',
        backgroundColor: 'var(--bg)',
      }}
    >
      <h1 className="sr-only">James Gardener — Creative frontend developer</h1>

      {/* WebGL particle field — words morph in the centre */}
      <div
        ref={canvasHostRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Dark vignette — hidden in light theme via CSS */}
      <div
        aria-hidden="true"
        className="hero-vignette"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,15,0.8) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div ref={introRef} style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
        {/* Top-center eyebrow pill */}
        <div data-hero-fade className="hero-pill" style={{ opacity: 0 }}>
          // Portfolio · 2026
        </div>

        <div className="hero-anchor-l" style={{ pointerEvents: 'auto' }}>
          <p data-hero-fade className="mono-label" style={{ marginBottom: '12px', opacity: 0 }}>
            ↳ 01 · Hello, I'm
          </p>
          <h2
            ref={nameRef}
            aria-hidden="true"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(34px, 5.5vw, 84px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.02,
              color: 'var(--text)',
              marginBottom: '14px',
              opacity: 0,
            }}
          >
            James Gardener
          </h2>
          <p
            data-hero-fade
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(15px, 1.1vw, 20px)',
              lineHeight: 1.6,
              color: 'var(--text-dim)',
              maxWidth: '460px',
              opacity: 0,
            }}
          >
            Creative frontend developer — React, TypeScript, PixiJS &amp; GSAP.
            <br />
            I build the parts that move.
          </p>
        </div>

        {/* Scroll cue */}
        <div data-hero-fade id="hero-scroll-cue" aria-hidden="true" className="hero-scroll-cue" style={{ opacity: 0 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--fs-xs)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-mute)',
            }}
          >
            Scroll
          </span>
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ animation: 'scroll-bob 2s ease-in-out infinite', color: 'var(--text-mute)' }}
          >
            <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div data-hero-fade className="hero-anchor-r" style={{ pointerEvents: 'auto', opacity: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '6px',
              marginBottom: '4px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                display: 'inline-block',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--fs-label)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-dim)',
              }}
            >
              Available · 2026
            </span>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--fs-xs)',
              color: 'var(--text-mute)',
              letterSpacing: '0.06em',
              marginBottom: '8px',
            }}
          >
            Kent, UK · Remote
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <a
              href="https://github.com/JGardener"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (opens in new tab)"
              className="link-draw"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--fs-xs)',
                color: 'var(--text-mute)',
              }}
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/jamesgardener92"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (opens in new tab)"
              className="link-draw"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--fs-xs)',
                color: 'var(--text-mute)',
              }}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
