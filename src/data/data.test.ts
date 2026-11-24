import { describe, expect, it } from 'vitest'
import { projects } from './projects'
import { experiences } from './experience'

const nonEmpty = (s: string | undefined) => typeof s === 'string' && s.trim().length > 0

describe('projects data', () => {
  it('has unique ids', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
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
