import { useEffect } from 'react'
import { gsap } from '../../lib/gsap'
import { initHeroParticles } from '../../lib/heroParticles'
import HeroSVG from './HeroSVG'

export default function Hero() {
  useEffect(() => {
    let cleanup: (() => void) | undefined
    const timer = setTimeout(() => {
      cleanup = initHeroParticles()
    }, 100)
    return () => {
      clearTimeout(timer)
      cleanup?.()
    }
  }, [])

  useEffect(() => {
    gsap.fromTo(
      '#hero-svg-wrapper svg text',
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.4,
        delay: 0.25,
        ease: 'power3.out',
      }
    )
  }, [])

  useEffect(() => {
    gsap.fromTo(
      '#hero-scroll-cue',
      { opacity: 0 },
      { opacity: 1, duration: 0.8, delay: 1.6, ease: 'power2.out' }
    )

    const hero = document.getElementById('hero')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          gsap.to('#hero-scroll-cue', { opacity: 0, duration: 0.4 })
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="hero"
      aria-label="Hero"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'min(100vh, 1080px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'var(--bg)',
      }}
    >
      <h1 className="sr-only">James Gardener — Developer building interactive things</h1>

      {/* Background ambient particle field */}
      <canvas
        id="hero-canvas"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
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

      {/* SVG wordmark + clipped letter canvas */}
      <div id="hero-svg-wrapper" style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <HeroSVG />
      </div>

      {/* Top-center eyebrow pill */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          padding: '4px 12px',
          border: '1px solid var(--line-2)',
          borderRadius: '999px',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--fs-label)',
          fontWeight: 500,
          letterSpacing: '0.08em',
          color: 'var(--text-mute)',
          whiteSpace: 'nowrap',
          backgroundColor: 'var(--bg-1)',
        }}
      >
        // Portfolio · 2026
      </div>

      <div className="hero-anchor-l">
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--fs-label)',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-mute)',
            marginBottom: '8px',
          }}
        >
          ↳ 01 · Hello
        </p>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(18px, 2vw, 32px)',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '4px',
          }}
        >
          James Gardener
        </p>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--fs-body)',
            lineHeight: 1.6,
            color: 'var(--text-dim)',
            maxWidth: '380px',
          }}
        >
          Frontend developer. React, TypeScript, PixiJS — I build the parts that move.
        </p>
      </div>

      {/* Scroll cue — fades in after entrance, fades out when hero leaves viewport */}
      <div
        id="hero-scroll-cue"
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
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

      <div className="hero-anchor-r">
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
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--fs-xs)',
              color: 'var(--text-mute)',
              textDecoration: 'none',
            }}
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/jamesgardener92"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn (opens in new tab)"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--fs-xs)',
              color: 'var(--text-mute)',
              textDecoration: 'none',
            }}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}
