import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'asteroid-blaster',
    title: 'Asteroid Blaster',
    year: '2026',
    description:
      'Browser arcade game built with PixiJS v8, distributed as a standalone npm package. Zustand manages game phase (menu → playing → paused → game over), score, lives, and a localStorage-persisted high score. Entities — asteroids, bullets, particles — extend a typed base interface; a generic ObjectPool<T extends { active: boolean }> reuses instances to avoid GC pressure. Alpha-decaying particle explosions, screen shake, and thruster visuals throughout.',
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
      'AI-powered PixiJS scene generator. Describe a scene in natural language and Claude returns a structured JSON definition rendered live — elements typed as a discriminated union (particles, circles, orbits, lines, text), each handled by a dedicated renderer. Session history stores up to 8 generated scenes; select two and a remix concatenates their prompts to produce a new composition.',
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
      'Side-by-side GitHub profile comparison. Queries the REST API in parallel for two users — bio, follower counts, top-starred repos, and language breakdown. Rate-limit responses are intercepted and the X-RateLimit-Reset header parsed into a typed RateLimitError surfaced to the UI. Column state is a discriminated union (empty → loading → loaded | notFound | error) with conditional narrowing throughout.',
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
