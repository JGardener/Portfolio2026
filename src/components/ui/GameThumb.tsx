import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'

export default function GameThumb() {
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
        width: 200,
        height: 120,
        backgroundAlpha: 0,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio, 2),
        autoDensity: true,
      })

      if (cancelled) {
        app.destroy(true, { children: true })
        return
      }

      initialized = true
      container.appendChild(app.canvas)

      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) app.ticker.start()
        else app.ticker.stop()
      })
      io.observe(container)

      const asteroids: { gfx: PIXI.Graphics; vx: number; vy: number; vr: number }[] = []

      function makeAsteroid(x: number, y: number, r: number) {
        const gfx = new PIXI.Graphics()
        const sides = 6 + Math.floor(Math.random() * 4)
        const points: number[] = []
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2
          const jitter = r * (0.75 + Math.random() * 0.35)
          points.push(Math.cos(angle) * jitter, Math.sin(angle) * jitter)
        }
        gfx.poly(points).stroke({ color: 0x4f8cff, alpha: 0.45, width: 1 })
        gfx.x = x
        gfx.y = y
        app.stage.addChild(gfx)
        return { gfx, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, vr: (Math.random() - 0.5) * 0.005 }
      }

      for (let i = 0; i < 5; i++) {
        asteroids.push(makeAsteroid(Math.random() * 200, Math.random() * 120, 10 + Math.random() * 12))
      }

      app.ticker.add(() => {
        for (const a of asteroids) {
          a.gfx.x += a.vx
          a.gfx.y += a.vy
          a.gfx.rotation += a.vr
          if (a.gfx.x < -20) a.gfx.x = 220
          if (a.gfx.x > 220) a.gfx.x = -20
          if (a.gfx.y < -20) a.gfx.y = 140
          if (a.gfx.y > 140) a.gfx.y = -20
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
