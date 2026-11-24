import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { prefersReducedMotion } from '../../lib/gsap'

// Attract-mode Asteroid Blaster: the ship hunts the nearest rock, shots split
// big rocks into smaller ones, each hit throws a spark burst, and the HUD keeps
// score. Drawn in the cover art's vector look. Not playable, just a demo loop.
const W = 200
const H = 120
const SHIP = 0xffc400
const ROCK = 0xf4f1e8
const INK = 0x111111
const HUD = 0xf4f1e8

// Rock tiers: radius, speed (px per 60fps frame), points.
const TIERS = [
  { r: 11, speed: 0.22, points: 20 },
  { r: 6.5, speed: 0.38, points: 50 },
  { r: 3.6, speed: 0.55, points: 100 },
] as const

const ROCK_POOL = 28
const SHOT_POOL = 8
const SPARK_POOL = 64
const SHIP_SIZE = 5.5
const MAX_LIVES = 3

interface Rock {
  root: PIXI.Container
  tiers: PIXI.Graphics[]
  tier: number
  active: boolean
  vx: number
  vy: number
  vr: number
  age: number
}

interface Shot {
  gfx: PIXI.Graphics
  active: boolean
  vx: number
  vy: number
  life: number
}

interface Spark {
  sprite: PIXI.Sprite
  active: boolean
  vx: number
  vy: number
  life: number
  maxLife: number
}

function rockPoints(r: number): number[] {
  const sides = 8 + Math.floor(Math.random() * 3)
  const pts: number[] = []
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2
    const j = r * (0.72 + Math.random() * 0.36)
    pts.push(Math.cos(a) * j, Math.sin(a) * j)
  }
  return pts
}

function drawShip(g: PIXI.Graphics, s: number, width: number) {
  return g
    .poly([s, 0, -s * 0.75, -s * 0.62, -s * 0.4, 0, -s * 0.75, s * 0.62])
    .fill({ color: INK })
    .stroke({ color: SHIP, width, join: 'round' })
}

const wrap = (v: number, min: number, max: number) =>
  v < min ? v + (max - min) : v > max ? v - (max - min) : v

