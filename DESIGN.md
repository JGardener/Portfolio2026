---
name: James Gardener — Portfolio 2026
description: Creative frontend developer portfolio. Code as craft material.
colors:
  bg-void: "#0a0a0f"
  bg-surface: "#0e0e15"
  bg-raised: "#14141d"
  bg-elevated: "#1a1a26"
  line-subtle: "#20202c"
  line-visible: "#2a2a3a"
  text-primary: "#e8e8f0"
  text-secondary: "#a0a0b0"
  text-tertiary: "#6a6a7a"
  text-silent: "#4a4a5a"
  pulse-blue: "#4f8cff"
  pulse-blue-hover: "#6fa0ff"
  pulse-blue-active: "#3a78f0"
typography:
  display:
    fontFamily: "'Syne', sans-serif"
    fontWeight: 600
    fontSize: "clamp(32px, 4.5vw, 56px)"
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Syne', sans-serif"
    fontWeight: 700
    fontSize: "clamp(18px, 2.5vw, 24px)"
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Inter', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.08em"
rounded:
  sm: "2px"
  md: "8px"
  lg: "16px"
  xl: "24px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "96px"
  section: "128px"
components:
  nav-cta:
    backgroundColor: "transparent"
    textColor: "{colors.pulse-blue}"
    typography: "{typography.label}"
    padding: "0"
  nav-cta-hover:
    textColor: "{colors.pulse-blue-hover}"
  mono-btn:
    backgroundColor: "transparent"
    textColor: "{colors.text-tertiary}"
    rounded: "{rounded.md}"
    padding: "6px 10px"
  mono-btn-hover:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
  work-btn:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: "5px 10px"
  work-btn-hover:
    backgroundColor: "{colors.text-secondary}"
    textColor: "{colors.bg-void}"
  skill-chip:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
---

# Design System: James Gardener — Portfolio 2026

## 1. Overview

**Creative North Star: "The Engineer's Canvas"**

This is a portfolio where the interface is the argument. Every visual decision must carry weight as evidence: evidence that James Gardener thinks carefully about systems, builds production-grade interactions, and knows when to stop. The dark surface is not atmosphere — it is a context where motion and light have maximum impact. Precision is the aesthetic.

The palette is near-black with blue-tinted neutrals and a single electric accent. Typography pairs Syne's sharp geometric display cuts with Inter's neutral body and JetBrains Mono's terminal precision. Transitions are short and exponential. Everything either earns its animation or stays still.

What this system explicitly rejects: the over-designed agency aesthetic (scroll-jacking, neon glassmorphism, WebGL for its own sake), generic developer portfolio templates (hero photo, skill bars, timeline), and the bland SaaS cream-and-blue category reflex. This is not a product landing page. It is a craftsperson's work.

**Key Characteristics:**
- Dark-first, with a warm-cream light theme available via `[data-theme="light"]`
- Single electric accent (Pulse Blue) applied at ≤10% of any surface
- Three distinct font roles: display (Syne), body (Inter), technical label (JetBrains Mono)
- Motion on scroll reveals and state transitions; none decorative
- Custom circular lens cursor that inverts content beneath it; swaps to a glowing accent dot on interactive elements

## 2. Colors: The Charged Dark Palette

One accent frequency in a deep, blue-tinted dark field. The palette never shouts; the motion does.

### Primary
- **Pulse Blue** (`#4f8cff`): The single live wire. Used on CTAs, focus rings, the availability indicator dot, the lens cursor border, and the navbar wordmark. Its rarity is load-bearing — every use of this color signals something interactive or important. Light theme equivalent: `#3a6fd0`.
- **Pulse Blue Hover** (`#6fa0ff`): Lighter on hover state. Not used as an independent color; only appears as a hover/active transition.
- **Pulse Blue Active** (`#3a78f0`): Pressed/active state.

### Neutral — Surfaces
All surfaces are tinted toward indigo (not pure black, not pure gray). The tint is subtle (~hue 250–260) but consistent, which is why the dark theme feels cohesive rather than generic.

- **Void** (`#0a0a0f`): The deepest background. Hero, document root. `--bg`.
- **Surface** (`#0e0e15`): Component backgrounds, mobile menu panel. `--bg-1`.
- **Raised** (`#14141d`): Elevated containers, section alternates. `--bg-2`.
- **Elevated** (`#1a1a26`): Highest surface layer before accent. `--bg-3`.
- **Line Subtle** (`#20202c`): Hairline dividers, work row borders at rest. `--line`.
- **Line Visible** (`#2a2a3a`): Component borders (chips, buttons, inputs). `--line-2`.

Light theme surfaces use warm-cream tones (`#fbf9f4` → `#ebe6d8`) with the same elevation logic. The surface color shifts from indigo-tinted dark to parchment-tinted light; the structural relationships remain identical.

