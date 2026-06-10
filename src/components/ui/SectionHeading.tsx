import { useEffect, useRef } from 'react'
import { gsap, ease, prefersReducedMotion } from '../../lib/gsap'

interface SectionHeadingProps {
  index: string
  label: string
  title: string
  sub?: string
}

/**
 * Shared section header: mono eyebrow + display title revealed with a
 * clip-path wipe on scroll. Keeps every section's intro consistent.
 */
export default function SectionHeading({ index, label, title, sub }: SectionHeadingProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const eyebrow = root.querySelector<HTMLElement>('.section-eyebrow')
    const heading = root.querySelector<HTMLElement>('.section-title')
    const subEl = root.querySelector<HTMLElement>('.section-sub')

    if (prefersReducedMotion()) {
      gsap.set([eyebrow, heading, subEl].filter(Boolean), { opacity: 1, y: 0, clipPath: 'none' })
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top 85%' },
    })
    tl.fromTo(
      eyebrow,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: ease.draw }
    ).fromTo(
      heading,
      { opacity: 0, y: 50, clipPath: 'inset(0 0 100% 0)' },
      { opacity: 1, y: 0, clipPath: 'inset(0 0 -10% 0)', duration: 0.9, ease: ease.draw },
      '-=0.3'
    )
    if (subEl) {
      tl.fromTo(
        subEl,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: ease.draw },
        '-=0.5'
      )
    }

    return () => {
      tl.kill()
      tl.scrollTrigger?.kill()
    }
  }, [])

  return (
    <div ref={rootRef} style={{ marginBottom: 'clamp(48px, 6vw, 88px)' }}>
      <p className="mono-label section-eyebrow" style={{ marginBottom: '20px', opacity: 0 }}>
        // {index} — {label}
      </p>
      <h2 className="section-title" style={{ opacity: 0 }}>
        {title}
      </h2>
      {sub && (
        <p className="section-sub" style={{ opacity: 0 }}>
          {sub}
        </p>
      )}
    </div>
  )
}
