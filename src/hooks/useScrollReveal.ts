import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, ease } from '../lib/gsap'

interface ScrollRevealOptions {
  delay?: number
  duration?: number
  y?: number
  stagger?: number
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const ref = useRef<HTMLElement>(null)
  const optsRef = useRef(options)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const { y = 40, duration = 0.9, delay = 0 } = optsRef.current

    const anim = gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: ease.draw,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    )

    return () => {
      anim.scrollTrigger?.kill()
    }
  }, [])

  return ref
}

export type { ScrollRevealOptions }
// Re-export so consumers can import ScrollTrigger from here too
export { ScrollTrigger }
