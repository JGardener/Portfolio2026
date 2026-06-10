import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export const ease = {
  out:   'cubic-bezier(0.2, 0.8, 0.2, 1)',
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  draw:  'cubic-bezier(0.16, 1, 0.3, 1)',
  soft:  'cubic-bezier(0.4, 0, 0.6, 1)',
} as const

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export { gsap, ScrollTrigger, SplitText }
