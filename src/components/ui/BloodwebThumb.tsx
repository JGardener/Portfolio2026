import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'

const W = 200
const H = 120
const CX = 100
const CY = 60
const R_INNER = 25
const R_OUTER = 48
const SPOKES = 6
const TO_RAD = Math.PI / 180

// Fixed jitter — stable geometry, not regenerated each render
const ANG_JITTER    = [ 10, -14,   8, -11,  16,  -6]  // degrees offset per spoke
const INNER_R_JITTER = [  4,  -3,   6,  -2,   3,  -5]  // inner radius offset
const OUTER_R_JITTER = [ -5,   4,  -4,   7,  -3,   5]  // outer radius offset
const SPOKE_CURVE   = [  3,  -4,   3,  -3,   4,  -2]  // perpendicular bow at spoke midpoint

const BASE_ANGLES = Array.from({ length: SPOKES }, (_, i) => i * (360 / SPOKES))

const innerNodes = BASE_ANGLES.map((base, i) => {
  const a = (base + ANG_JITTER[i]) * TO_RAD
  const r = R_INNER + INNER_R_JITTER[i]
  return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r }
})
const outerNodes = BASE_ANGLES.map((base, i) => {
  const a = (base + ANG_JITTER[i]) * TO_RAD
  const r = R_OUTER + OUTER_R_JITTER[i]
  return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r }
})

