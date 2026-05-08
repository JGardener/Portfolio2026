import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'asteroid-blaster',
    title: 'Asteroid Blaster',
    year: '2026',
    description:
      'Browser arcade game built with PixiJS v8. Object pooling, typed state machine, particle explosions — playable inline.',
    tags: ['PixiJS', 'TypeScript', 'React', 'zustand'],
    githubUrl: 'https://github.com/you/asteroid-blaster',
    featured: true,
    hasGame: true,
  },
  {
    id: 'project-2',
    title: 'Figma → React Design System',
    year: '2025',
    description:
      'Pixel-perfect implementation of a full Figma component library in React and TypeScript.',
    tags: ['React', 'TypeScript', 'Figma'],
    githubUrl: 'https://github.com/you/design-system',
    featured: true,
  },
  {
    id: 'project-3',
    title: 'Browser Game UI',
    year: '2024',
    description:
      'iGaming-style UI layer built on PixiJS with animated sprite sheets and Texture Packer pipeline.',
    tags: ['PixiJS', 'GSAP', 'Texture Packer'],
    featured: true,
  },
]
