import { describe, expect, it } from 'vitest'
import { mockMatchMedia } from '../test/matchMedia'
import { ease, prefersReducedMotion } from './gsap'

describe('prefersReducedMotion', () => {
  it('returns true when the user has requested reduced motion', () => {
    const matchMedia = mockMatchMedia((q) => q === '(prefers-reduced-motion: reduce)')
    expect(prefersReducedMotion()).toBe(true)
    expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })

  it('returns false when no motion preference is set', () => {
    mockMatchMedia(() => false)
    expect(prefersReducedMotion()).toBe(false)
  })
})

describe('ease tokens', () => {
  it('are all valid CSS cubic-bezier curves', () => {
    for (const curve of Object.values(ease)) {
      expect(curve).toMatch(/^cubic-bezier\((-?\d*\.?\d+,\s*){3}-?\d*\.?\d+\)$/)
    }
  })
})
