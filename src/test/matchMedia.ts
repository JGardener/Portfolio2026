import { vi } from 'vitest'

/**
 * jsdom has no `window.matchMedia`. Install a stub whose `matches` is decided
 * per query, e.g. `mockMatchMedia((q) => q.includes('prefers-reduced-motion'))`.
 */
export function mockMatchMedia(matches: (query: string) => boolean) {
  const impl = vi.fn((query: string) => ({
    matches: matches(query),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }))
  Object.defineProperty(window, 'matchMedia', { writable: true, configurable: true, value: impl })
  return impl
}
