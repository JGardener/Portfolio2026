export interface Requirement {
  label: string
  value: string
}

export interface Project {
  id: string
  title: string
  year: string
  /** One plain sentence: what it is. */
  tagline: string
  /** Back-of-box feature bullets. Facts only. */
  features: string[]
  /** System Requirements panel: the real stack, grouped. */
  requires: Requirement[]
  tags: string[]
  /** Box sticker for unreleased work, e.g. "In development". */
  status?: string
  /** How it was built: the honest line on agent-directed work. */
  howBuilt?: string
  /** Source exists but is private: no repo link to show. */
  privateRepo?: boolean
  caseStudyUrl?: string
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  hasGame?: boolean
}

export interface ExperienceEntry {
  id: string
  role: string
  company: string
  period: string
  description: string
  tags: string[]
}

export type Theme = 'dark' | 'light'
