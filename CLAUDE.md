# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start Vite dev server with HMR
npm run build      # tsc type-check then Vite production build
npm run lint       # ESLint across all files
npm run preview    # serve the production build locally
```

There is no test runner configured.

## Stack

- **React 19** + **TypeScript** (~6.0), bundled with **Vite 8**
- **Tailwind CSS v4** (imported via `@import "tailwindcss"` in `index.css`)
- **GSAP 3** with ScrollTrigger for all scroll-driven and timeline animations
- **PixiJS v8** (`pixi.js`) — used inside the `asteroid-blaster` npm package rendered in the game modal
- Fonts: Inter (body), Syne (display headings), JetBrains Mono (mono/labels) — all via `@fontsource/*`

## Architecture

### Data flow

`main.tsx` → `App.tsx` owns three pieces of global state: `theme` (dark/light, persisted to `localStorage` and applied as `data-theme` on `<html>`), `loaded` (controls the intro `Loader`), and `gameOpen` (controls `GameModal`). Everything else is stateless.

Static content lives in `src/data/`:
- `projects.ts` — array of `Project` objects rendered by the `Work` section
- `experience.ts` — array of `ExperienceEntry` objects rendered by the `Experience` section

Shared types are in `src/types/index.ts` (`Project`, `ExperienceEntry`, `Theme`).

### Animation conventions

All GSAP usage must import from `src/lib/gsap.ts`, never directly from `gsap`. That module registers `ScrollTrigger` once and exports named easing constants (`ease.out`, `ease.inOut`, `ease.draw`, `ease.soft`) that should be used throughout instead of inline cubic-bezier strings.

Every `useEffect` that creates a GSAP animation must return a cleanup that calls `.kill()` on the animation and `.kill()` on its `scrollTrigger`. The `useScrollReveal` hook (`src/hooks/useScrollReveal.ts`) handles the common fade-up pattern — use it before reaching for a raw GSAP call.

### Hero particle system

`src/lib/heroParticles.ts` manages two `<canvas>` elements rendered inside `HeroSVG.tsx`:
- `#hero-canvas` — sparse ambient background field with linked particles and mouse repulsion
- `#hero-letter-canvas` — dense bright field clipped by an SVG `<clipPath>` to the "JG" letterforms

`initHeroParticles()` returns a cleanup function that must be called on unmount. It is invoked from `Hero.tsx` with a 100 ms delay to let the DOM settle.

### Work section thumbnails

`Work.tsx` uses a `thumbRegistry` (a `Record<string, ComponentType>`) that maps project IDs to inline SVG thumbnail components from `src/components/ui/ProjectThumb.tsx`. When adding a new project with a custom thumbnail, add the component there and register it by `project.id` in `thumbRegistry`. Projects with `hasGame: true` render `GameThumb` instead and wire up the `onPlayGame` callback.

### Custom cursor

`LensCursor` (`src/components/layout/LensCursor.tsx`) provides a circular backdrop-filter lens that replaces the default cursor. Global CSS sets `cursor: none` on all elements; `LensCursor` is hidden on touch devices via `@media (hover: none)`. The lens expands on hover over `a` and `button` elements.

### Game modal

`GameModal` renders the `AsteroidBlaster` component (from the `asteroid-blaster` npm package) inside a GSAP-animated portal. It receives an `onClose` callback that triggers the exit animation before unmounting.

## CSS design tokens

All colours, spacing radii, shadows, and easing curves are CSS custom properties defined in `index.css` under `:root` (dark theme defaults) and overridden under `[data-theme="light"]`. Always use these tokens (`var(--bg)`, `var(--accent)`, `var(--font-mono)`, etc.) rather than hardcoded values. Tailwind is available for utility classes but the design system is token-first.

Reusable CSS classes defined in `index.css`: `.section` (page section padding/max-width), `.mono-label` (uppercase mono label style), `.work-row` (project list grid), `.mono-btn`, `.link-draw`, `.cta-primary`.
