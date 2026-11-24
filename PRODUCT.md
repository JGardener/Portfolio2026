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
- **Live project thumbnails** are rendered in code, one per project: GameThumb, DuoEndoThumb, VISIOThumb, GithubHeatmapThumb, BloodwebThumb, SixfoldThumb and GiantsKeeperThumb. They are code-drawn evocations, not real screenshots, and carry no captions.
- **Light and dark themes**, toggled by the visitor and persisted.
- Content is data-driven from `src/data/projects.ts` and `src/data/experience.ts`.
- Incentive Games job title: present it as **Frontend Developer**, matching the current CV. (The contract title was Junior Software Developer; James states it plainly if asked, and the site doesn't need to show it.)

## Brand Commitments

- Voice: confident without being loud. Plain, human and specific; no spec-sheet paragraphs, no hype.
- Personality: clean, professional, fluid. Motion is there to prove craft, never to decorate.
- Name: James Gardener. Links: github.com/JGardener and linkedin.com/in/jamesgardener92.

## Evidence on Hand

- **Four side projects** with public repos, three of them deployed live (all but Asteroid Blaster): Asteroid Blaster, VISIO, GithubDashboard and The Bloodweb (`src/data/projects.ts`).
- **Three agent-built projects**, all in private repos, none deployed or released. James designed, specced, directed, reviewed and playtested them; Claude Code agents wrote most of the code. Figures on the site come from these repos, as read on 2026-11-23:
  - **DuoEndo** (`D:\Dev\DuoEndo`, `JGardener/DuoEndo`, private):
    - a React 19 / TS PWA monorepo;
    - learner code runs in Web Workers, Pyodide and sql.js, and in sandboxed iframes;
    - Workbox offline precache, and an IndexedDB event log driving streaks, XP and FSRS review;
    - a CI gate (`.github/workflows/gate.yml`) running types, lint, Vitest (including fast-check), Playwright and a bundle budget;
    - 167 of 197 commits carry Claude trailers;
    - status: MVP PR #66 is open and not merged, and the latest CI runs on `build/mvp` were failing.
  - **Sixfold** (`C:\Dev\Sixfold`, private):
    - a UE 5.8 C++ co-op ARPG (1–4 players, listen server) using GAS and CommonUI, with about 20 abilities and no classes;
    - about 2,570 `TEST_METHOD` tests;
    - nine custom subagents in `.claude/agents/`, with Stop/SubagentStop hooks enforcing a build plus a full test pass;
    - token-cost measurements in `docs/archive/Feature_Team_Measurements.md`;
    - playtest checklists in `TestScripts/`;
    - no CI;
    - status: in development.
  - **The Giant's Keeper** (`C:\Dev\TheGiantsKeeper`, private):
    - a UE 5.8 C++ cosy cleaning game with a custom HLSL compute shader (`Shaders/Private/GiantsKeeperGrimeMask.usf`);
    - 841 test methods across headless and GPU lanes;
    - spec issue #38 split into 43 `ready-for-agent` tickets (#39–#81), built in parallel worktrees;
    - a playtest on 2026-11-20 (29.4 min at 4,471 m²) after which the zone was cut to 3,211 m² (issue #63);
    - no multiplayer;
    - status: in development (playable greybox first zone).
- **Work history:**
  - Incentive Games, Jan 2023 – May 2026: 3 years 4 months, shown as "3+ years";
  - the Wonderful agency internship, Apr–Jun 2022: a Wahl × Peaky Blinders landing page (`src/data/experience.ts`);
  - self-directed independent projects, May 2026 – present.
- **Operators** the iGaming work reached may be named: Bet365, Lottomatica, Kaizen, FanDuel.
- **Location and availability:** "Based in Kent, UK. Available now." (confirmed by James, 2026-11-23).
- **Allowed on the site:** a headshot and the CV PDF.
- **Absent, so never fabricate:**
  - screenshots or recordings of Incentive Games work (cannot be shown);
  - testimonials or quotes, metrics, player or user counts, awards, client logos used as endorsements;
  - any claim that the agent-built projects are shipped, publicly available, passing CI, or hand-written in C++/HLSL.

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
