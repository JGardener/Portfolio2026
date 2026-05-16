export interface Project {
  id: string
  title: string
  year: string
  description: string
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
