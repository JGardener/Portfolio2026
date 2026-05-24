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
    title: 'The Bloodweb',
    year: '2026',
    description:
      'Dead by Daylight perk rater, build maker, and community tier-list. React and TypeScript frontend with SCSS component styling; Supabase for email and Google OAuth auth backed by PostgreSQL with row-level security. A Deno edge function handles server-side build validation. Ratings are offline-first — localStorage for guests, auto-migrated to Supabase on sign-in. Builds share via URL and export as Canvas-rendered PNG. Tested with Vitest and React Testing Library; Sentry tracks errors and session replays in production.',
    tags: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Deno', 'Sentry', 'Vitest', 'Canvas API', 'SCSS', 'Google OAuth'],
    githubUrl: 'https://github.com/JGardener/Perks',
    liveUrl: 'https://jgardener-the-bloodweb.vercel.app',
    featured: true,
  },
]
