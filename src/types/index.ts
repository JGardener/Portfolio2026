export interface Project {
  id: string
  title: string
  year: string
  description: string
  tags: string[]
  caseStudyUrl?: string
  githubUrl?: string
  featured: boolean
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

export interface AppState {
  theme: Theme
  particleDensity: number
  motionScale: number
}
