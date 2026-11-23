import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { prefersReducedMotion } from '../../lib/gsap'

// The box-front art: a live Asteroid Blaster scene drawn in the game's own
// vector look (stroked polygon rocks, a triangle ship, short bullets).
// Printed art, so the colours are fixed and do not follow the theme.
const ROCK = 0xf4f1e8
const SHIP = 0xffc400
const SHOT = 0xffc400
const STAR = 0xf4f1e8

interface Rock {
  gfx: PIXI.Graphics
  vx: number
  vy: number
  vr: number
  r: number
}

interface Shot {
  gfx: PIXI.Graphics
  vx: number
  vy: number
  life: number
}

function rockPoints(r: number): number[] {
  const sides = 8 + Math.floor(Math.random() * 4)
  const pts: number[] = []
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2
    const j = r * (0.72 + Math.random() * 0.36)
    pts.push(Math.cos(a) * j, Math.sin(a) * j)
  }
  return pts
}

export default function CoverArt() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const app = new PIXI.Application()
    const still = prefersReducedMotion()
    let cancelled = false
    let initialized = false
    let io: IntersectionObserver | undefined
    let ro: ResizeObserver | undefined

    async function init() {
      await app.init({
        resizeTo: host!,
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
      host!.appendChild(app.canvas)
      // resizeTo only listens to window resizes; the host also changes size
      // when fonts swap in and the title band reflows.
      ro = new ResizeObserver(() => {
        app.resize()
        if (still) app.render()
      })
      ro.observe(host!)

      const W = () => app.screen.width
      const H = () => app.screen.height
      const unit = () => Math.max(0.6, Math.min(W(), H()) / 520)

      // Starfield: one static layer.
      const stars = new PIXI.Graphics()
      app.stage.addChild(stars)
      const drawStars = () => {
        stars.clear()
        const count = Math.round((W() * H()) / 5200)
        for (let i = 0; i < count; i++) {
          stars
            .circle(Math.random() * W(), Math.random() * H(), Math.random() < 0.15 ? 1.4 : 0.8)
            .fill({ color: STAR, alpha: 0.25 + Math.random() * 0.45 })
        }
      }
      drawStars()
      app.renderer.on('resize', drawStars)

      const rocks: Rock[] = []
      const spawnRock = (size: number) => {
        const r = size * unit()
        const gfx = new PIXI.Graphics()
        gfx.poly(rockPoints(r)).fill({ color: 0x111111 }).stroke({ color: ROCK, width: 2.5 * unit(), alpha: 0.95 })
        // Keep the middle clear for the ship.
        const clear = Math.min(W(), H()) * 0.22
        const place = (): [number, number] => {
          const x = Math.random() * W()
          const y = Math.random() * H()
          return Math.hypot(x - W() * 0.5, y - H() * 0.55) < clear ? place() : [x, y]
        }
        const [x, y] = place()
        gfx.position.set(x, y)
        app.stage.addChild(gfx)
        const speed = (0.25 + Math.random() * 0.4) * (60 / size)
        const dir = Math.random() * Math.PI * 2
        rocks.push({ gfx, r, vx: Math.cos(dir) * speed, vy: Math.sin(dir) * speed, vr: (Math.random() - 0.5) * 0.012 })
      }
      ;[78, 64, 52, 44, 36, 30, 26, 22, 18, 16].forEach(spawnRock)

      const ship = new PIXI.Graphics()
      const s = 22 * unit()
      ship
        .poly([s, 0, -s * 0.75, -s * 0.62, -s * 0.4, 0, -s * 0.75, s * 0.62])
        .fill({ color: 0x111111 })
        .stroke({ color: SHIP, width: 3 * unit(), join: 'round' })
      ship.position.set(W() * 0.5, H() * 0.55)
      ship.rotation = -0.6
      app.stage.addChild(ship)

      const shots: Shot[] = []
      const fire = () => {
        const gfx = new PIXI.Graphics()
        const len = 10 * unit()
        gfx.moveTo(0, 0).lineTo(len, 0).stroke({ color: SHOT, width: 3 * unit(), cap: 'round' })
        gfx.rotation = ship.rotation
        gfx.position.set(ship.x + Math.cos(ship.rotation) * s, ship.y + Math.sin(ship.rotation) * s)
        app.stage.addChild(gfx)
        const v = 7 * unit()
        shots.push({ gfx, vx: Math.cos(ship.rotation) * v, vy: Math.sin(ship.rotation) * v, life: 70 })
      }

      if (still) {
        fire()
        shots[0].gfx.x += shots[0].vx * 6
        shots[0].gfx.y += shots[0].vy * 6
        app.ticker.stop()
        app.render()
        return
      }

      let t = 0
      app.ticker.add((tick) => {
        const dt = tick.deltaTime
        t += dt
        const w = W()
        const h = H()
        ship.position.set(w * 0.5, h * 0.55)
        ship.rotation = -0.6 + Math.sin(t * 0.012) * 1.4
        if (Math.floor(t) % 26 === 0 && Math.floor(t - dt) % 26 !== 0) fire()

        for (const r of rocks) {
          r.gfx.x += r.vx * dt
          r.gfx.y += r.vy * dt
          r.gfx.rotation += r.vr * dt
          const m = r.r + 4
          if (r.gfx.x < -m) r.gfx.x = w + m
          else if (r.gfx.x > w + m) r.gfx.x = -m
          if (r.gfx.y < -m) r.gfx.y = h + m
          else if (r.gfx.y > h + m) r.gfx.y = -m
        }
        for (let i = shots.length - 1; i >= 0; i--) {
          const sh = shots[i]
          sh.gfx.x += sh.vx * dt
          sh.gfx.y += sh.vy * dt
          sh.life -= dt
          if (sh.life <= 0) {
            sh.gfx.destroy()
            shots.splice(i, 1)
          }
        }
      })


      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) app.ticker.start()
        else app.ticker.stop()
      })
      io.observe(host!)
    }

    init()

    return () => {
      cancelled = true
      io?.disconnect()
      ro?.disconnect()
      if (initialized) app.destroy(true, { children: true })
    }
  }, [])

  return <div ref={hostRef} className="cover-art" aria-hidden="true" />
}
