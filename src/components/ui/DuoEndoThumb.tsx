import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { prefersReducedMotion } from '../../lib/gsap'

const W = 200
const H = 120

// DuoEndo's own palette
const INDIGO = 0x17142b
const VIOLET = 0x8b70ff
const VIOLET_DK = 0x6347e0
const TEAL = 0x2dd4bf
const GREEN = 0x17a673
const GREEN_DK = 0x0e7a54
const GOLD = 0xf5c518
const GOLD_DK = 0xb98f06
const LOCKED = 0x2c2752
const LOCKED_DK = 0x1f1b3d
const LOCKED_INK = 0x4a4385

const SPACING = 27     // vertical distance between lesson nodes
const ANCHOR_Y = 84    // screen y the camera parks the current node at
const NODE_R = 8.5
const STEP = 1.9       // seconds per lesson: scroll, pulse, complete, hop

// Timeline inside one step (seconds)
const SCROLL_END = 0.5
const COMPLETE_AT = 0.95
const HOP_START = 1.2
const HOP_END = 1.7

const nodeX = (i: number) => 100 + 30 * Math.sin(i * 0.9)
const isChest = (i: number) => i % 5 === 4

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const easeInOut = (v: number) => v * v * (3 - 2 * v)

// Faint background bokeh, scrolled at parallax for depth
const BOKEH = [
  { x: 24, y: 30, r: 16 }, { x: 178, y: 52, r: 20 }, { x: 34, y: 96, r: 12 },
  { x: 168, y: 112, r: 14 }, { x: 186, y: 10, r: 9 }, { x: 14, y: 140, r: 18 },
]

