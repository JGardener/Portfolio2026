import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'asteroid-blaster',
    title: 'Asteroid Blaster',
    year: '2026',
    description:
      'Browser arcade game built with PixiJS v8. Object pooling, typed state machine, particle explosions — playable inline.',
    tags: ['React', 'Typescript', 'PixiJS', 'Zustand'],
    githubUrl: 'https://github.com/JGardener/asteroid-blaster',
    featured: true,
    hasGame: true,
  },
  {
    id: 'project-2',
    title: 'VISIO',
    year: '2026',
    description:
      "An AI and PixiJS application; create scenes rendered by PIXI using your own or preconfigured prompts! Once you've created some scenes, remix them together!",
    tags: ['React', 'Typescript', 'PixiJS', 'Claude AI'],
    githubUrl: 'https://github.com/JGardener/VISIO',
    featured: true,
  },
]
