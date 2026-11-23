import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { prefersReducedMotion } from '../../lib/gsap'

const W = 200
const H = 120

const SKY = 0x151b27
const GRIME = 0x5d6977
const GRIME_DK = 0x4c5764
const GRIME_LT = 0x6f7b89
const CLAY = 0xe09a74
const CLAY_LT = 0xf2bf98
const CLAY_DK = 0xc77b58
const INK = 0x2a191c

// The sleeping giant's shoulder: one long cubic curve pair
const P0 = [-4, 82], C1 = [34, 58], C2 = [84, 34], P1 = [128, 38]
const C3 = [162, 41], C4 = [188, 56], P2 = [204, 74]

function bez(a: number[], b: number[], c: number[], d: number[], t: number) {
  const u = 1 - t
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ]
}

// Sampled top edge so anything can ask "where is the stone at x?"
const EDGE: number[][] = []
for (let i = 0; i <= 40; i++) EDGE.push(bez(P0, C1, C2, P1, i / 40))
for (let i = 1; i <= 40; i++) EDGE.push(bez(P1, C3, C4, P2, i / 40))
function topY(x: number) {
  for (let i = 1; i < EDGE.length; i++) {
    if (EDGE[i][0] >= x) {
      const [x0, y0] = EDGE[i - 1], [x1, y1] = EDGE[i]
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0 || 1)
    }
  }
  return EDGE[EDGE.length - 1][1]
}

function shoulder(g: PIXI.Graphics, dy = 0) {
  return g.moveTo(P0[0], P0[1] + dy)
    .bezierCurveTo(C1[0], C1[1] + dy, C2[0], C2[1] + dy, P1[0], P1[1] + dy)
    .bezierCurveTo(C3[0], C3[1] + dy, C4[0], C4[1] + dy, P2[0], P2[1] + dy)
}

// Duster route: back-and-forth passes, each clipped to the stone at that height
const ROWS = [45, 58, 71, 84, 97, 110]
const SPEED = 125 // px per second
const ROUTE: number[][] = []
ROWS.forEach((y, r) => {
  let x0 = 12, x1 = 188
  while (topY(x0) > y - 7 && x0 < 100) x0 += 2
  while (topY(x1) > y - 7 && x1 > 100) x1 -= 2
  if (r % 2) ROUTE.push([x1, y], [x0, y])
  else ROUTE.push([x0, y], [x1, y])
})
const ROUTE_T = [0]
for (let i = 1; i < ROUTE.length; i++) {
  const d = Math.hypot(ROUTE[i][0] - ROUTE[i - 1][0], ROUTE[i][1] - ROUTE[i - 1][1])
  ROUTE_T.push(ROUTE_T[i - 1] + d / SPEED)
}
const SWEEP = ROUTE_T[ROUTE_T.length - 1]
const INK_DELAY = 0.6   // the toon outline draws in behind the colour
const HOLD = 1.3
const SETTLE = 2.6
const CYCLE = SWEEP + INK_DELAY + HOLD + SETTLE
// A "region" is a band of two passes: sparkle when each band finishes
const REGION_DONE = [3, 7, 11].map((i) => ({ t: ROUTE_T[i], x: (ROUTE[i][0] + ROUTE[i - 1][0]) / 2, y: ROUTE[i][1] - 6 }))

function dusterAt(t: number) {
  const tt = Math.max(0, Math.min(SWEEP, t))
  let i = 1
  while (i < ROUTE_T.length - 1 && ROUTE_T[i] < tt) i++
  const f = (tt - ROUTE_T[i - 1]) / (ROUTE_T[i] - ROUTE_T[i - 1] || 1)
  const x = ROUTE[i - 1][0] + (ROUTE[i][0] - ROUTE[i - 1][0]) * f
  const y = ROUTE[i - 1][1] + (ROUTE[i][1] - ROUTE[i - 1][1]) * f
  return [x, y + Math.sin(tt * 13) * 2.2] // little scrubbing wiggle
}