export default function BloodwebThumb() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    const app = new PIXI.Application()
    let cancelled = false
    let initialized = false
    let io: IntersectionObserver | undefined

    async function init() {
      await app.init({
        width: W,
        height: H,
        backgroundAlpha: 0,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio, 2),
        autoDensity: true,
      })

      if (cancelled) { app.destroy(true, { children: true }); return }

      initialized = true
      container.appendChild(app.canvas)

      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) app.ticker.start()
        else app.ticker.stop()
      })
      io.observe(container)

      // Graphics layers
      const spokeGfx  = new PIXI.Graphics()
      const ringGfx   = new PIXI.Graphics()
      const outerGfx  = new PIXI.Graphics()
      const innerGfx  = new PIXI.Graphics()
      const centerGfx = new PIXI.Graphics()
      app.stage.addChild(spokeGfx, ringGfx, outerGfx, innerGfx, centerGfx)

      // Draw static spokes (center → slightly past outer node, with organic curve)
      for (let i = 0; i < SPOKES; i++) {
        const out = outerNodes[i]
        const dx = out.x - CX
        const dy = out.y - CY
        const len = Math.sqrt(dx * dx + dy * dy)
        // Perpendicular unit vector for bowing the spoke
        const px = -dy / len
        const py =  dx / len
        const ex = out.x + (dx / len) * 4
        const ey = out.y + (dy / len) * 4
        const cpX = (CX + ex) / 2 + px * SPOKE_CURVE[i]
        const cpY = (CY + ey) / 2 + py * SPOKE_CURVE[i]
        spokeGfx.moveTo(CX, CY).quadraticCurveTo(cpX, cpY, ex, ey)
          .stroke({ color: 0x6B0000, alpha: 0.45, width: 0.8 })
      }

      // Draw web threads between adjacent nodes — bezier curves that sag slightly
      for (let i = 0; i < SPOKES; i++) {
        const n1i = innerNodes[i],  n2i = innerNodes[(i + 1) % SPOKES]
        const midIX = (n1i.x + n2i.x) / 2
        const midIY = (n1i.y + n2i.y) / 2
        // Pull 22% toward center so threads sag inward like a real web
        const cpIX = midIX * 0.78 + CX * 0.22
        const cpIY = midIY * 0.78 + CY * 0.22
        ringGfx.moveTo(n1i.x, n1i.y).quadraticCurveTo(cpIX, cpIY, n2i.x, n2i.y)
          .stroke({ color: 0x6B0000, alpha: 0.45, width: 0.8 })
        ringGfx.moveTo(n1i.x, n1i.y).quadraticCurveTo(cpIX, cpIY, n2i.x, n2i.y)
          .stroke({ color: 0xCC1111, alpha: 0.10, width: 2.5 })

        const n1o = outerNodes[i],  n2o = outerNodes[(i + 1) % SPOKES]
        const midOX = (n1o.x + n2o.x) / 2
        const midOY = (n1o.y + n2o.y) / 2
        // Outer threads: lighter pull toward center
        const cpOX = midOX * 0.91 + CX * 0.09
        const cpOY = midOY * 0.91 + CY * 0.09
        ringGfx.moveTo(n1o.x, n1o.y).quadraticCurveTo(cpOX, cpOY, n2o.x, n2o.y)
          .stroke({ color: 0x6B0000, alpha: 0.45, width: 0.8 })
        ringGfx.moveTo(n1o.x, n1o.y).quadraticCurveTo(cpOX, cpOY, n2o.x, n2o.y)
          .stroke({ color: 0xCC1111, alpha: 0.10, width: 2.5 })
      }

      // Per-inner-node random phase offsets for shimmer
      const shimmerPhase = innerNodes.map(() => Math.random() * Math.PI * 2)

      // Entity consumption state
      const CONSUME_INTERVAL = 70  // frames between consuming next outer node
      const TOTAL_CYCLE = CONSUME_INTERVAL * SPOKES + 60  // +60 frame pause before reset
      let consumedCount = 0  // 0–6; 0 = none consumed

      let frame = 0

      app.ticker.add(() => {
        frame++

        // Entity consumption cycle
        const cycleFrame = frame % TOTAL_CYCLE
        consumedCount = cycleFrame < CONSUME_INTERVAL * SPOKES
          ? Math.floor(cycleFrame / CONSUME_INTERVAL)
          : SPOKES

        // Draw outer nodes
        outerGfx.clear()
        outerNodes.forEach((n, i) => {
          const consumed = i < consumedCount
          if (consumed) {
            outerGfx.circle(n.x, n.y, 3.5).fill({ color: 0x2A0000, alpha: 0.55 })
          } else {
            // Brief "about to be consumed" flicker
            const nextIdx = consumedCount
            const frameIntoInterval = cycleFrame % CONSUME_INTERVAL
            const flicker = (i === nextIdx && frameIntoInterval > CONSUME_INTERVAL - 15)
              ? 0.5 + 0.5 * Math.sin(frameIntoInterval * 0.8)
              : 1
            outerGfx.circle(n.x, n.y, 4).fill({ color: 0xFF2222, alpha: 0.75 * flicker })
            outerGfx.circle(n.x, n.y, 6.5).fill({ color: 0xFF2222, alpha: 0.12 * flicker })
          }
        })

        // Draw inner nodes with shimmer
        innerGfx.clear()
        innerNodes.forEach((n, i) => {
          const shimmer = 0.65 + 0.15 * Math.sin(frame * 0.04 + shimmerPhase[i])
          innerGfx.circle(n.x, n.y, 3).fill({ color: 0xFF2222, alpha: shimmer })
          innerGfx.circle(n.x, n.y, 5).fill({ color: 0xFF2222, alpha: shimmer * 0.18 })
        })

        // Draw central pulsing node
        const pulse = 0.7 + 0.3 * Math.sin(frame * (2 * Math.PI / 90))
        centerGfx.clear()
        centerGfx.circle(CX, CY, 12).fill({ color: 0xFF2200, alpha: 0.06 * pulse })
        centerGfx.circle(CX, CY, 7).fill({ color: 0xFF5500, alpha: 0.20 * pulse })
        centerGfx.circle(CX, CY, 4).fill({ color: 0xFF6600, alpha: pulse })
        centerGfx.circle(CX, CY, 2).fill({ color: 0xFFCC44, alpha: pulse * 0.85 })
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
      style={{
        width: '200px',
        height: '120px',
        backgroundColor: 'var(--bg)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-md)',
        overflow: 'hidden',
      }}
    />
  )
}
