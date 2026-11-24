import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { mockMatchMedia } from './matchMedia'

// Default: no media queries match (motion allowed, dark scheme irrelevant).
mockMatchMedia(() => false)

afterEach(() => {
  cleanup()
  mockMatchMedia(() => false)
})