### Neutral — Text
- **Primary** (`#e8e8f0`): Headlines, active states. Subtly blue-tinted white — never pure `#ffffff`.
- **Secondary** (`#a0a0b0`): Body text, descriptions, secondary labels. The default reading color.
- **Tertiary** (`#6a6a7a`): Mono labels, nav links at rest, metadata. Quiet but legible.
- **Silent** (`#4a4a5a`): Disabled states, placeholder text. Barely there.

### Named Rules
**The One Pulse Rule.** Pulse Blue appears on one element per visual cluster. Two blue items in the same view compete; one commands. If a section has a blue CTA link, the icons and borders stay neutral.

**The Indigo Tint Rule.** Every neutral — surface, text, and divider — is tinted toward hue 255–265 (indigo). Pure grays (`#808080`, `#333333`) are forbidden. The tint is what makes the dark theme feel like a deliberate space rather than a default dark mode.

## 3. Typography

**Display Font:** Syne (with `sans-serif` fallback)
**Body Font:** Inter (with `sans-serif` fallback)
**Label/Technical Font:** JetBrains Mono (with `monospace` fallback)

**Character:** Syne's geometric cuts are confident and slightly editorial — they suggest intention, not decoration. Inter handles reading work with zero friction. JetBrains Mono brings the terminal precision that signals technical provenance. Together they read as: a developer who thinks in systems but designs with care.

### Hierarchy
- **Display** (Syne 600, `clamp(32px, 4.5vw, 56px)`, lh 1.05, ls -0.02em): Section headings ("Things I've built"). Maximum of one per section. Tightest leading — these lines do not wrap.
- **Headline** (Syne 700, `clamp(18px, 2.5vw, 24px)`, lh 1.2, ls -0.01em): Name callout in hero, sub-section emphasis. Tighter than Display text; used for named proper nouns and emphasis.
- **Body** (Inter 400, 16px, lh 1.6): All descriptive text, about copy, project descriptions. Max line length 72ch. This is the only role using Inter 400.
- **Label** (JetBrains Mono 500, 11px, ls 0.08em, `text-transform: uppercase`): Section markers (`// 02 — About`), nav links, metadata, skill chips, button text, timestamps. The system's technical annotation layer.

### Named Rules
**The Comment Syntax Rule.** Section labels use the pattern `// {n} — {Label}` in JetBrains Mono. This is the single visual motif that makes the code-as-craft metaphor legible. Never write section labels in Syne or Inter; the mono font is the marker of authorship.

**The Mono Discipline Rule.** JetBrains Mono appears at 10–11px only. At larger sizes (the mobile menu uses 24–32px mono) it is a deliberate departure — used once, for navigational drama, not repeated as a general display alternative.

## 4. Elevation

The system is flat at rest and ambient when active. Depth is conveyed through surface color steps (Void → Elevated), not shadows. Shadows appear only as a response to state or to establish a floating context.

### Shadow Vocabulary
- **Ambient low** (`0 2px 8px rgba(0,0,0,0.3)`): Subtle depth for small lifted elements. `--sh-sm`.
- **Ambient medium** (`0 8px 24px rgba(0,0,0,0.4)`): Cards, dropdowns, modal panels. `--sh-md`.
- **Ambient deep** (`0 16px 60px rgba(0,0,0,0.5)`): Full modal backdrops. `--sh-lg`.
- **Pulse glow** (`0 0 24px rgba(79,140,255,0.35), 0 0 40px rgba(79,140,255,0.35)`): The accent halo. Used on the lens cursor border and the glowing dot. This is not a shadow — it is a state indicator. `--sh-glow`.

The navbar is a special case: it starts transparent and transitions to a **conditional frosted glass** state on scroll (`backdrop-filter: blur(18px)`, `background: rgba(10,10,15,0.7)`, accent-border pill shape). This is structural, not decorative — it prevents the nav from occluding content while signaling its persistent presence.

### Named Rules
**The Flat-By-Default Rule.** No surface has a shadow until it needs to communicate depth or state. A section card does not get a shadow because it's a card. A tooltip gets a shadow because it floats above the page.

**The Glow-Is-Interactive Rule.** The blue glow (`--sh-glow`) appears only on interactive elements that are receiving focus or being hovered. It is the system's way of saying "this responds to you." Using it decoratively breaks the signal.

## 5. Components

### Lens Cursor (Signature)
The system's most distinctive element. The default cursor is hidden globally (`cursor: none`). Two elements take its place:

- **Lens** (80px circle): `backdrop-filter: invert(1) hue-rotate(180deg) saturate(1.4) brightness(1.1)` with a Pulse Blue border and glow. Follows the pointer with exponential lag (lerp factor 0.22).
- **Dot** (10px circle): Solid Pulse Blue with glow. Follows the pointer faster (lerp factor 0.60). Swaps to visible when the pointer is over any `a` or `button`.

The lens is hidden on `@media (hover: none)` (touch devices). The transition between lens and dot states is 180ms ease-out.

