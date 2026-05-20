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
    liveUrl: 'https://jgardener-visio.vercel.app/',
    featured: true,
  },
  {
    id: 'project-3',
    title: 'GithubDashboard',
    year: '2026',
    description:
      'A Github profile comparison app; input two Github profiles and compare follows, followers, repo counts and languages used.',
    tags: ['React', 'Typescript', 'API'],
    githubUrl: 'https://github.com/JGardener/GithubDashboard',
    liveUrl: 'https://jgardener-githubdashboard.vercel.app',
    featured: true,
  },
  {
    id: 'project-4',
    title: 'Perks',
    year: '2026',
    description:
      "A WIP full-stack application that allows users to peruse and rate both Survivor and Killer perks from the acclaimed video game 'Dead By Daylight'. Log in to store your builds and ratings.",
    tags: ['React', 'Typescript', 'Supabase', 'API'],
    featured: true,
  },
]
