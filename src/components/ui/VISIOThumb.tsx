import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { prefersReducedMotion } from '../../lib/gsap'

const TEAL = 0x00d4aa
const W = 200
const H = 120
const WORD = 'VISIO'
// Sampled in the body face at its heaviest weight: Bowlby One's strokes are
// so thick and its counters so tight that on a dot lattice the V and I fuse
// and the S/O interiors fill in. Archivo 900 keeps stems ~3 nodes thick.
const FONT_WEIGHT = 900
const FONT_FAMILY = '"Archivo Variable", "Archivo", "Arial Black", sans-serif'
// Ink-to-ink gap between glyphs, as a fraction of the font size.
const LETTER_GAP_EM = 0.16
// Finest lattice step (logical px) and the node budget; the step is only
// coarsened if the word would need more nodes than the budget.
const MIN_SPACING = 2
const MAX_NODES = 760

type Phase = 'drift' | 'converge' | 'hold'
type Layout = { targets: Array<{ x: number; y: number }>; spacing: number }

/**
 * Rasterise the word glyph by glyph and sample it on a regular grid.
 * Each glyph is placed by its own ink bounds with an explicit gap, so no two
 * letters can touch however tightly the face is kerned. A regular lattice
 * (rather than random points inside the glyphs) keeps the assembled word
 * crisp: strokes get evenly spaced nodes, counters stay open, edges straight.
 */
async function sampleLetterTargets(): Promise<Layout> {
  // Sampling before the face is ready would rasterise the fallback font.
  try {
    await document.fonts.load(`${FONT_WEIGHT} 64px ${FONT_FAMILY}`, WORD)
  } catch { /* fall through to whatever face is available */ }

  const scale = 4
  const cw = W * scale
  const ch = H * scale
  const offscreen = document.createElement('canvas')
  offscreen.width = cw
  offscreen.height = ch
  const ctx = offscreen.getContext('2d', { willReadFrequently: true })!
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  const glyphs = [...WORD]
  const measure = (size: number) => {
    ctx.font = `${FONT_WEIGHT} ${size}px ${FONT_FAMILY}`
    const boxes = glyphs.map(g => {
      const m = ctx.measureText(g)
      return { left: m.actualBoundingBoxLeft, w: m.actualBoundingBoxLeft + m.actualBoundingBoxRight }
    })
    const all = ctx.measureText(WORD)
    const inkW = boxes.reduce((sum, b) => sum + b.w, 0) + LETTER_GAP_EM * size * (glyphs.length - 1)
    return { boxes, inkW, ascent: all.actualBoundingBoxAscent, inkH: all.actualBoundingBoxAscent + all.actualBoundingBoxDescent }
  }

  // Fit the spaced word to ~86% of the width and ~58% of the height.
  const probe = 100
  const pm = measure(probe)
  const size = probe * Math.min((cw * 0.86) / Math.max(1, pm.inkW), (ch * 0.58) / Math.max(1, pm.inkH))
  const fm = measure(size)

  const gap = LETTER_GAP_EM * size
  let x = (cw - fm.inkW) / 2
  const baseline = (ch - fm.inkH) / 2 + fm.ascent
  ctx.fillStyle = '#fff'
  glyphs.forEach((g, i) => {
    const b = fm.boxes[i]
    ctx.fillText(g, x + b.left, baseline)
    x += b.w + gap
  })

  const { data } = ctx.getImageData(0, 0, cw, ch)
  const inside = (px: number, py: number) => {
    const c = Math.round(px * scale), r = Math.round(py * scale)
    if (c < 0 || r < 0 || c >= cw || r >= ch) return false
    return data[(r * cw + c) * 4 + 3] > 128
  }

  const sample = (spacing: number) => {
    const pts: Array<{ x: number; y: number }> = []
    for (let py = spacing / 2; py < H; py += spacing) {
      for (let px = spacing / 2; px < W; px += spacing) {
        if (inside(px, py)) pts.push({ x: px, y: py })
      }
    }
    return pts
  }

  let spacing = MIN_SPACING
  let targets = sample(spacing)
  while (targets.length > MAX_NODES && spacing < 5) {
    spacing += 0.1
    targets = sample(spacing)
  }

  if (targets.length === 0) {
    targets = Array.from({ length: 120 }, () => ({ x: Math.random() * W, y: Math.random() * H }))
  }
  return { targets, spacing }
}

