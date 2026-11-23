import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { prefersReducedMotion } from '../../lib/gsap'

const W = 200
const H = 120
const CX = 100
const CY = 62
// The arena is an ellipse: a top-down floor seen at a slight tilt
const RX = 70
const RY = 42
const TILT = RY / RX

// Six ability slots, one per element, no classes
const ELEMENTS = [
  0xff7a1a, // fire
  0x5ab8ff, // frost
  0xffe14a, // lightning
  0xa070ff, // arcane
  0x5fd068, // nature
  0xe0283c, // blood
]
const SLOT_STEP = 0.6 // seconds each slot stays the "cast"
const slots = ELEMENTS.map((color, i) => {
  const a = (-90 + i * 60) * (Math.PI / 180)
  return { color, x: CX + Math.cos(a) * RX, y: CY + Math.sin(a) * RY }
})

// Four co-op players, standing between the slots
const PLAYERS = [
  { color: 0xff8a80, a: 0 }, { color: 0x80d8ff, a: 120 },
  { color: 0xa7ffb0, a: 180 }, { color: 0xfff59d, a: 300 },
].map((p, i) => {
  const a = p.a * (Math.PI / 180)
  return { color: p.color, x: CX + Math.cos(a) * RX * 0.6, y: CY + Math.sin(a) * RY * 0.6, ph: i * 1.7 }
})

// Enemy pack milling in the middle (fixed layout, no per-render randomness)
const ENEMIES = [
  [0.2, 6], [1.1, 13], [1.9, 9], [2.6, 15], [3.3, 4], [4.0, 12], [4.7, 8], [5.5, 14], [6.0, 10],
].map(([a, r], i) => ({ a, r, ph: i * 0.9 }))

// Meteor cycle (seconds)
const PERIOD = 6.5
const TELEGRAPH = 3.5
const IMPACT = 4.6
const FLIGHT = 0.5
const DANGER_R = 21

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

function glyph(g: PIXI.Graphics, i: number, x: number, y: number, color: number, alpha: number) {
  switch (i) {
    case 0: g.poly([x, y - 3.6, x + 3, y + 2.8, x - 3, y + 2.8]).fill({ color, alpha }); break         // fire
    case 1: g.poly([x, y - 3.8, x + 2.6, y, x, y + 3.8, x - 2.6, y]).fill({ color, alpha }); break      // frost
    case 2: g.moveTo(x + 1.6, y - 3.8).lineTo(x - 1.6, y + 0.2).lineTo(x + 1.6, y + 0.2).lineTo(x - 1.6, y + 3.8)
      .stroke({ color, alpha, width: 1.3, join: 'round', cap: 'round' }); break                          // lightning
    case 3: g.star(x, y, 4, 3.8, 1.3).fill({ color, alpha }); break                                    // arcane
    case 4: g.ellipse(x, y, 2.2, 3.6).fill({ color, alpha }); break                                    // nature
    default: g.circle(x, y + 1, 2.6).fill({ color, alpha }).poly([x - 2.3, y, x, y - 3.8, x + 2.3, y]).fill({ color, alpha }) // blood
  }
}

