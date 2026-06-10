import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap'

const ITEMS = [
  'React',
  'TypeScript',
  'PixiJS',
  'GSAP',
  'WebGL',
  'Zustand',
  'Node',
  'Supabase',
  'Tailwind',
  'Vitest',
]

interface MarqueeProps {
  reverse?: boolean
}

/**
 * Infinite skills ticker. The track holds two identical groups; sliding
 * by 50% loops seamlessly. Scroll velocity nudges the playback speed.
 */
export default function Marquee({ reverse = false }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track || prefersReducedMotion()) return

    const tween = gsap.fromTo(
      track,
      { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, duration: 28, ease: 'none', repeat: -1 }
    )

    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        const boost = Math.min(Math.abs(self.getVelocity()) / 1200, 3)
        gsap.to(tween, { timeScale: 1 + boost, duration: 0.2, overwrite: true })
        gsap.to(tween, { timeScale: 1, duration: 0.8, delay: 0.2, overwrite: false })
      },
    })

    return () => {
      trigger.kill()
      tween.kill()
    }
  }, [reverse])

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" ref={trackRef}>
        {[0, 1].map((copy) => (
          <div className="marquee__group" key={copy}>
            {ITEMS.map((item) => (
              <span key={item} className="marquee__item">
                {item}
                <span className="marquee__sep">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
