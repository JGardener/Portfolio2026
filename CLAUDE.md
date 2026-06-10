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

All GSAP usage must import from `src/lib/gsap.ts`, never directly from `gsap`. That module registers `ScrollTrigger` and `SplitText` once, exports named easing constants (`ease.out`, `ease.inOut`, `ease.draw`, `ease.soft`), and exports `prefersReducedMotion()`. Every component that animates checks `prefersReducedMotion()` first and `gsap.set`s the final state instead when it returns true.

Every `useEffect` that creates a GSAP animation must return a cleanup that calls `.kill()` on the animation and `.kill()` on its `scrollTrigger`. The `useScrollReveal` hook (`src/hooks/useScrollReveal.ts`) handles the common fade-up pattern — use it before reaching for a raw GSAP call.

SplitText reveals (hero name, contact headline) must wait on `document.fonts.ready` before splitting, and call `split.revert()` in cleanup.

### Hero particle system

`src/lib/pixiHero.ts` runs a PixiJS v8 `Application` with a single `ParticleContainer` (`dynamicProperties: { position, color }`) inside the hero. ~450–2400 particles (scaled by viewport area) spring toward letterform targets sampled from an offscreen 2D canvas, cycling through the words JG → REACT → TYPESCRIPT → PIXIJS → GSAP → WEBGL every 3 s, with pointer repulsion and an ambient parallax starfield behind. Tints follow the `--accent` token and re-resolve on `data-theme` mutation.

`initPixiHero(host)` returns a handle: `setScatter(0..1)` (wired to a scrubbed ScrollTrigger in `Hero.tsx` so the field disperses as the hero scrolls out) and `destroy()` which must be called on unmount. The ticker pauses via IntersectionObserver when the hero is offscreen. Under `prefers-reduced-motion` the field renders statically on "JG" with no morphing or repulsion.

### Shared section pieces

- `SectionHeading` (`src/components/ui/SectionHeading.tsx`) — mono eyebrow + clip-path-wiped display title; use it for every section header so numbering/treatment stays consistent (01 Work, 02 About, 03 Experience, 04 Contact).
- `Marquee` (`src/components/ui/Marquee.tsx`) — infinite skills ticker (two duplicated groups slid −50%), scroll-velocity boosts its `timeScale`. Rendered twice in `App.tsx` (`reverse` flips direction).
- `Loader` counts 000→100 with a progress bar, then slides up; `App` passes `loaded` into `Hero` to gate the SplitText entrance.

### Work section thumbnails

`Work.tsx` renders each project as a `.showcase` row (alternating panel/info sides via `:nth-child(even)`, stacking on mobile) with a ghost index numeral and a scroll-scrubbed parallax on the thumb. It uses a `thumbRegistry` (a `Record<string, ComponentType>`) that maps project IDs to thumbnail components (live Pixi mini-scenes in `src/components/ui/`). When adding a new project with a custom thumbnail, add the component there and register it by `project.id` in `thumbRegistry`. Projects with `hasGame: true` render `GameThumb` instead and wire up the `onPlayGame` callback. Thumbs render at their native 200×120 and are scaled up by `--tscale` on `.showcase__thumb-inner`.

### Custom cursor

`LensCursor` (`src/components/layout/LensCursor.tsx`) provides a circular backdrop-filter lens that replaces the default cursor. Global CSS sets `cursor: none` on all elements; `LensCursor` is hidden on touch devices via `@media (hover: none)`. The lens expands on hover over `a` and `button` elements.

### Game modal

`GameModal` renders the `AsteroidBlaster` component (from the `asteroid-blaster` npm package) inside a GSAP-animated portal. It receives an `onClose` callback that triggers the exit animation before unmounting.

### Updating asteroid-blaster

The package lives as a vendored local dependency at `packages/asteroid-blaster/` (referenced via `file:` in `package.json`). The source of truth is the separate repo at `C:\Code\AsteroidBlaster`.

A `post-commit` hook in that repo handles the full update automatically: after every commit it runs `npm run build`, wipes `packages/asteroid-blaster/dist/`, copies the fresh build output in, then commits and pushes the portfolio repo with the message `chore: update asteroid-blaster dist to <version>`.

To update manually (e.g. if the hook didn't run):
1. Build inside `C:\Code\AsteroidBlaster` — `npm run build`
2. Copy `C:\Code\AsteroidBlaster\dist\*` into `packages\asteroid-blaster\dist\`, replacing all existing files
3. Also update the `version` field in `packages\asteroid-blaster\package.json` to match
4. Commit and push

## CSS design tokens

All colours, spacing radii, shadows, and easing curves are CSS custom properties defined in `index.css` under `:root` (dark theme defaults) and overridden under `[data-theme="light"]`. Always use these tokens (`var(--bg)`, `var(--accent)`, `var(--font-mono)`, etc.) rather than hardcoded values. Tailwind is available for utility classes but the design system is token-first.

Reusable CSS classes defined in `index.css`: `.section` (page section padding/max-width), `.mono-label` (uppercase mono label style), `.work-row` (project list grid), `.mono-btn`, `.link-draw`, `.cta-primary`.

## Agent skills

### Issue tracker

Issues live in GitHub Issues for this repo. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical label strings are used as-is. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context repo: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
