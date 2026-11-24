# Portfolio 2026 — James Gardener

[![CI](https://github.com/JGardener/Portfolio2026/actions/workflows/ci.yml/badge.svg)](https://github.com/JGardener/Portfolio2026/actions/workflows/ci.yml)

Personal portfolio site, designed as a 1990s big-box PC game: the box front carries a live Asteroid Blaster as cover art, and every project gets a back-of-box panel with a live PixiJS "screenshot", feature bullets and a System Requirements table. React 19 + TypeScript + Vite, with GSAP for the box turn and a playable PixiJS arcade game in a modal.

## Stack

- **React 19** + **TypeScript** — Vite 8, `moduleResolution: bundler`
- **GSAP 3** + ScrollTrigger — the box-turn interaction and the game modal
- **PixiJS v8** — live cover art, project thumbnails, and the full Asteroid Blaster game
- **Tailwind CSS v4** — utility layer on top of a CSS custom-property design system
- **Fonts** — Bowlby One (display), Archivo Variable (body and small print)

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
| Box front: live cover art, PLAY NOW, Turn it over | `#top` |
| Back cover: intro and "In this box" contents | `#inside` |
| Work: one back-of-box panel per project | `#work` |
| Experience: credits page | `#experience` |
| Contact: publisher strip | `#contact` |

## Project

[github.com/JGardener](https://github.com/JGardener) · [linkedin.com/in/jamesgardener92](https://www.linkedin.com/in/jamesgardener92)