export default function VISIOThumb() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    const app = new PIXI.Application()
    const reduced = prefersReducedMotion()
    let cancelled = false
    let initialized = false
    let io: IntersectionObserver | undefined

    async function init() {
      const { targets, spacing } = await sampleLetterTargets()
      if (cancelled) return

      await app.init({
        width: W,
        height: H,
        backgroundAlpha: 0,
        antialias: true,
        // Rendered at 2x the device density: the box frames scale these up.
        resolution: Math.min(window.devicePixelRatio, 2) * 2,
        autoDensity: true,
      })

      if (cancelled) { app.destroy(true, { children: true }); return }

      initialized = true
      container.appendChild(app.canvas)

      const N = targets.length
      // Node radius scales with the grid so neighbours nearly touch: the word
      // reads as solid strokes up close and as a lattice of nodes on a zoom.
      const dotR = spacing * 0.36
      const haloR = spacing * 1.05

      const ptx = targets.map(t => t.x)
      const pty = targets.map(t => t.y)
      const px  = reduced ? [...ptx] : Array.from({ length: N }, () => Math.random() * W)
      const py  = reduced ? [...pty] : Array.from({ length: N }, () => Math.random() * H)
      const pvx = Array.from({ length: N }, () => (Math.random() - 0.5) * 0.8)
      const pvy = Array.from({ length: N }, () => (Math.random() - 0.5) * 0.8)
      // Per-node lag so the word assembles in a ripple rather than all at once.
      const pdelay = Array.from({ length: N }, (_, i) => (ptx[i] / W) * 24 + Math.random() * 10)
      let glow = 0

      const lineGfx     = new PIXI.Graphics()
      const particleGfx = new PIXI.Graphics()
      app.stage.addChild(lineGfx)
      app.stage.addChild(particleGfx)

      const draw = (drifting: boolean) => {
        lineGfx.clear()
        particleGfx.clear()

        if (drifting) {
          // Sparse constellation lines between drifting nodes.
          for (let i = 0; i < N; i += 3) {
            for (let j = i + 3; j < N; j += 3) {
              const dx = px[i] - px[j], dy = py[i] - py[j]
              const d2 = dx * dx + dy * dy
              if (d2 < 400) {
                lineGfx.moveTo(px[i], py[i]).lineTo(px[j], py[j])
                  .stroke({ color: TEAL, alpha: (1 - Math.sqrt(d2) / 20) * 0.16, width: 0.4 })
              }
            }
          }
        }

        const haloA = drifting ? 0.1 : 0.03 + glow * 0.1
        for (let i = 0; i < N; i++) {
          particleGfx.circle(px[i], py[i], haloR * (1 + glow * 0.6)).fill({ color: TEAL, alpha: haloA })
        }
        for (let i = 0; i < N; i++) {
          particleGfx.circle(px[i], py[i], dotR).fill({ color: TEAL, alpha: 0.95 })
        }
      }

      if (reduced) {
        // Static finished word: no ticker, no observer.
        draw(false)
        app.ticker.stop()
        app.render()
        return
      }

      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) app.ticker.start()
        else app.ticker.stop()
      })
      io.observe(container)

      let phase: Phase = 'drift'
      let timer = 0

      // Timings are in 60fps-equivalent frames, scaled by ticker.deltaTime so
      // the cycle runs at the same speed on 60Hz and 120Hz+ displays.
      app.ticker.add((ticker) => {
        const dt = Math.min(ticker.deltaTime, 3)
        timer += dt

        // ── Drift ──────────────────────────────────────────────────────────
        if (phase === 'drift') {
          for (let i = 0; i < N; i++) {
            pvx[i] = pvx[i] * 0.99 ** dt + (Math.random() - 0.5) * 0.04 * dt
            pvy[i] = pvy[i] * 0.99 ** dt + (Math.random() - 0.5) * 0.04 * dt
            px[i] += pvx[i] * dt; py[i] += pvy[i] * dt
            if (px[i] < 0) px[i] = W; if (px[i] > W) px[i] = 0
            if (py[i] < 0) py[i] = H; if (py[i] > H) py[i] = 0
          }
          if (timer >= 150) { phase = 'converge'; timer = 0 }

        // ── Converge ───────────────────────────────────────────────────────
        } else if (phase === 'converge') {
          let settled = true
          const k = 1 - 0.9 ** dt
          for (let i = 0; i < N; i++) {
            if (timer < pdelay[i]) { settled = false; continue }
            px[i] += (ptx[i] - px[i]) * k
            py[i] += (pty[i] - py[i]) * k
            const dx = ptx[i] - px[i], dy = pty[i] - py[i]
            if (dx * dx + dy * dy > 0.01) settled = false
          }
          if (settled || timer >= 140) {
            // Snap exactly onto the lattice so the resting word has no jitter.
            for (let i = 0; i < N; i++) { px[i] = ptx[i]; py[i] = pty[i] }
            phase = 'hold'; timer = 0; glow = 1
          }

        // ── Hold ───────────────────────────────────────────────────────────
        } else {
          glow *= 0.94 ** dt
          if (timer >= 240) {
            phase = 'drift'; timer = 0; glow = 0
            for (let i = 0; i < N; i++) {
              pvx[i] = (Math.random() - 0.5) * 2
              pvy[i] = (Math.random() - 0.5) * 2
            }
          }
        }

        draw(phase === 'drift')
      })
    }

    init()

    return () => {
      cancelled = true
      if (initialized && app.canvas.parentNode) {
        io?.disconnect()
        app.destroy(true, { children: true })
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="shot__canvas"
    />
  )
}
