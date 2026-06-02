import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'asteroid-blaster',
    title: 'Asteroid Blaster',
    year: '2026',
    description:
      'Browser arcade game built with PixiJS v8, distributed as a standalone npm package. Zustand manages five game phases (menu, playing, transitioning, paused, gameover), score, lives, level, and a localStorage-persisted high score. All entities — asteroids (three sizes), UFOs, bullets, pickups, and particles — extend a typed base interface; a generic ObjectPool<T extends { active: boolean }> reuses every pool to avoid GC pressure. Level progression scales asteroid count, movement speed (capped at 2×), and UFO spawn frequency and targeting accuracy (30% → 85%). Three timed power-ups drop on kills: SpreadShot (3-way ±15° spread), RapidFire (halved cooldown), and Shield. A Web Audio API engine synthesises procedural SFX — pitch-scaled explosions by asteroid size, distinct UFO and pickup cues — plus a scheduled music loop whose tempo tightens each level.',
    tags: ['React', 'Typescript', 'PixiJS', 'Zustand', 'Web Audio API'],
    githubUrl: 'https://github.com/JGardener/asteroid-blaster',
    featured: true,
    hasGame: true,
  },
  {
    id: 'project-2',
    title: 'VISIO',
    year: '2026',
    description:
      'AI-powered PixiJS scene generator. Describe a scene in natural language and Claude streams a structured JSON definition back via a serverless API route — seven element types (particles, circles, orbits, lines, text, waves, and trails) form a discriminated union dispatched to dedicated renderers, with the raw JSON visible as it builds. Four named colour palettes (Neon, Ember, Ocean, Galaxy) override scene colours at runtime; a speed multiplier adjusts animation tempo. History stores up to 8 generated scenes in localStorage; select two and a remix concatenates their prompts for a new composition. Completed scenes export as PNG.',
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
