# Cursor Button-Hover Design

**Date:** 2026-05-16
**Status:** Approved
**File:** `src/components/layout/LensCursor.tsx`

## Problem

The current `LensCursor` expands from 80px → 140px when hovering over `a` and `button` elements. This creates two issues:

1. **No affordance** — growing the lens doesn't communicate "you can click here"
2. **Reduced precision** — the large filtered circle covers the button label, and the lerp lag (LERP = 0.22) means the visual cursor trails behind the actual click position

## Solution — B3: Glowing dot on hover

On hover, the lens fades out and is replaced by a small glowing accent dot that tracks at a faster lerp rate. The dot gives a clear, precise click target. The lens returns when leaving the interactive element.

## Structure

`LensCursor` renders two elements:

- **Lens div** (existing) — 80px circle with backdrop-filter invert, lerp 0.22. Unchanged from current idle behavior.
- **Dot div** (new) — 10px circle, accent fill with glow, lerp 0.6.

Both share a single RAF loop and a single `pointermove` listener. Both track independently with their own `currentX/Y` and `targetX/Y` pairs. The dot is always lerping in the background even when invisible, so it's already in position when it fades in.

## Motion

| Element | LERP factor | Feel |
|---------|-------------|------|
| Lens    | 0.22        | Slow, ambient (unchanged) |
| Dot     | 0.60        | Fast, snappy but not jarring |

## Visual — Dot

- Size: 10px × 10px, `border-radius: 50%`
- Fill: `var(--accent)`
- Glow: `box-shadow: 0 0 8px var(--accent), 0 0 20px var(--accent-glow)`
- No pulse animation — the trailing fast-lerp motion provides sufficient life

## Transitions

Both elements use `transition: opacity 180ms ease-out` in their inline styles. The lens's current `transition: width/height` is replaced with this — the lens no longer changes size, so width/height transitions are no longer needed.

| Event | Lens opacity | Dot opacity |
|-------|-------------|-------------|
| Idle  | 1           | 0           |
| `mouseover` `a, button` | 0 | 1 |
| `mouseout` `a, button`  | 1 | 0 |

State is toggled via `element.style.opacity` in the existing `onEnter`/`onLeave` handlers.

## What does not change

- Lens size stays 80px on hover (the grow-to-140px behavior is removed)
- Lens lerp rate stays 0.22
- Touch device hiding (`@media (hover: none)`) unchanged
- `data-cursor-lens` attribute and `aria-hidden` preserved
