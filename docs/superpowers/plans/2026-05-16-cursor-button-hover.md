# Cursor Button-Hover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 80px→140px lens grow-on-hover with a glowing accent dot that fades in at a fast lerp rate, giving a precise and clear click target.

**Architecture:** A second `<div>` (the dot) is added alongside the existing lens in `LensCursor.tsx`. Both run inside the same RAF loop with separate lerp rates. `onEnter`/`onLeave` toggle opacity on both elements instead of changing the lens size.

**Tech Stack:** React 19, TypeScript, CSS transitions (no external libs needed)

---

## Files

- Modify: `src/components/layout/LensCursor.tsx` (only file changed)

---

### Task 1: Add dot ref and dot div to JSX

**Files:**
- Modify: `src/components/layout/LensCursor.tsx`

- [ ] **Step 1: Add `dotRef` and update the return value**

Open `src/components/layout/LensCursor.tsx`. Add a `dotRef` alongside `lensRef`, wrap the return in a Fragment, and add the dot `<div>`. Replace the entire file content with:

```tsx
import { useEffect, useRef } from 'react'

export default function LensCursor() {
  const lensRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lens = lensRef.current
    const dot = dotRef.current
    if (!lens || !dot) return

    let currentX = -200
    let currentY = -200
    let targetX = -200
    let targetY = -200
    let dotX = -200
    let dotY = -200
    let rafId = 0
    const LERP_LENS = 0.22
    const LERP_DOT = 0.60
    const EPS = 0.1

    function tick() {
      currentX += (targetX - currentX) * LERP_LENS
      currentY += (targetY - currentY) * LERP_LENS
      dotX += (targetX - dotX) * LERP_DOT
      dotY += (targetY - dotY) * LERP_DOT

      lens!.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`
      dot!.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`

      const lensSettled = Math.abs(targetX - currentX) <= EPS && Math.abs(targetY - currentY) <= EPS
      const dotSettled = Math.abs(targetX - dotX) <= EPS && Math.abs(targetY - dotY) <= EPS

      if (!lensSettled || !dotSettled) {
        rafId = requestAnimationFrame(tick)
      } else {
        rafId = 0
      }
    }

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!rafId) rafId = requestAnimationFrame(tick)
    }

    const onEnter = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button')) {
        lens!.style.opacity = '0'
        dot!.style.opacity = '1'
      }
    }

    const onLeave = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button')) {
        lens!.style.opacity = '1'
        dot!.style.opacity = '0'
      }
    }

    window.addEventListener('pointermove', onMove)
    document.addEventListener('mouseover', onEnter, true)
    document.addEventListener('mouseout', onLeave, true)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseover', onEnter, true)
      document.removeEventListener('mouseout', onLeave, true)
    }
  }, [])

  return (
    <>
      <div
        ref={lensRef}
        data-cursor-lens
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          backdropFilter: 'invert(1) hue-rotate(180deg) saturate(1.4) brightness(1.1)',
          WebkitBackdropFilter: 'invert(1) hue-rotate(180deg) saturate(1.4) brightness(1.1)',
          border: '1px solid var(--accent)',
          boxShadow: '0 0 12px var(--accent-glow)',
          transition: 'opacity 180ms ease-out',
          transform: 'translate(-200px, -200px) translate(-50%, -50%)',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          backgroundColor: 'var(--accent)',
          boxShadow: '0 0 8px var(--accent), 0 0 20px var(--accent-glow)',
          opacity: 0,
          transition: 'opacity 180ms ease-out',
          transform: 'translate(-200px, -200px) translate(-50%, -50%)',
        }}
      />
    </>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npm run build
```

Expected: no TypeScript errors. Fix any before continuing.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/LensCursor.tsx
git commit -m "feat: replace lens hover-grow with glowing dot on button/link hover"
```

---

### Task 2: Visual verification

**Files:**
- No changes — this task is verification only

- [ ] **Step 1: Run the dev server**

```bash
npm run dev
```

Open the URL printed in the terminal (default: `http://localhost:5173`).

- [ ] **Step 2: Verify idle behavior**

Move the mouse around the page away from any links or buttons. Confirm:
- The 80px lens follows the cursor with the existing slow lerp
- No dot is visible

- [ ] **Step 3: Verify hover behavior on a link**

Hover over a nav link (e.g. the "Work" anchor in the navbar). Confirm:
- Lens fades out smoothly (~180ms)
- A small glowing accent dot fades in at the cursor position
- The dot tracks the cursor noticeably faster than the lens did
- Moving the cursor while hovering: dot follows quickly but not jarringly

- [ ] **Step 4: Verify hover behavior on a button**

Hover over the theme toggle button in the navbar. Confirm same behavior as Step 3.

- [ ] **Step 5: Verify leave behavior**

Move the cursor off a link/button back to open space. Confirm:
- Dot fades out
- Lens fades back in

- [ ] **Step 6: Verify light theme**

Toggle to light mode. Confirm the dot uses `var(--accent)` correctly (accent color should match the light theme token, not be hardcoded dark-theme green).

- [ ] **Step 7: Stop the dev server**

`Ctrl+C` in the terminal running `npm run dev`.
