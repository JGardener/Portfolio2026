import { describe, expect, it } from 'vitest'
import { projects } from './projects'
import { experiences } from './experience'

const nonEmpty = (s: string | undefined) => typeof s === 'string' && s.trim().length > 0

describe('projects data', () => {
  it('has unique ids', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every project a title, year, description and at least one tag', () => {
    for (const p of projects) {
      expect(nonEmpty(p.title), `${p.id} title`).toBe(true)
      expect(p.year, `${p.id} year`).toMatch(/^\d{4}$/)
      expect(nonEmpty(p.description), `${p.id} description`).toBe(true)
      expect(p.tags.length, `${p.id} tags`).toBeGreaterThan(0)
      expect(new Set(p.tags).size, `${p.id} duplicate tags`).toBe(p.tags.length)
    }
  })

  it('only links to absolute https URLs', () => {
    for (const p of projects) {
      for (const url of [p.githubUrl, p.liveUrl, p.caseStudyUrl]) {
        if (url !== undefined) expect(url, p.id).toMatch(/^https:\/\/\S+$/)
      }
    }
  })

  it('has exactly one playable game project', () => {
    expect(projects.filter((p) => p.hasGame)).toHaveLength(1)
  })
})

describe('experience data', () => {
  it('has unique ids and all required fields', () => {
    const ids = experiences.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const e of experiences) {
      expect(nonEmpty(e.role) && nonEmpty(e.company) && nonEmpty(e.period), e.id).toBe(true)
      expect(nonEmpty(e.description), e.id).toBe(true)
      expect(e.tags.length, e.id).toBeGreaterThan(0)
    }
  })
})