export default function SixfoldThumb() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    const app = new PIXI.Application()
    const still = prefersReducedMotion()
    let cancelled = false
    let initialized = false
    let io: IntersectionObserver | undefined

    async function init() {
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

      const floor = new PIXI.Graphics()
      const fx = new PIXI.Graphics()
      app.stage.addChild(floor, fx)

      // Static arena: dark stone floor, faint tiles, a worn rune circle
      floor.rect(0, 0, W, H).fill(0x0c0d11)
      for (let x = 6; x < W; x += 12) floor.moveTo(x, 0).lineTo(x, H)
      for (let y = 4; y < H; y += 12) floor.moveTo(0, y).lineTo(W, y)
      floor.stroke({ color: 0xffffff, alpha: 0.03, width: 0.5 })
      floor.ellipse(CX, CY, RX + 12, RY + 10).fill({ color: 0x15161d, alpha: 0.9 })
      floor.ellipse(CX, CY, RX + 12, RY + 10).stroke({ color: 0x2b2d3a, width: 1 })
      floor.ellipse(CX, CY, RX * 0.42, RY * 0.42).stroke({ color: 0xffffff, alpha: 0.05, width: 0.8 })
      floor.ellipse(CX, CY, RX * 0.82, RY * 0.82).stroke({ color: 0xffffff, alpha: 0.035, width: 0.6 })
      for (const s of slots) {
        floor.moveTo(CX + (s.x - CX) * 0.46, CY + (s.y - CY) * 0.46).lineTo(CX + (s.x - CX) * 0.8, CY + (s.y - CY) * 0.8)
      }
      floor.stroke({ color: 0xffffff, alpha: 0.04, width: 0.6 })
      for (const s of slots) {
        floor.roundRect(s.x - 7.5, s.y - 7.5, 15, 15, 3).fill(0x1a1b24).stroke({ color: 0x34364a, width: 1 })
      }

      function draw(T: number) {
        fx.clear()
        const m = T % PERIOD

        // Scorch left by the last impact
        const since = m >= IMPACT ? m - IMPACT : m + PERIOD - IMPACT
        const scorch = clamp01(1 - since / 2.2)
        if (scorch > 0) fx.ellipse(CX, CY, DANGER_R * 0.9, DANGER_R * 0.9 * TILT).fill({ color: 0x000000, alpha: 0.45 * scorch })

        // Telegraph: danger circle that fills before the hit
        if (m >= TELEGRAPH && m < IMPACT) {
          const p = (m - TELEGRAPH) / (IMPACT - TELEGRAPH)
          const blink = 0.5 + 0.5 * Math.sin(m * 18)
          fx.ellipse(CX, CY, DANGER_R, DANGER_R * TILT).fill({ color: 0xff2a2a, alpha: 0.1 + 0.06 * blink })
          fx.ellipse(CX, CY, DANGER_R * p, DANGER_R * p * TILT).fill({ color: 0xff2a2a, alpha: 0.22 })
          fx.ellipse(CX, CY, DANGER_R, DANGER_R * TILT).stroke({ color: 0xff4a3a, alpha: 0.75, width: 1 })
        }

        // Ability slots light up in turn
        const beat = T / SLOT_STEP
        slots.forEach((s, i) => {
          const phase = (((beat - i) % 6) + 6) % 6
          const v = phase < 0.15 ? phase / 0.15 : Math.exp(-(phase - 0.15) * 1.6)
          if (v > 0.02) {
            fx.roundRect(s.x - 11, s.y - 11, 22, 22, 6).fill({ color: s.color, alpha: 0.14 * v })
            fx.roundRect(s.x - 7.5, s.y - 7.5, 15, 15, 3).fill({ color: s.color, alpha: 0.22 * v })
              .stroke({ color: s.color, alpha: 0.9 * v, width: 1 })
          }
          glyph(fx, i, s.x, s.y, s.color, 0.3 + 0.7 * v)
        })

        // The lit ability fires: a bolt from a player into the pack
        const active = Math.floor(beat) % 6
        const f = beat - Math.floor(beat)
        if (f < 0.55) {
          const p = PLAYERS[Math.floor(beat) % 4]
          const q = f / 0.55
          const tx = CX + (p.x - CX) * 0.15, ty = CY + (p.y - CY) * 0.15
          const bx = p.x + (tx - p.x) * q, by = p.y + (ty - p.y) * q
          const tail = Math.max(0, q - 0.25)
          fx.moveTo(p.x + (tx - p.x) * tail, p.y + (ty - p.y) * tail).lineTo(bx, by)
            .stroke({ color: ELEMENTS[active], alpha: 0.75, width: 1.4, cap: 'round' })
          fx.circle(bx, by, 1.8).fill(ELEMENTS[active])
        }

        // Enemies: pushed out by the shock ring, then creep back in
        const push = (1 - Math.exp(-10 * since)) * Math.exp(-since / 1.4)
        for (const e of ENEMIES) {
          const a = e.a + 0.18 * Math.sin(T * 0.7 + e.ph)
          const r = e.r + 1.5 * Math.sin(T * 1.3 + e.ph) + push * (30 - e.r * 0.5)
          const x = CX + Math.cos(a) * r, y = CY + Math.sin(a) * r * TILT
          fx.circle(x, y, 2.3).fill(0xc8566a).stroke({ color: 0x2a0c14, width: 0.6 })
        }

        // Players
        for (const p of PLAYERS) {
          const x = p.x + Math.sin(T * 0.9 + p.ph) * 2.5
          const y = p.y + Math.cos(T * 0.7 + p.ph) * 1.5
          const dx = CX - x, dy = CY - y, len = Math.hypot(dx, dy)
          fx.ellipse(x, y + 2.6, 3, 1.1).fill({ color: 0x000000, alpha: 0.4 })
          fx.circle(x, y, 2.8).fill(p.color).stroke({ color: 0xffffff, alpha: 0.85, width: 0.7 })
          fx.moveTo(x + (dx / len) * 3.4, y + (dy / len) * 3.4).lineTo(x + (dx / len) * 5.4, y + (dy / len) * 5.4)
            .stroke({ color: 0xffffff, alpha: 0.8, width: 0.9, cap: 'round' })
        }

        // Meteor streak
        if (m >= IMPACT - FLIGHT && m < IMPACT) {
          const p = (m - (IMPACT - FLIGHT)) / FLIGHT
          const q = p * p
          const sx = 215, sy = -25
          const x = sx + (CX - sx) * q, y = sy + (CY - sy) * q
          const dx = CX - sx, dy = CY - sy, len = Math.hypot(dx, dy)
          for (let j = 4; j >= 1; j--) {
            const t = j * 7
            fx.moveTo(x - (dx / len) * t, y - (dy / len) * t).lineTo(x - (dx / len) * (t - 7), y - (dy / len) * (t - 7))
              .stroke({ color: 0xff8a2a, alpha: 0.6 - j * 0.12, width: 4.5 - j * 0.8, cap: 'round' })
          }
          fx.circle(x, y, 6).fill({ color: 0xff8a2a, alpha: 0.35 })
          fx.circle(x, y, 3.2).fill(0xfff0c0)
        }

        // Impact: flash + expanding shock ring
        if (since < 0.8) {
          const s = since / 0.8
          const flash = clamp01(1 - since / 0.25)
          if (flash > 0) fx.ellipse(CX, CY, 26, 26 * TILT).fill({ color: 0xffd9a0, alpha: 0.55 * flash })
          const ring = 8 + (1 - Math.pow(1 - s, 3)) * 64
          fx.ellipse(CX, CY, ring, ring * TILT).stroke({ color: 0xffb060, alpha: 0.9 * (1 - s), width: 3 - 2.4 * s })
          fx.ellipse(CX, CY, ring * 0.82, ring * 0.82 * TILT).stroke({ color: 0xff6a2a, alpha: 0.35 * (1 - s), width: 1 })
        }
      }

      if (still) {
        // One representative frame: the shock ring mid-expansion
        app.ticker.stop()
        draw(IMPACT + 0.28)
        app.render()
        return
      }

      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) app.ticker.start()
        else app.ticker.stop()
      })
      io.observe(container)

      let T = 1.2
      app.ticker.add((ticker) => {
        T += Math.min(ticker.deltaMS, 100) / 1000
        draw(T)
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