export default function DuoEndoThumb() {
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

      const bg = new PIXI.Graphics()
      const world = new PIXI.Graphics()
      const mascot = new PIXI.Graphics()
      const hud = new PIXI.Graphics()
      app.stage.addChild(bg, world, mascot, hud)

      bg.rect(0, 0, W, H).fill(INDIGO)

      // Mascot: a round blob, front end (violet) and back end (teal).
      // Drawn once with its feet at (0, 0); only its transform changes.
      mascot
        .circle(0, -6.2, 6.4).fill(VIOLET)
        .moveTo(0, -12.6).arc(0, -6.2, 6.4, -Math.PI / 2, Math.PI / 2).closePath().fill(TEAL)
        .moveTo(0, -12.6).lineTo(0, 0.2).stroke({ color: INDIGO, alpha: 0.25, width: 0.6 })
        .ellipse(-1.2, -14, 1.6, 2.6).fill(TEAL)          // sprout
        .ellipse(1.4, -14.2, 1.6, 2.4).fill(VIOLET)
        .circle(-2.3, -7, 1.7).fill(0xffffff)
        .circle(2.3, -7, 1.7).fill(0xffffff)
        .circle(-2, -6.8, 0.85).fill(INDIGO)
        .circle(2.6, -6.8, 0.85).fill(INDIGO)
        .circle(-4.2, -4.6, 0.9).fill({ color: 0xff8fb8, alpha: 0.55 })
        .circle(4.2, -4.6, 0.9).fill({ color: 0xff8fb8, alpha: 0.55 })

      function drawNode(i: number, x: number, y: number, done: boolean, current: boolean, pop: number) {
        const r = NODE_R * (1 + pop)
        const chest = isChest(i)
        let top = LOCKED, base = LOCKED_DK
        if (done || current) { top = chest ? GOLD : done ? GREEN : VIOLET; base = chest ? GOLD_DK : done ? GREEN_DK : VIOLET_DK }
        else if (chest) { top = 0x3b3322; base = 0x2a2418 }

        world.circle(x, y + 2.6, r).fill(base)
        world.circle(x, y, r).fill(top)
        world.circle(x - r * 0.35, y - r * 0.38, r * 0.3).fill({ color: 0xffffff, alpha: done || current ? 0.22 : 0.06 })

        if (done && !chest) {
          world
            .moveTo(x - 3.6, y + 0.2).lineTo(x - 1, y + 2.8).lineTo(x + 3.8, y - 2.6)
            .stroke({ color: 0xffffff, width: 2.2, cap: 'round', join: 'round' })
        } else if (chest) {
          world.star(x, y + 0.3, 5, 4.2, 1.9).fill(done || current ? 0xffffff : 0x6d5c2c)
        } else if (current) {
          world.star(x, y + 0.3, 5, 4, 1.8).fill(0xffffff)
        } else {
          world.circle(x, y, 2.4).fill(LOCKED_INK)
        }
      }

      function draw(T: number) {
        const k = Math.floor(T / STEP)
        const u = T - k * STEP
        const cam = k - 1 + easeInOut(clamp01(u / SCROLL_END))
        const completed = u >= COMPLETE_AT
        const currentIdx = completed ? k + 1 : k
        const sy = (i: number) => ANCHOR_Y - (i - cam) * SPACING

        world.clear()

        // Parallax bokeh
        const drift = cam * SPACING * 0.35
        for (const b of BOKEH) {
          const y = ((b.y + drift) % (H + 60)) - 30
          world.circle(b.x, y, b.r).fill({ color: VIOLET, alpha: 0.05 })
        }

        const first = Math.floor(cam - (H - ANCHOR_Y) / SPACING) - 1
        const last = Math.ceil(cam + ANCHOR_Y / SPACING) + 1

        // Connector dots between lessons
        for (let i = first; i < last; i++) {
          const x1 = nodeX(i), y1 = sy(i), x2 = nodeX(i + 1), y2 = sy(i + 1)
          const lit = i + 1 <= k || (i + 1 === k + 1 && completed)
          for (const f of [0.32, 0.5, 0.68]) {
            world.circle(x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, 1.4)
              .fill({ color: lit ? GREEN : LOCKED, alpha: lit ? 0.7 : 1 })
          }
        }

        // Pulsing ring on the current lesson
        {
          const x = nodeX(currentIdx), y = sy(currentIdx)
          const ringCol = isChest(currentIdx) ? GOLD : VIOLET
          const breathe = 0.5 + 0.5 * Math.sin(T * 4.2)
          world.circle(x, y + 1, NODE_R + 3.4 + breathe * 1.2).stroke({ color: ringCol, alpha: 0.55 + 0.3 * breathe, width: 2 })
          const ripple = (T * 0.8) % 1
          world.circle(x, y + 1, NODE_R + 4 + ripple * 9).stroke({ color: ringCol, alpha: 0.35 * (1 - ripple), width: 1.2 })
        }

        for (let i = first; i <= last; i++) {
          const done = i < k || (i === k && completed)
          const pop = i === k && completed ? 0.22 * Math.sin(Math.PI * clamp01((u - COMPLETE_AT) / 0.3)) : 0
          drawNode(i, nodeX(i), sy(i), done, i === currentIdx, pop)
        }

        // XP spark rising off the lesson just completed
        if (completed) {
          const s = clamp01((u - COMPLETE_AT) / 0.75)
          const x = nodeX(k) + 6, y = sy(k) - 10 - s * 16
          world.star(x, y, 4, 3.4 * (1 - s * 0.4), 1.2, s * 1.5).fill({ color: GOLD, alpha: 1 - s })
          world.circle(x - 9, y + 4, 1.2).fill({ color: GOLD, alpha: 0.8 * (1 - s) })
        }

        // Mascot: sits on node k, hops to k + 1
        const h = clamp01((u - HOP_START) / (HOP_END - HOP_START))
        const hopping = h > 0 && h < 1
        const from = k, to = k + 1
        const e = easeInOut(h)
        const mx = nodeX(from) + (nodeX(to) - nodeX(from)) * e
        const baseY = sy(from) + (sy(to) - sy(from)) * e - NODE_R + 1
        const arc = Math.sin(Math.PI * h) * 15
        let squash = 0.04 * Math.sin(T * 6)                         // idle breathing
        if (hopping) squash = -0.12 * Math.sin(Math.PI * h)         // stretch in the air
        const land = (u - HOP_END) / 0.18
        if (land >= 0 && land < 1) squash = 0.2 * Math.sin(Math.PI * land)
        const takeoff = (HOP_START - u) / 0.12
        if (takeoff > 0 && takeoff < 1) squash = 0.14 * Math.sin(Math.PI * (1 - takeoff))

        world.ellipse(mx, baseY + 1, 5.5 - arc * 0.15, 1.6).fill({ color: 0x000000, alpha: 0.28 })
        mascot.position.set(mx, baseY - arc)
        mascot.scale.set(1 + squash, 1 - squash)

        // HUD: XP bar fills towards the next chest
        const count = k + (completed ? 1 : 0)
        const prog = completed && isChest(k) ? 1 : (count % 5) / 5
        hud.clear()
        hud.rect(0, 0, W, 17).fill({ color: INDIGO, alpha: 0.94 })
        hud.rect(0, 17, W, 1).fill({ color: LOCKED, alpha: 0.9 })
        hud.poly([14, 4, 19, 8.5, 14, 13, 9, 8.5]).fill(GOLD)
        hud.poly([14, 4, 19, 8.5, 14, 8.5]).fill({ color: 0xffffff, alpha: 0.3 })
        hud.roundRect(24, 6, 64, 5, 2.5).fill(LOCKED)
        if (prog > 0) hud.roundRect(24, 6, Math.max(5, 64 * prog), 5, 2.5).fill(GOLD)
        // Streak: a teal flame + day pips
        hud.circle(166, 10, 3).fill(TEAL)
        hud.poly([163.2, 9.4, 166, 3.6, 168.8, 9.4]).fill(TEAL)
        for (let d = 0; d < 3; d++) hud.circle(175 + d * 6, 9, 1.6).fill({ color: TEAL, alpha: d < 2 ? 0.85 : 0.3 })
      }

      if (still) {
        // One representative frame: a lesson just completed, mascot mid-hop
        app.ticker.stop()
        draw(STEP * 6 + HOP_START + 0.22)
        app.render()
        return
      }

      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) app.ticker.start()
        else app.ticker.stop()
      })
      io.observe(container)

      let T = STEP * 6
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