export default function GameThumb() {
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
      await app.init({
        width: W,
        height: H,
        backgroundAlpha: 0,
        antialias: true,
        // Rendered at 2x the device density: the box frames scale these up.
        resolution: Math.min(window.devicePixelRatio, 2) * 2,
        autoDensity: true,
      })

      if (cancelled) {
        app.destroy(true, { children: true })
        return
      }

      initialized = true
      container.appendChild(app.canvas)

      // ---- Static starfield ----
      const stars = new PIXI.Graphics()
      for (let i = 0; i < 34; i++) {
        stars
          .circle(Math.random() * W, Math.random() * H, Math.random() < 0.15 ? 0.55 : 0.32)
          .fill({ color: ROCK, alpha: 0.2 + Math.random() * 0.4 })
      }
      app.stage.addChild(stars)

      // ---- Rocks: each pool slot pre-builds one shape per tier ----
      const rockLayer = new PIXI.Container()
      app.stage.addChild(rockLayer)
      const rocks: Rock[] = []
      for (let i = 0; i < ROCK_POOL; i++) {
        const root = new PIXI.Container()
        const tiers = TIERS.map(({ r }) => {
          const g = new PIXI.Graphics()
          g.poly(rockPoints(r)).fill({ color: INK }).stroke({ color: ROCK, width: 1.15, alpha: 0.95, join: 'round' })
          g.visible = false
          root.addChild(g)
          return g
        })
        root.visible = false
        rockLayer.addChild(root)
        rocks.push({ root, tiers, tier: 0, active: false, vx: 0, vy: 0, vr: 0, age: 0 })
      }

      // ---- Shots ----
      const shotLayer = new PIXI.Container()
      app.stage.addChild(shotLayer)
      const shots: Shot[] = []
      for (let i = 0; i < SHOT_POOL; i++) {
        const gfx = new PIXI.Graphics()
        gfx.moveTo(-1.6, 0).lineTo(1.6, 0).stroke({ color: SHIP, width: 1.1, cap: 'round' })
        gfx.visible = false
        shotLayer.addChild(gfx)
        shots.push({ gfx, active: false, vx: 0, vy: 0, life: 0 })
      }

      // ---- Sparks: tinted 1px sprites ----
      const sparkLayer = new PIXI.Container()
      app.stage.addChild(sparkLayer)
      const sparks: Spark[] = []
      for (let i = 0; i < SPARK_POOL; i++) {
        const sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
        sprite.anchor.set(0.5)
        sprite.width = 1.3
        sprite.height = 1.3
        sprite.visible = false
        sparkLayer.addChild(sprite)
        sparks.push({ sprite, active: false, vx: 0, vy: 0, life: 0, maxLife: 1 })
      }

      // ---- Ship + thrust flame ----
      const ship = new PIXI.Container()
      const flame = new PIXI.Graphics()
      flame
        .poly([-SHIP_SIZE * 0.42, -SHIP_SIZE * 0.26, -SHIP_SIZE * 1.15, 0, -SHIP_SIZE * 0.42, SHIP_SIZE * 0.26])
        .fill({ color: 0xff7a1a, alpha: 0.9 })
      flame.visible = false
      ship.addChild(flame)
      ship.addChild(drawShip(new PIXI.Graphics(), SHIP_SIZE, 1.2))
      app.stage.addChild(ship)

      // ---- HUD: text built once, only .text updated afterwards ----
      const hudStyle = new PIXI.TextStyle({
        fontFamily: 'ui-monospace, "Cascadia Mono", Consolas, "Courier New", monospace',
        fontSize: 6.5,
        fontWeight: '700',
        fill: HUD,
        letterSpacing: 0.6,
      })
      const scoreText = new PIXI.Text({ text: '00000', style: hudStyle })
      scoreText.position.set(5, 3.5)
      const levelText = new PIXI.Text({ text: 'LEVEL 1', style: hudStyle })
      levelText.anchor.set(1, 0)
      levelText.position.set(W - 5, 3.5)
      app.stage.addChild(scoreText, levelText)

      const lifeIcons: PIXI.Graphics[] = []
      for (let i = 0; i < MAX_LIVES; i++) {
        const icon = drawShip(new PIXI.Graphics(), 2.6, 0.7)
        icon.rotation = -Math.PI / 2
        icon.position.set(7 + i * 6, 16.5)
        app.stage.addChild(icon)
        lifeIcons.push(icon)
      }

      // ---- Game state ----
      let score = 0
      let shownScore = -1
      let level = 1
      let shownLevel = 1
      let lives = MAX_LIVES
      let shipVx = 0
      let shipVy = 0
      let fireCooldown = 30
      let waveDelay = 0
      let nextLevel = 1
      let respawn = 0 // frames until the ship reappears after a crash
      let flameFlicker = 0

      const syncHud = () => {
        if (score !== shownScore) {
          shownScore = score
          scoreText.text = String(score).padStart(5, '0')
        }
        if (level !== shownLevel) {
          shownLevel = level
          levelText.text = `LEVEL ${level}`
        }
        for (let i = 0; i < MAX_LIVES; i++) lifeIcons[i].visible = i < lives
      }

      const spawnRock = (tier: number, x: number, y: number, dir: number) => {
        for (const rock of rocks) {
          if (rock.active) continue
          rock.active = true
          rock.tier = tier
          for (let t = 0; t < rock.tiers.length; t++) rock.tiers[t].visible = t === tier
          rock.root.visible = true
          rock.root.position.set(x, y)
          const speed = TIERS[tier].speed * (0.8 + Math.random() * 0.4)
          rock.vx = Math.cos(dir) * speed
          rock.vy = Math.sin(dir) * speed
          rock.vr = (Math.random() - 0.5) * 0.03
          // New waves fade in; split fragments appear at full strength.
          rock.age = tier === 0 ? 0 : 30
          rock.root.alpha = tier === 0 ? 0 : 1
          return
        }
      }

      const spawnWave = () => {
        const count = Math.min(3 + level, 6)
        for (let i = 0; i < count; i++) {
          // Drop the wave in-frame (an attract loop has no time to wait for
          // rocks to drift in), spread out and well clear of the ship.
          let x = 0
          let y = 0
          for (let tries = 0; tries < 12; tries++) {
            x = 14 + Math.random() * (W - 28)
            y = 26 + Math.random() * (H - 40)
            if (Math.hypot(x - ship.x, y - ship.y) > 42) break
          }
          spawnRock(0, x, y, Math.random() * Math.PI * 2)
        }
      }

      const burst = (x: number, y: number, n: number, color: number, speed: number) => {
        let made = 0
        for (const s of sparks) {
          if (made >= n) break
          if (s.active) continue
          const a = Math.random() * Math.PI * 2
          const v = speed * (0.35 + Math.random() * 0.65)
          s.active = true
          s.vx = Math.cos(a) * v
          s.vy = Math.sin(a) * v
          s.maxLife = 18 + Math.random() * 16
          s.life = s.maxLife
          s.sprite.tint = color
          s.sprite.alpha = 1
          s.sprite.position.set(x, y)
          s.sprite.visible = true
          made++
        }
      }

      const fire = () => {
        for (const s of shots) {
          if (s.active) continue
          const c = Math.cos(ship.rotation)
          const sn = Math.sin(ship.rotation)
          s.active = true
          s.life = 42
          s.vx = c * 3 + shipVx
          s.vy = sn * 3 + shipVy
          s.gfx.rotation = ship.rotation
          s.gfx.position.set(ship.x + c * SHIP_SIZE, ship.y + sn * SHIP_SIZE)
          s.gfx.visible = true
          return
        }
      }

      const killRock = (rock: Rock) => {
        // Read everything first: the split below can reuse this very slot.
        const { x, y } = rock.root.position
        const tier = rock.tier
        const base = Math.atan2(rock.vy, rock.vx)
        rock.active = false
        rock.root.visible = false
        score += TIERS[tier].points
        burst(x, y, tier === 0 ? 12 : 8, tier === 2 ? SHIP : ROCK, 0.9)
        if (tier < TIERS.length - 1) {
          // Split perpendicular-ish to the rock's travel, like the arcade.
          spawnRock(tier + 1, x, y, base + 0.9 + Math.random() * 0.4)
          spawnRock(tier + 1, x, y, base - 0.9 - Math.random() * 0.4)
        }
      }

      const resetShip = () => {
        ship.position.set(W * 0.5, H * 0.58)
        ship.rotation = -Math.PI / 2
        shipVx = 0
        shipVy = 0
      }

      resetShip()
      spawnWave()
      syncHud()

      const update = (dt: number) => {
        // -- Ship AI: turn toward the nearest rock (with lead), fire when aligned.
        let target: Rock | undefined
        let best = Infinity
        let rocksLeft = 0
        for (const rock of rocks) {
          if (!rock.active) continue
          rocksLeft++
          const d = Math.hypot(rock.root.x - ship.x, rock.root.y - ship.y)
          if (d < best) {
            best = d
            target = rock
          }
        }

        if (respawn > 0) {
          respawn -= dt
          ship.visible = respawn <= 0 || Math.floor(respawn / 5) % 2 === 0
          if (respawn <= 0) ship.visible = true
        }

        let thrusting = false
        if (target && respawn <= 0) {
          const lead = best / 3
          const tx = target.root.x + target.vx * lead
          const ty = target.root.y + target.vy * lead
          const want = Math.atan2(ty - ship.y, tx - ship.x)
          let diff = want - ship.rotation
          diff = Math.atan2(Math.sin(diff), Math.cos(diff))
          const turn = 0.07 * dt
          ship.rotation += Math.max(-turn, Math.min(turn, diff))

          fireCooldown -= dt
          if (Math.abs(diff) < 0.14 && fireCooldown <= 0 && best < 110) {
            fire()
            fireCooldown = 16
          }
          // Close the distance on far targets; back off when crowded.
          if (best > 62) thrusting = true
        }

        if (thrusting) {
          shipVx += Math.cos(ship.rotation) * 0.025 * dt
          shipVy += Math.sin(ship.rotation) * 0.025 * dt
        }
        const drag = Math.pow(0.985, dt)
        shipVx *= drag
        shipVy *= drag
        const sp = Math.hypot(shipVx, shipVy)
        if (sp > 0.9) {
          shipVx = (shipVx / sp) * 0.9
          shipVy = (shipVy / sp) * 0.9
        }
        ship.x = wrap(ship.x + shipVx * dt, -6, W + 6)
        ship.y = wrap(ship.y + shipVy * dt, -6, H + 6)
        flameFlicker += dt
        flame.visible = thrusting && Math.floor(flameFlicker / 3) % 2 === 0

        // -- Rocks drift and wrap.
        for (const rock of rocks) {
          if (!rock.active) continue
          const r = TIERS[rock.tier].r
          rock.root.x = wrap(rock.root.x + rock.vx * dt, -r - 2, W + r + 2)
          rock.root.y = wrap(rock.root.y + rock.vy * dt, -r - 2, H + r + 2)
          rock.root.rotation += rock.vr * dt
          if (rock.age < 30) {
            rock.age += dt
            rock.root.alpha = Math.min(1, rock.age / 30)
            continue // still materialising: can't hit the ship yet
          }

          // Ship crash: lose a life, respawn blinking; game over restarts.
          if (respawn <= 0 && Math.hypot(rock.root.x - ship.x, rock.root.y - ship.y) < r + SHIP_SIZE * 0.6) {
            burst(ship.x, ship.y, 16, SHIP, 1.1)
            killRock(rock)
            lives--
            if (lives <= 0) {
              lives = MAX_LIVES
              score = 0
              nextLevel = 1
              for (const other of rocks) {
                other.active = false
                other.root.visible = false
              }
              waveDelay = 50
            }
            resetShip()
            respawn = 70
          }
        }

        // -- Shots fly, expire, and hit rocks.
        for (const s of shots) {
          if (!s.active) continue
          s.gfx.x = wrap(s.gfx.x + s.vx * dt, 0, W)
          s.gfx.y = wrap(s.gfx.y + s.vy * dt, 0, H)
          s.life -= dt
          if (s.life <= 0) {
            s.active = false
            s.gfx.visible = false
            continue
          }
          for (const rock of rocks) {
            if (!rock.active) continue
            const r = TIERS[rock.tier].r
            const dx = rock.root.x - s.gfx.x
            const dy = rock.root.y - s.gfx.y
            if (dx * dx + dy * dy < r * r) {
              s.active = false
              s.gfx.visible = false
              killRock(rock)
              break
            }
          }
        }

        // -- Sparks fade out.
        for (const s of sparks) {
          if (!s.active) continue
          s.life -= dt
          if (s.life <= 0) {
            s.active = false
            s.sprite.visible = false
            continue
          }
          s.sprite.x += s.vx * dt
          s.sprite.y += s.vy * dt
          s.vx *= Math.pow(0.95, dt)
          s.vy *= Math.pow(0.95, dt)
          s.sprite.alpha = s.life / s.maxLife
        }

        // -- Wave cleared: next level after a beat.
        // (A game over clears the field and queues level 1 the same way.)
        if (rocksLeft === 0) {
          if (waveDelay <= 0) {
            waveDelay = 60
            nextLevel = level + 1
          }
          waveDelay -= dt
          if (waveDelay <= 0) {
            level = nextLevel
            spawnWave()
          }
        }

        syncHud()
      }

      if (reduced) {
        // One finished still: fast-forward the simulation to a moment with a
        // burst in the air and a shot on its way, then draw a single frame.
        app.ticker.stop()
        // Stop early in the first wave, while the rocks are still spread
        // across the frame rather than drifted off to the edges.
        for (let step = 0; step < 600; step++) {
          update(1)
          if (step > 40) {
            const liveSparks = sparks.reduce((n, s) => n + (s.active && s.life > s.maxLife * 0.6 ? 1 : 0), 0)
            const liveShots = shots.reduce((n, s) => n + (s.active ? 1 : 0), 0)
            if (liveSparks > 5 && liveShots > 0 && respawn <= 0) break
          }
        }
        flame.visible = true
        app.render()
        return
      }

      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) app.ticker.start()
        else app.ticker.stop()
      })
      io.observe(container)

      app.ticker.add((tick) => update(Math.min(tick.deltaTime, 3)))
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
