import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'

const W = 200
const H = 120
const COLS = 7
const ROWS = 5
const CELL = 9
const GAP = 2
const GREEN = 0x3fb950

export default function GithubHeatmapThumb() {
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

      // Grid layout: two grids side by side
      const gridW = COLS * (CELL + GAP) - GAP
      const gridH = ROWS * (CELL + GAP) - GAP
      const leftX = Math.round((W / 2 - gridW - 6) / 2)
      const rightX = W / 2 + 6 + Math.round((W / 2 - gridW - 6) / 2)
      const topY = Math.round((H - gridH) / 2)

      // Bake random base alphas for all cells
      const baseAlpha: number[][] = Array.from({ length: 2 }, () =>
        Array.from({ length: COLS * ROWS }, () => 0.08 + Math.random() * 0.27)
      )

      const gfx = new PIXI.Graphics()
      const divider = new PIXI.Graphics()
      app.stage.addChild(divider)
      app.stage.addChild(gfx)

      // Static divider
      divider
        .moveTo(W / 2, topY - 4)
        .lineTo(W / 2, topY + gridH + 4)
        .stroke({ color: 0xffffff, alpha: 0.08, width: 0.5 })

      let frame = 0
      const PERIOD = 180

      app.ticker.add(() => {
        frame = (frame + 1) % PERIOD
        gfx.clear()

        // Wave: a gaussian pulse moving from x=0 to x=W
        const waveX = (frame / PERIOD) * (W + 60) - 30
        const sigma = 22

        for (let side = 0; side < 2; side++) {
          const originX = side === 0 ? leftX : rightX
          for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS; row++) {
              const cx = originX + col * (CELL + GAP) + CELL / 2
              const dy = cx - waveX
              const wave = Math.exp(-(dy * dy) / (2 * sigma * sigma)) * 0.55
              const alpha = Math.min(1, baseAlpha[side][col * ROWS + row] + wave)
              const x = originX + col * (CELL + GAP)
              const y = topY + row * (CELL + GAP)
              gfx.rect(x, y, CELL, CELL).fill({ color: GREEN, alpha })
            }
          }
        }
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
