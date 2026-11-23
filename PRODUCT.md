# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hiring managers and technical recruiters, equally from two worlds:

- **iGaming and game-frontend studios** (casino, slots, game-UI teams), who want proof of real-time canvas craft.
- **React/TypeScript product companies**, who want proof of shipped, working apps and engineering judgment.

They scan portfolios quickly on a laptop or desktop, usually comparing tabs. They want signal fast: can this person build real things, do they have taste, and would I trust them with a production UI?

## Product Purpose

James Gardener's personal portfolio, which he uses to land his next frontend role. Success means a hiring manager reaches the end, opens a project (or plays the game), and gets in touch. The portfolio is itself a demonstration of the craft it claims.

## Positioning

Both halves in one person: 3+ years shipping React, TypeScript and PixiJS/canvas UIs to live iGaming products that reached players through operators including Bet365, Lottomatica, Kaizen and FanDuel, **plus** production-grade React/TS apps of his own (auth, databases, edge functions, tests, error tracking). Few frontend portfolios can truthfully show real-time canvas work *and* product engineering side by side.

## Operating Context

- Visitors usually arrive from a job application, a recruiter's message or a LinkedIn profile. They compare it against other candidates' sites.
- The CV is the companion document. The current version is `CVOctoberEdit.pdf` (in the code-vault jobsearch sources), and the site may offer it as a download.
- Each project links out to its GitHub repo and, where one exists, a live deployment on Vercel.

## Capabilities and Constraints

- Single-page React 19 + TypeScript + Vite 8 site with GSAP and PixiJS v8 (see README.md and CLAUDE.md).
- **Playable Asteroid Blaster** is embedded in a modal. The game is a vendored local package (`packages/asteroid-blaster`) and must keep working.
- **Live project thumbnails** are rendered in code: GameThumb, VISIOThumb, BloodwebThumb and GithubHeatmapThumb.
- **Light and dark themes**, toggled by the visitor and persisted.
- Content is data-driven from `src/data/projects.ts` and `src/data/experience.ts`.
- Incentive Games job title: present it as **Frontend Developer**, matching the current CV. (The contract title was Junior Software Developer; James states it plainly if asked, and the site doesn't need to show it.)

## Brand Commitments

- Voice: confident without being loud. Plain, human and specific; no spec-sheet paragraphs, no hype.
- Personality: clean, professional, fluid. Motion is there to prove craft, never to decorate.
- Name: James Gardener. Links: github.com/JGardener and linkedin.com/in/jamesgardener92.

## Evidence on Hand

- Four side projects with repos and (except Asteroid Blaster) live deployments: Asteroid Blaster, VISIO, GithubDashboard, The Bloodweb (`src/data/projects.ts`).
- Work history: Incentive Games (Jan 2023 – May 2026) and the Wonderful agency internship (Apr–Jun 2022, a Wahl × Peaky Blinders landing page) (`src/data/experience.ts`).
- The operators the iGaming work reached may be named: Bet365, Lottomatica, Kaizen, FanDuel.
- A headshot and the CV PDF may be used on the site.
- **Absent, so never fabricate:** screenshots or recordings of Incentive Games work (cannot be shown), testimonials or quotes, metrics, player or user counts, awards, and client logos used as endorsements.

## Product Principles

1. **The portfolio is the work.** Any craft the site claims must be visible in the site itself, with no gap between claim and execution.
2. **Prove, don't claim.** Lead with things a visitor can play, open or inspect. One true specific beats three adjectives.
3. **Serve both audiences without blurring.** The canvas craft and the product engineering each need their own clear evidence. Neither is an afterthought.
4. **Signal over noise.** Every element earns its place, and anything that delays the work (loaders, tickers, gimmicks) is cut.
5. **Restraint is confidence.** Quiet passages make the active moments land.

## Anti-references

- Over-designed agency sites: scroll-jacking, neon glassmorphism, WebGL for its own sake.
- Generic developer portfolio templates: hero photo, skill bars, numbered sections, timeline. Competent and forgettable.
- The AI-generated dev-portfolio look: near-black with one glowing accent, 000→100 loaders, marquee tickers, count-up stats, magnetic buttons, custom cursors. This was the previous version of this site.
- Bland SaaS landing pages: the generic cream-and-blue aesthetic that looks like a product, not a person.

## Accessibility & Inclusion

- WCAG AA minimum in both themes; focus-visible states on every interactive element.
- `prefers-reduced-motion` respected: motion collapses to its final state.
- Semantic structure with labelled sections; the game modal is keyboard-dismissable.