const HOUSES = [
  { x: 101, w: 5, h: 3.5 }, { x: 109, w: 4, h: 3 }, { x: 118, w: 3, h: 7, spire: true },
  { x: 126, w: 5, h: 4 }, { x: 135, w: 4, h: 3 }, { x: 143, w: 4.5, h: 3.5 },
]
const TREES = [93, 114, 131, 150]

interface Puff { x: number; y: number; vx: number; vy: number; age: number; life: number }

export default function GiantsKeeperThumb() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    const app = new PIXI.Application()
    const still = prefersReducedMotion()
    let cancelled = false
    let initialized = false
    let io: IntersectionObserver | undefined
    let disposeExtras: (() => void) | undefined

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

      const res = app.renderer.resolution

      // --- Static art -------------------------------------------------------
      const sky = new PIXI.Graphics()
      sky.rect(0, 0, W, H).fill(SKY)
      sky.circle(30, 22, 9).fill({ color: 0xd8dee8, alpha: 0.12 })
      sky.circle(30, 22, 5.5).fill({ color: 0xe6ebf2, alpha: 0.55 })
      for (const [x, y] of [[62, 12], [80, 26], [150, 14], [172, 30], [188, 10], [12, 46], [48, 40]]) {
        sky.circle(x, y, 0.7).fill({ color: 0xffffff, alpha: 0.45 })
      }

      const grime = new PIXI.Graphics()
      shoulder(grime).lineTo(204, 124).lineTo(-4, 124).closePath().fill(GRIME)
      shoulder(grime, 4).stroke({ color: GRIME_LT, alpha: 0.45, width: 5 })
      for (const [x, y, rx, ry] of [[40, 96, 18, 7], [96, 70, 16, 6], [150, 92, 20, 8], [70, 112, 14, 5], [176, 70, 9, 5]]) {
        grime.ellipse(x, y, rx, ry).fill({ color: GRIME_DK, alpha: 0.55 })
      }
      for (let i = 0; i < 46; i++) {
        const x = (i * 53) % 196 + 2
        const y = topY(x) + 4 + ((i * 37) % 70)
        if (y < 118) grime.circle(x, y, 0.7 + (i % 3) * 0.3).fill({ color: i % 2 ? GRIME_LT : GRIME_DK, alpha: 0.7 })
      }

      // Clean layer: warm terracotta stone
      const clean = new PIXI.Graphics()
      shoulder(clean).lineTo(204, 124).lineTo(-4, 124).closePath().fill(CLAY)
      shoulder(clean, 4.5).stroke({ color: CLAY_LT, alpha: 0.85, width: 6 })
      for (const [x, y, rx, ry] of [[52, 100, 16, 6], [104, 76, 13, 5], [156, 96, 17, 6], [182, 76, 8, 4]]) {
        clean.ellipse(x, y, rx, ry).fill({ color: CLAY_DK, alpha: 0.45 })
      }

      // Toon outline: silhouette edge plus muscle and stone-joint contours
      const ink = new PIXI.Graphics()
      shoulder(ink, 0.6).stroke({ color: INK, width: 2, cap: 'round' })
      ink.moveTo(58, 86).quadraticCurveTo(96, 58, 146, 66).stroke({ color: INK, width: 1.1, cap: 'round' })
      ink.moveTo(150, 68).quadraticCurveTo(170, 82, 168, 112).stroke({ color: INK, width: 1.1, cap: 'round' })
      ink.moveTo(30, 104).quadraticCurveTo(52, 94, 70, 98).stroke({ color: INK, width: 0.9, cap: 'round' })
      ink.moveTo(100, 90).lineTo(106, 96).lineTo(104, 103).moveTo(106, 96).lineTo(113, 98)
        .stroke({ color: INK, width: 0.8, cap: 'round', join: 'round' })
      ink.moveTo(124, 104).quadraticCurveTo(136, 100, 144, 108).stroke({ color: INK, width: 0.9, cap: 'round' })

      // Village on the crest, for scale
      const village = new PIXI.Graphics()
      for (const x of TREES) village.circle(x, topY(x) - 2, 2.2).fill(0x2f4a3c)
      for (const hs of HOUSES) {
        const base = topY(hs.x) + 0.8
        village.rect(hs.x - hs.w / 2, base - hs.h, hs.w, hs.h).fill(0xd9d1c2)
        const roofH = hs.spire ? 4.5 : 2.6
        village.poly([hs.x - hs.w / 2 - 0.8, base - hs.h, hs.x, base - hs.h - roofH, hs.x + hs.w / 2 + 0.8, base - hs.h])
          .fill(0x9a4535)
        village.rect(hs.x - 0.6, base - hs.h + 1, 1.2, 1.2).fill(0xffc86a)
      }

      // --- Reveal masks: soft brush stamped into two render textures --------
      const brushCanvas = document.createElement('canvas')
      brushCanvas.width = brushCanvas.height = 64
      const ctx = brushCanvas.getContext('2d')!
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      grad.addColorStop(0, 'rgba(255,255,255,1)')
      grad.addColorStop(0.5, 'rgba(255,255,255,1)')
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 64, 64)
      const brushTex = PIXI.Texture.from(brushCanvas)

      const rtClean = PIXI.RenderTexture.create({ width: W, height: H, resolution: res })
      const rtInk = PIXI.RenderTexture.create({ width: W, height: H, resolution: res })
      const cleanMask = new PIXI.Sprite(rtClean)
      const inkMask = new PIXI.Sprite(rtInk)
      clean.mask = cleanMask
      ink.mask = inkMask

      const STAMPS = 16
      const stampLayer = new PIXI.Container()
      const stamps = Array.from({ length: STAMPS }, () => {
        const s = new PIXI.Sprite(brushTex)
        s.anchor.set(0.5)
        s.width = s.height = 25
        s.alpha = 0.5
        stampLayer.addChild(s)
        return s
      })
      const empty = new PIXI.Container()

      function wipe() {
        app.renderer.render({ container: empty, target: rtClean, clear: true })
        app.renderer.render({ container: empty, target: rtInk, clear: true })
      }

      // Stamp the brush along the route between two times, batching sprites
      function stampRoute(rt: PIXI.RenderTexture, t0: number, t1: number) {
        if (t1 <= t0 || t0 >= SWEEP) return
        const [ax, ay] = dusterAt(t0), [bx, by] = dusterAt(t1)
        const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 1.8))
        let used = 0
        for (let j = 1; j <= n; j++) {
          const [x, y] = dusterAt(t0 + ((t1 - t0) * j) / n)
          const s = stamps[used++]
          s.visible = true
          s.position.set(x, y)
          if (used === STAMPS || j === n) {
            for (let k = used; k < STAMPS; k++) stamps[k].visible = false
            app.renderer.render({ container: stampLayer, target: rt, clear: false })
            used = 0
          }
        }
      }

      const dust = new PIXI.Graphics()
      const sparkle = new PIXI.Graphics()
      const handle = new PIXI.Graphics()
      const head = new PIXI.Graphics()
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2
        head.circle(Math.cos(a) * 6.6, Math.sin(a) * 6.6, 3.4).fill(0xe3d3b6)
      }
      head.circle(0, 0, 7.2).fill(0xf3e9d5)
      head.circle(-2, -2.2, 3).fill({ color: 0xffffff, alpha: 0.45 })
      head.circle(1.6, 1.8, 2.4).fill({ color: 0xd6c4a4, alpha: 0.6 })

      app.stage.addChild(sky, grime, clean, ink, village, cleanMask, inkMask, dust, sparkle, handle, head)
      disposeExtras = () => {
        stampLayer.destroy({ children: true })
        empty.destroy()
        brushTex.destroy(true)
        rtClean.destroy(true)
        rtInk.destroy(true)
      }

      // --- Simulation -------------------------------------------------------
      const puffs: Puff[] = Array.from({ length: 14 }, () => ({ x: 0, y: 0, vx: 0, vy: 0, age: 1, life: 1 }))
      let t = 0
      let spawnAcc = 0
      let prevX = dusterAt(0)[0]
      wipe()

      function step(dt: number) {
        const prev = t
        t += dt
        if (t >= CYCLE) {
          t = 0
          wipe()
          clean.alpha = ink.alpha = 1
          return
        }

        stampRoute(rtClean, prev, t)
        stampRoute(rtInk, prev - INK_DELAY, t - INK_DELAY)

        // Grime settles back over everything, slowly
        const settle = (t - (SWEEP + INK_DELAY + HOLD)) / SETTLE
        clean.alpha = ink.alpha = settle > 0 ? 1 - settle * settle * (3 - 2 * settle) : 1

        // Duster + handle reaching in from the bottom-right (first person)
        const [x, y] = dusterAt(t)
        const parked = t > SWEEP
        const restX = parked ? x + Math.min(1, (t - SWEEP) * 1.2) * 30 : x
        const restY = parked ? y + Math.min(1, (t - SWEEP) * 1.2) * 18 : y
        head.position.set(restX, restY)
        head.rotation = Math.sin(t * 13) * 0.25
        handle.clear()
          .moveTo(restX + 4, restY + 4).lineTo(214, 150).stroke({ color: 0x6e4630, width: 4, cap: 'round' })
          .moveTo(restX + 4, restY + 3).lineTo(213, 148).stroke({ color: 0xa8734f, width: 1.2, cap: 'round' })

        // Dust puffs shed while sweeping
        const dir = Math.sign(x - prevX)
        prevX = x
        spawnAcc += dt
        if (!parked && spawnAcc > 0.07) {
          spawnAcc = 0
          const p = puffs.find((q) => q.age >= q.life)
          if (p) {
            p.x = x - dir * 7 + (Math.random() - 0.5) * 6
            p.y = y + (Math.random() - 0.5) * 6
            p.vx = -dir * (6 + Math.random() * 6)
            p.vy = -6 - Math.random() * 8
            p.age = 0
            p.life = 0.8 + Math.random() * 0.5
          }
        }
        dust.clear()
        for (const p of puffs) {
          if (p.age >= p.life) continue
          p.age += dt
          p.x += p.vx * dt
          p.y += p.vy * dt
          p.vx *= 0.97
          const k = Math.min(1, p.age / p.life)
          dust.circle(p.x, p.y, 1.2 + k * 2.6).fill({ color: 0xb3bcc6, alpha: 0.5 * (1 - k) })
        }

        // Chime sparkle when a region comes fully clean (once its ink is in)
        sparkle.clear()
        for (const r of REGION_DONE) {
          const s = (t - r.t - INK_DELAY) / 0.9
          if (s < 0 || s > 1) continue
          sparkle.circle(r.x, r.y, 4 + s * 14).stroke({ color: 0xfff1c4, alpha: 0.35 * (1 - s), width: 0.8 })
          const pts = [[0, 0, 0], [-9, 4, 0.15], [8, -5, 0.3]]
          for (const [ox, oy, d] of pts) {
            const q = Math.max(0, Math.min(1, (s - d) / 0.6))
            if (q <= 0 || q >= 1) continue
            const sz = Math.sin(Math.PI * q) * 3.8
            sparkle.star(r.x + ox, r.y + oy - q * 3, 4, sz, sz * 0.28).fill({ color: 0xfff4d0, alpha: 0.95 })
          }
        }
      }

      if (still) {
        // One representative frame: two thirds swept, outline caught up
        app.ticker.stop()
        const target = REGION_DONE[1].t + INK_DELAY + 0.35
        while (t < target) step(1 / 60)
        app.render()
        return
      }

      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) app.ticker.start()
        else app.ticker.stop()
      })
      io.observe(container)

      app.ticker.add((ticker) => step(Math.min(ticker.deltaMS, 100) / 1000))
    }

    init()

    return () => {
      cancelled = true
      if (initialized && app.canvas.parentNode) {
        io?.disconnect()
        app.destroy(true, { children: true })
        disposeExtras?.()
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
