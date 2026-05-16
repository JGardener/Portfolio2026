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

The game component lives in a sibling repo at `../AsteroidBlaster` and is referenced as a local package (`file:../AsteroidBlaster`). Before running `npm install` for the first time on a new machine, clone that repo alongside this one and build it:

```bash
# from C:\code (or wherever both repos live side by side)
git clone https://github.com/JGardener/asteroid-blaster AsteroidBlaster
cd AsteroidBlaster
npm install
npm run build
cd ../Portfolio2026
npm install
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
