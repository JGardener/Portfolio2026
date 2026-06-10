import { useEffect, useRef } from 'react'
import { gsap, ease, SplitText, prefersReducedMotion } from '../../lib/gsap'

export default function Contact() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const restRef = useRef<HTMLDivElement>(null)
  const magnetRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  // Headline word reveal + supporting content fade.
  useEffect(() => {
    const title = titleRef.current
    const rest = restRef.current
    if (!title || !rest) return

    if (prefersReducedMotion()) {
      gsap.set([title, ...Array.from(rest.children)], { opacity: 1, y: 0 })
      return
    }

    let cancelled = false
    let split: SplitText | null = null
    let tl: gsap.core.Timeline | null = null

    document.fonts.ready.then(() => {
      if (cancelled) return
      split = new SplitText(title, { type: 'words', mask: 'words' })
      tl = gsap.timeline({
        scrollTrigger: { trigger: title, start: 'top 85%' },
      })
      tl.set(title, { opacity: 1 })
        .fromTo(
          split.words,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.8, stagger: 0.08, ease: 'power4.out' }
        )
        .fromTo(
          Array.from(rest.children),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: ease.draw },
          '-=0.4'
        )
    })

    return () => {
      cancelled = true
      tl?.scrollTrigger?.kill()
      tl?.kill()
      split?.revert()
    }
  }, [])

  // Magnetic pull on the email CTA.
  useEffect(() => {
    const zone = magnetRef.current
    const cta = ctaRef.current
    if (!zone || !cta || prefersReducedMotion()) return
    if (window.matchMedia('(hover: none)').matches) return

    const xTo = gsap.quickTo(cta, 'x', { duration: 0.4, ease: 'power3.out' })
    const yTo = gsap.quickTo(cta, 'y', { duration: 0.4, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      const r = zone.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * 0.25)
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35)
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }
    zone.addEventListener('mousemove', onMove)
    zone.addEventListener('mouseleave', onLeave)
    return () => {
      zone.removeEventListener('mousemove', onMove)
      zone.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section id="contact" className="section" style={{ textAlign: 'center', position: 'relative' }}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(700px, 100%)',
          height: 'min(460px, 70vw)',
          background: 'radial-gradient(ellipse, var(--accent-faint) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <p className="mono-label" style={{ marginBottom: '24px' }}>
          // 04 — Contact
        </p>

        <h2
          ref={titleRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 7vw, 110px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'var(--text)',
            marginBottom: 'clamp(32px, 4vw, 56px)',
            opacity: 0,
          }}
        >
          Let's build something.
        </h2>

        <div ref={restRef}>
          <div ref={magnetRef} className="contact-magnet" style={{ opacity: 0 }}>
            <a ref={ctaRef} href="mailto:jamesgardener92@gmail.com" className="contact-cta">
              jamesgardener92@gmail.com
              <span aria-hidden="true" className="contact-cta__arrow">→</span>
            </a>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '32px',
              marginTop: '48px',
              opacity: 0,
            }}
          >
            <a
              href="https://github.com/JGardener"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (opens in new tab)"
              className="contact-link link-draw"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/jamesgardener92"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (opens in new tab)"
              className="contact-link link-draw"
            >
              LinkedIn
            </a>
            <a
              href="https://drive.google.com/file/d/11X5hGT0fusSBq31cH1yG9Znybu5s_Yu9/view?usp=sharing"
              download
              aria-label="Download CV (PDF)"
              className="contact-link link-draw"
            >
              Download CV
            </a>
          </div>

          <footer className="contact-footer" style={{ opacity: 0 }}>
            <span>© 2026 James Gardener</span>
            <span>Built with React · TypeScript · PixiJS · GSAP</span>
            <span>Kent, UK</span>
          </footer>
        </div>
      </div>
    </section>
  )
}
