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