### Navbar
- **Resting state:** Transparent background, no border, full-width.
- **Scrolled state:** Collapses to a pill — `border-radius: 12px`, `background: rgba(10,10,15,0.7)`, `backdrop-filter: blur(18px)`, `border: 1px solid var(--line)`, positioned with 16px top / 24px side margins.
- **Logo:** Syne 700 18px, Pulse Blue, `⬢ JG` wordmark.
- **Nav links:** JetBrains Mono 500 11px, uppercase, 0.08em tracking, `--text-dim` at rest. On hover: color → `--text`, underline draws from left (200ms ease-out).
- **CTA link:** "Get in touch" in Pulse Blue, mono font. No border, no background.
- **Ghost button (theme toggle):** `--line-2` border, `--r-md` radius, `--text-dim` text, 6px 10px padding. Hover: border → Pulse Blue, text → `--text`.

### Skill Chips
Used in the About section to enumerate technologies.
- **Style:** Transparent background, `--line-2` border (1px), `--r-sm` (2px) radius, JetBrains Mono 500 11px uppercase, `--text-dim` text color.
- **Padding:** 8px 12px.
- **State:** No active/selected state; these are read-only taxonomy labels.

### Work Buttons (.work-btn)
Small inline action buttons on project rows (GitHub link, Live link, Play game).
- **Shape:** `border-radius: 10%` — nearly square with barely-rounded corners.
- **Style:** Transparent background, 1px border at whatever the local `--btn-clr` variable is (set per-button to the appropriate color). JetBrains Mono 500 11px uppercase.
- **Hover:** Background fills to `--btn-clr`, text inverts to `--bg`. Transition 150ms ease-out.

### Hero Eyebrow Pill
A metadata badge pinned above the hero wordmark.
- **Style:** `border-radius: 999px`, `--bg-1` fill, `--line-2` border, JetBrains Mono 500 11px, 0.08em tracking, `--text-mute` color.
- **Content:** `// Portfolio · 2026`

### Section Labels (.mono-label)
The system's section numbering and titling convention.
- **Style:** JetBrains Mono 500 11px, 0.08em tracking, uppercase, `--text-mute` color.
- **Pattern:** `// {n} — {Label}` or `// {Label}`.
- **Usage:** One per section, appears above the section heading.

### CTA Primary (.cta-primary)
The primary call-to-action link style (used in contact and navigation).
- **Default:** Inherits parent color and background.
- **Hover:** `background-color → var(--accent)`, `color → #fff`, `transform: translateY(-2px)`. Transition 150ms ease-out.

### Link Draw (.link-draw)
Underline-on-hover animation for inline text links.
- **Mechanism:** `::after` pseudo-element, `width: 0 → 100%` on hover, 200ms ease-out.
- **Usage:** Nav links, inline prose links.

## 6. Do's and Don'ts

### Do:
- **Do** use `var(--font-mono)` for all section labels, nav links, metadata, and button text. The mono font is the technical annotation layer; its presence signals "this is authored."
- **Do** apply Pulse Blue to at most one interactive element per visual cluster. Rarity is the point.
- **Do** use CSS custom properties for every color, spacing, and radius value. Never hardcode hex values in component files.
- **Do** animate only `opacity`, `transform`, and `filter` — never `width`, `height`, `top`, `left`, or any layout property.
- **Do** apply `ease-draw` (`cubic-bezier(0.16, 1, 0.3, 1)`) for entrance animations and scroll reveals. This is the exponential ease that makes motion feel engineered.
- **Do** keep section label copy in the comment-syntax pattern: `// 02 — About`. Breaking the pattern breaks the metaphor.
- **Do** support `prefers-reduced-motion` — all transition durations must collapse to 0ms under this media query.
- **Do** tint every neutral toward indigo (hue 255–265). `#0a0a0f` not `#0a0a0a`. The tint is what makes the palette feel intentional.

### Don't:
- **Don't** add scroll-jacking, parallax that moves content, or WebGL effects for visual drama alone. This is the agency portfolio anti-pattern. Motion must communicate; it must not perform.
- **Don't** use glassmorphism decoratively. The navbar's frosted-glass pill state is structural (it floats above content). No other element should use `backdrop-filter` for aesthetics.
- **Don't** use `background-clip: text` with a gradient. No gradient text anywhere. Emphasis is size, weight, or Pulse Blue — never a gradient.
- **Don't** use `border-left` greater than 1px as a colored accent stripe on cards, list items, or callouts. Rewrite with background tints, full borders, or nothing.
- **Don't** build identical card grids. The work section uses a table/list pattern with rows — not a grid of equal-weight cards. If a new section needs to show multiple items, use a list, a timeline, or an asymmetric layout before reaching for a card grid.
- **Don't** use pure black (`#000000` / `#000`) or pure white (`#ffffff` / `#fff`) as text or surface colors in the dark theme. All surfaces are indigo-tinted.
- **Don't** use skill bars, timeline diagrams, or hero profile photos. These are the generic developer portfolio template patterns the system explicitly rejects.
- **Don't** reach for a modal first. The game is an exception (the only interactive canvas artifact). Everything else should render inline or in a slide-over before a modal is considered.
