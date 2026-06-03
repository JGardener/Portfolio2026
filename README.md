# Portfolio 2026 — James Gardener

Personal portfolio site. React 19 + TypeScript + Vite, with GSAP animations, a canvas particle system, and a playable PixiJS arcade game embedded as a modal.

## Stack

- **React 19** + **TypeScript** — Vite 8, `moduleResolution: bundler`
- **GSAP 3** + ScrollTrigger — all scroll-driven and timeline animations
- **PixiJS v8** — live asteroid thumbnail and the full Asteroid Blaster game
- **Tailwind CSS v4** — utility layer on top of a CSS custom-property design system
- **Fonts** — Inter (body), Syne (display), JetBrains Mono (labels/mono)

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint     # ESLint
npm run preview  # serve the production build
```

### Asteroid Blaster dependency

The game component is vendored as a local package at `packages/asteroid-blaster/` (`file:./packages/asteroid-blaster` in `package.json`). The pre-built `dist/` is committed to this repo, so a plain `npm install` is all that's needed — no separate clone or build step.

**Updating to a new version:** a `post-commit` hook in the [AsteroidBlaster repo](https://github.com/JGardener/asteroid-blaster) handles this automatically. After every commit there it builds the package, copies the fresh `dist/` into `packages/asteroid-blaster/dist/`, and commits and pushes the result here.

To update manually:
```bash
# inside C:\Code\AsteroidBlaster
npm run build
# then copy dist/* into packages\asteroid-blaster\dist\ and commit
```

## Sections

| Section | ID |
|---|---|
| Hero — particle field + SVG wordmark | `#hero` |
| Work — project list with live PixiJS thumbnails | `#work` |
| About — skills grid | `#about` |
| Experience — timeline | `#experience` |
| Contact — email + social links | `#contact` |

## Project

[github.com/JGardener](https://github.com/JGardener) · [linkedin.com/in/jamesgardener92](https://www.linkedin.com/in/jamesgardener92)
