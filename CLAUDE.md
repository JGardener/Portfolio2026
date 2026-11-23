# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start Vite dev server with HMR
npm run build      # tsc type-check then Vite production build
npm run lint       # ESLint across all files (packages/*/dist is ignored)
npm run preview    # serve the production build locally
```

There is no test runner configured. Append `?edition=light` or `?edition=dark` to the URL to force a theme (handy for screenshots).

## Design source of truth

- `PRODUCT.md`: audience, positioning, the evidence on hand and what must never be claimed. Read it before writing any copy.
- `DESIGN.md` and `.impeccable/design.json`: the visual system (tokens, type, components).
- `.impeccable/surfaces/src-app-tsx.md`: the direction contract for the page.

The site is a **1990s big-box PC game**. The box front shows Asteroid Blaster as live cover art; every project is a back-of-box panel with a live "screenshot", feature bullets and a System Requirements table that is its stack. Keep new work inside that world. Avoid: glows, glassmorphism, gradient text, eyebrow labels above headings, section numbers, loaders, marquees, count-up stats and custom cursors. Those are what the redesign removed.

## Stack

- **React 19** + **TypeScript** (~6.0), bundled with **Vite 8**
- **GSAP 3** with ScrollTrigger: used for the box turn and the game modal only
- **PixiJS v8**: the live cover art, the project thumbnails, and the `asteroid-blaster` game package
- **Tailwind CSS v4** is imported, but the design system is plain CSS custom properties in `src/index.css`
- Fonts via `@fontsource`: **Bowlby One** (display) and **Archivo Variable** (body; the 87.5% width is the "small print" voice)

## Architecture

`main.tsx` → `App.tsx`. App owns two pieces of state: `theme` and `gameOpen`.

- **Theme ("edition").** `index.html` sets `data-theme` on `<html>` before first paint from `localStorage.theme` or `?edition=`, and App reads it back from there. Dark is the *black box*, light the *white box*.
- **Layout.** `Spine` (fixed red spine on the left, a top bar under 768px: nav, JG mark, theme toggle) → `BoxTurn` (box front + back cover) → `Work` (project panels) → `Credits` (Experience) → `Contact` (yellow publisher strip with a barcode). `GameModal` is lazy-loaded.
- **Data.** Content is data-driven: `src/data/projects.ts` and `src/data/experience.ts`, typed in `src/types/index.ts`. A `Project` has `tagline`, `features[]`, `requires[]` (System Requirements rows), plus optional `status` (a pre-release sticker), `howBuilt` (the "How it was built" note for agent-directed work), `privateRepo`, `githubUrl`, `liveUrl` and `hasGame`.

### The box turn (`BoxTurn.tsx`)

The signature interaction. The box front is hinged on the spine. A pinned, scrubbed ScrollTrigger rotates it open (rotateY around its left edge) to reveal the back cover underneath.
- **Turn it over** is a button. It smooth-scrolls to the trigger's end and moves focus to the back-cover heading.
- If the visitor sits idle at the top, a `turn--hint` class plays a CSS hinge peek twice.
- Under `prefers-reduced-motion` there is no pin: front and back simply stack.

### Project panels (`Work.tsx`)

- Each panel takes a tone slot `back--t1…t4` in page order. **The slots are inked per edition in `index.css`:**
  - black box: black, blue, oxblood, red;
  - white box: paper, yellow, blue, red.
  - Tone tokens (`--tone-bg`, `--tone-ink`, `--tone-ink-2`, `--tone-title`, `--tone-mark`, `--tone-frame`, `--btn-*`, `--status-*`) drive everything inside a panel. Check WCAG AA when adding or changing one.
- Titles size to their own column with a container query, so long words never collide with the thumbnail.
- Thumbnails are registered by `project.id` in `thumbRegistry`.

### Live thumbnails (`src/components/ui/*Thumb.tsx`, `CoverArt.tsx`)

Each is a small PixiJS app. Follow the existing pattern exactly:
- a 200×120 logical canvas at `resolution: min(dpr, 2) * 2` with `autoDensity`;
- cancelled/initialized guards around the async `app.init`;
- an IntersectionObserver that pauses the ticker offscreen;
- full destroy on unmount;
- `prefersReducedMotion()` from `src/lib/gsap`, which renders one representative still and never starts the ticker.

Keep them cheap: pool objects, avoid per-frame allocation and filters, and drive animation from `ticker.deltaTime` or elapsed time, never frame counts. `SixfoldThumb` is the heaviest; don't add more like it without checking phone performance.

### Animation conventions

All GSAP imports go through `src/lib/gsap.ts`, never `gsap` directly. It registers ScrollTrigger and SplitText and exports `prefersReducedMotion()`.
- Every GSAP effect checks reduced motion first.
- Every effect returns a cleanup that kills its timeline and ScrollTrigger.
- The page has one authored motion moment (the turn) plus the live thumbnails. Don't add per-section entrance animations.

### Game modal

`GameModal` renders `AsteroidBlaster` from the `asteroid-blaster` package in a portal. It's opened from the PLAY NOW sticker and from the Asteroid Blaster panel. It returns focus to its opener on close.

### Updating asteroid-blaster

The package lives as a vendored local dependency at `packages/asteroid-blaster/` (referenced via `file:` in `package.json`). The source of truth is the separate repo at `C:\Code\AsteroidBlaster`.

A `post-commit` hook in that repo handles the full update automatically: after every commit it runs `npm run build`, wipes `packages/asteroid-blaster/dist/`, copies the fresh build output in, then commits and pushes the portfolio repo with the message `chore: update asteroid-blaster dist to <version>`.

To update manually (e.g. if the hook didn't run):
1. Build inside `C:\Code\AsteroidBlaster` — `npm run build`
2. Copy `C:\Code\AsteroidBlaster\dist\*` into `packages\asteroid-blaster\dist\`, replacing all existing files
3. Also update the `version` field in `packages\asteroid-blaster\package.json` to match
4. Commit and push

## Copy rules

Plain, specific, human. Facts only, from `PRODUCT.md` "Evidence on Hand". For the agent-built projects (DuoEndo, Sixfold, The Giant's Keeper):
- say plainly that James designed, directed and verified the work;
- never imply hand-written C++/HLSL, "shipped", passing CI, or a public repo.

## Agent skills

### Issue tracker

Issues live in GitHub Issues for this repo. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical label strings are used as-is. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context repo: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
