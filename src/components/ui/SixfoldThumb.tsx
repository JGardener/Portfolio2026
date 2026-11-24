import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { prefersReducedMotion } from '../../lib/gsap'

const W = 200
const H = 120
const TILT = 0.6 // ground ellipses squashed for the angled camera

// Element colours: six ability slots, no classes
const FIRE = 0xff7a1a
const FROST = 0x5ab8ff
const LIGHT = 0xffe14a
const ARCANE = 0xa070ff
const NATURE = 0x5fd068
const BLOOD = 0xe0283c
const SLOT_COLORS = [FIRE, FROST, LIGHT, ARCANE, NATURE, BLOOD]
// Damage-number tints (lighter, so they read on the dark floor)
const N_PHYS = 0xffffff
const N_FROST = 0xbfe6ff
const N_LIGHT = 0xfff2a0
const N_ARC = 0xd6c8ff
const N_NAT = 0xb6f2ae
const N_CRIT = 0xffb347

// Meteor climax: one every CYCLE seconds
const CYCLE = 9
const TELE = 6.0
const FALL = 6.8
const IMPACT = 7.2
const METEOR_R = 38

// Pools
const ENEMY_N = 26
const PART_N = 160
const COIN_N = 24
const ARROW_N = 24
const FX_N = 20
const NUM_N = 30
const SWARM = 22

// Hotbar
const SLOT = 12
const SLOT_GAP = 2
const BAR_X = (W - (6 * SLOT + 5 * SLOT_GAP)) / 2
const BAR_Y = 106

const FONT = 'SixfoldDmg'

interface Enemy { on: boolean; x: number; y: number; kx: number; ky: number; hp: number; kind: number; target: number; flash: number; frozen: number; atk: number; ph: number }
interface Hero { x: number; y: number; tx: number; ty: number; face: number; retarget: number; dash: number; act: number; mx: number; my: number }
interface Part { on: boolean; x: number; y: number; z: number; vx: number; vy: number; vz: number; age: number; life: number; color: number; size: number }
interface Coin { on: boolean; x: number; y: number; z: number; vx: number; vy: number; vz: number; age: number; color: number; beam: boolean }
interface Arrow { on: boolean; x: number; y: number; vx: number; vy: number; age: number; color: number; tint: number; dmg: number }
interface Fx { on: boolean; type: number; x: number; y: number; a: number; age: number; life: number; n: number; pts: Float32Array }
interface Num { t: PIXI.BitmapText; on: boolean; age: number; x: number; y: number; crit: boolean }

const ENEMY_BODY = [0x8a2f2f, 0xd8cfb8, 0x6a2f86] // imp, skeleton, brute
const ENEMY_HP = [16, 20, 46]
const ENEMY_SPEED = [24, 19, 13]
const ENEMY_SIZE = [1, 0.95, 1.4]

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const easeOut = (v: number) => 1 - (1 - v) * (1 - v)
const crossedAt = (prev: number, cur: number, a: number) => (prev < a && cur >= a) || (cur < prev && a <= cur)
const hash = (n: number) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s) }

function glyph(g: PIXI.Graphics, i: number, x: number, y: number, color: number, alpha: number) {
  switch (i) {
    case 0: g.poly([x, y - 3.2, x + 2.7, y + 2.5, x - 2.7, y + 2.5]).fill({ color, alpha }); break         // fire
    case 1: g.poly([x, y - 3.4, x + 2.3, y, x, y + 3.4, x - 2.3, y]).fill({ color, alpha }); break      // frost
    case 2: g.moveTo(x + 1.4, y - 3.4).lineTo(x - 1.4, y + 0.2).lineTo(x + 1.4, y + 0.2).lineTo(x - 1.4, y + 3.4)
      .stroke({ color, alpha, width: 1.1, join: 'round', cap: 'round' }); break                          // lightning
    case 3: g.star(x, y, 4, 3.4, 1.1).fill({ color, alpha }); break                                    // arcane
    case 4: g.ellipse(x, y, 1.9, 3.2).fill({ color, alpha }); break                                    // nature
    default: g.circle(x, y + 1, 2.3).fill({ color, alpha }).poly([x - 2, y, x, y - 3.4, x + 2, y]).fill({ color, alpha }) // blood
  }
}

// Static rift-dungeon floor, drawn with a margin so the camera can drift
function drawFloor(g: PIXI.Graphics) {
  g.rect(-16, -16, W + 32, H + 32).fill(0x16141b)
  let n = 0
  for (let r = 0; r * 11 - 16 < H + 16; r++) {
    const y = -16 + r * 11
    const off = (r % 2) * 8
    for (let x = -16 - off; x < W + 16; x += 16) {
      const h = hash(++n)
      const shade = h < 0.33 ? 0x201d27 : h < 0.66 ? 0x24212c : 0x282530
      g.rect(x + 0.5, y + 0.5, 15, 10).fill(shade)
    }
  }
  // Faint summoning circle under the fight
  g.ellipse(100, 55, 52, 52 * TILT).stroke({ color: 0x8a5cff, alpha: 0.08, width: 1.2 })
  g.ellipse(100, 55, 40, 40 * TILT).stroke({ color: 0x8a5cff, alpha: 0.05, width: 0.8 })
  // Rift seams glowing through the stone
  const seams = [[8, 30, 20, 26, 30, 31, 44, 27], [150, 92, 162, 86, 175, 90, 190, 84], [128, 8, 140, 14, 150, 10, 166, 16]]
  for (const s of seams) {
    g.moveTo(s[0], s[1]).lineTo(s[2], s[3]).lineTo(s[4], s[5]).lineTo(s[6], s[7]).stroke({ color: 0x8a5cff, alpha: 0.2, width: 3.2 })
    g.moveTo(s[0], s[1]).lineTo(s[2], s[3]).lineTo(s[4], s[5]).lineTo(s[6], s[7]).stroke({ color: 0xc4aaff, alpha: 0.6, width: 0.7 })
  }
  // Cracks, bones, rubble
  g.moveTo(60, 88).lineTo(66, 84).lineTo(64, 78).moveTo(66, 84).lineTo(73, 85).stroke({ color: 0x0d0c11, width: 0.7 })
  g.moveTo(118, 22).lineTo(124, 26).lineTo(122, 31).stroke({ color: 0x0d0c11, width: 0.7 })
  for (const [x, y, a] of [[30, 70, 0.4], [168, 40, 2.1], [84, 18, 1.2], [140, 66, 2.8]]) {
    g.moveTo(x - Math.cos(a) * 2.5, y - Math.sin(a) * 2.5).lineTo(x + Math.cos(a) * 2.5, y + Math.sin(a) * 2.5)
      .stroke({ color: 0x8f877a, alpha: 0.5, width: 0.8, cap: 'round' })
  }
  for (const [x, y, r] of [[22, 50, 1.3], [24, 52, 0.8], [178, 64, 1.2], [96, 92, 1], [52, 12, 1.1]]) g.circle(x, y, r).fill(0x34303d)
  // Broken pillars at the corners, seen from above
  for (const [x, y] of [[-4, -2], [204, 0], [-2, 100]]) {
    g.ellipse(x + 3, y + 4, 13, 13 * TILT).fill({ color: 0x000000, alpha: 0.4 })
    g.circle(x, y, 11).fill(0x2e2a36).stroke({ color: 0x3d3846, width: 1.2 })
    g.circle(x, y, 7).stroke({ color: 0x24212b, width: 0.8 })
  }
}

let fontInstalled = false
function ensureFont() {
  if (fontInstalled || PIXI.Cache.has(`${FONT}-bitmap`)) { fontInstalled = true; return }
  PIXI.BitmapFont.install({
    name: FONT,
    style: { fontFamily: '"Archivo Variable", system-ui, sans-serif', fontSize: 28, fontWeight: '900', fill: 0xffffff, stroke: { color: 0x0b0b0c, width: 6 } },
    chars: [['0', '9']],
    resolution: 2,
  })
  fontInstalled = true
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
      ensureFont()

      // Seeded RNG: the reduced-motion still is the same every time
      let seed = 0x5f1d
      const rnd = () => {
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
      }

      // --- Scene graph --------------------------------------------------------
      const world = new PIXI.Container()
      const floor = new PIXI.Graphics()
      drawFloor(floor)
      const ground = new PIXI.Graphics()
      const actors = new PIXI.Graphics()
      const air = new PIXI.Graphics()
      const numLayer = new PIXI.Container()
      world.addChild(floor, ground, actors, air, numLayer)

      const flashG = new PIXI.Graphics()
      const hud = new PIXI.Graphics()
      const hudFx = new PIXI.Graphics()
      const sweep = new PIXI.Graphics()
      const slotMask = new PIXI.Graphics()

      // Static hotbar frame
      hud.roundRect(22, BAR_Y - 4, W - 44, H - BAR_Y + 8, 3).fill({ color: 0x0b0a0e, alpha: 0.95 }).stroke({ color: 0x4a3c2a, width: 0.8 })
      for (let i = 0; i < 6; i++) {
        const x = BAR_X + i * (SLOT + SLOT_GAP)
        hud.roundRect(x, BAR_Y, SLOT, SLOT, 2).fill(0x17151c).stroke({ color: 0x3d3846, width: 0.8 })
        slotMask.rect(x + 0.6, BAR_Y + 0.6, SLOT - 1.2, SLOT - 1.2).fill(0xffffff)
      }
      sweep.mask = slotMask
      app.stage.addChild(world, flashG, hud, hudFx, sweep, slotMask)

      // --- Pools ---------------------------------------------------------------
      const enemies: Enemy[] = Array.from({ length: ENEMY_N }, () => ({ on: false, x: 0, y: 0, kx: 0, ky: 0, hp: 0, kind: 0, target: 0, flash: 0, frozen: 0, atk: 0, ph: 0 }))
      const parts: Part[] = Array.from({ length: PART_N }, () => ({ on: false, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, age: 0, life: 1, color: 0, size: 1 }))
      const coins: Coin[] = Array.from({ length: COIN_N }, () => ({ on: false, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, age: 0, color: 0, beam: false }))
      const arrows: Arrow[] = Array.from({ length: ARROW_N }, () => ({ on: false, x: 0, y: 0, vx: 0, vy: 0, age: 0, color: 0, tint: 0, dmg: 0 }))
      const fxs: Fx[] = Array.from({ length: FX_N }, () => ({ on: false, type: 0, x: 0, y: 0, a: 0, age: 0, life: 1, n: 0, pts: new Float32Array(12) }))
      const nums: Num[] = Array.from({ length: NUM_N }, () => {
        const t = new PIXI.BitmapText({ text: '0', style: { fontFamily: FONT, fontSize: 6 } })
        t.anchor.set(0.5)
        t.visible = false
        numLayer.addChild(t)
        return { t, on: false, age: 0, x: 0, y: 0, crit: false }
      })
      const mark = new Int32Array(ENEMY_N)
      let markId = 0

      // Heroes: 0 knight, 1 mage, 2 ranger
      const heroes: Hero[] = [
        { x: 104, y: 58, tx: 104, ty: 58, face: 1, retarget: 0, dash: 0, act: 0, mx: 0, my: 0 },
        { x: 86, y: 46, tx: 86, ty: 46, face: 1, retarget: 0.3, dash: 0, act: 0, mx: 0, my: 0 },
        { x: 90, y: 70, tx: 90, ty: 70, face: -1, retarget: 0.6, dash: 0, act: 0, mx: 0, my: 0 },
      ]

      // --- State --------------------------------------------------------------
      let time = 0
      let alive = 0
      let spawnAcc = 0
      let hitstop = 0
      let flash = 0
      let shake = 0
      let hpLevel = 0.82
      let mana = 0.8
      let meteorX = 100, meteorY = 55
      const cd = { cleave: 0, whirl: 2.2, whirlOn: 0, whirlTick: 0, chain: 0.4, nova: 1.4, arrow: 0, multi: 1.1 }
      const slotFlash = new Float32Array(6)
      const rems = new Float32Array(6)

      // --- Helpers ------------------------------------------------------------
      function nearest(x: number, y: number, maxD: number, skipMark: boolean) {
        let best = -1, bd = maxD * maxD
        for (let i = 0; i < ENEMY_N; i++) {
          const e = enemies[i]
          if (!e.on || (skipMark && mark[i] === markId)) continue
          const dx = e.x - x, dy = (e.y - y) / TILT
          const d = dx * dx + dy * dy
          if (d < bd) { bd = d; best = i }
        }
        return best
      }

      function spawnPart(x: number, y: number, vx: number, vy: number, vz: number, life: number, color: number, size: number) {
        for (const p of parts) {
          if (p.on) continue
          p.on = true; p.x = x; p.y = y; p.z = 2; p.vx = vx; p.vy = vy; p.vz = vz
          p.age = 0; p.life = life; p.color = color; p.size = size
          return
        }
      }

      function spawnNum(x: number, y: number, val: number, tint: number, crit: boolean) {
        for (const n of nums) {
          if (n.on) continue
          n.on = true; n.age = 0; n.x = x + (rnd() - 0.5) * 6; n.y = y; n.crit = crit
          n.t.text = String(val)
          n.t.tint = tint
          n.t.visible = true
          return
        }
      }

      function dropCoin(x: number, y: number, color: number, beam: boolean) {
        for (const c of coins) {
          if (c.on) continue
          c.on = true; c.x = x; c.y = y; c.z = 3; c.vx = (rnd() - 0.5) * 30; c.vy = (rnd() - 0.5) * 20
          c.vz = 40 + rnd() * 20; c.age = 0; c.color = color; c.beam = beam
          return
        }
      }

      function getFx(type: number, x: number, y: number, a: number, life: number) {
        let f = fxs[0]
        for (const c of fxs) { if (!c.on) { f = c; break } if (c.age / c.life > f.age / f.life) f = c }
        f.on = true; f.type = type; f.x = x; f.y = y; f.a = a; f.age = 0; f.life = life; f.n = 0
        return f
      }

      function kill(i: number, dx: number, dy: number) {
        const e = enemies[i]
        e.on = false
        alive--
        const body = ENEMY_BODY[e.kind]
        for (let k = 0; k < 6; k++) {
          const a = Math.atan2(dy, dx) + (rnd() - 0.5) * 2.4
          const s = 18 + rnd() * 40
          spawnPart(e.x, e.y - 3, Math.cos(a) * s, Math.sin(a) * s * TILT, 25 + rnd() * 35, 0.45 + rnd() * 0.35,
            k < 3 ? body : k < 5 ? 0x5a0e14 : 0xff5a3a, 0.8 + rnd() * 0.9)
        }
        const r = rnd()
        if (r < 0.38) dropCoin(e.x, e.y, 0xf5c518, false)
        else if (r < 0.43) dropCoin(e.x, e.y, FROST, false)
      }

      function hit(i: number, dmg: number, tint: number, fx: number, fy: number, knock: number, showNum = true) {
        const e = enemies[i]
        if (!e.on) return
        let crit = false
        if (rnd() < 0.12) { crit = true; dmg = Math.round(dmg * 2.6) }
        e.hp -= dmg
        e.flash = 0.09
        let dx = e.x - fx, dy = e.y - fy
        const len = Math.hypot(dx, dy) || 1
        dx /= len; dy /= len
        e.kx += dx * knock; e.ky += dy * knock * TILT
        if (showNum) spawnNum(e.x, e.y - 10, dmg, crit ? N_CRIT : tint, crit)
        spawnPart(e.x, e.y - 4, dx * 30 + (rnd() - 0.5) * 20, dy * 20, 15, 0.2, 0xffffff, 0.6)
        if (crit && dmg > 24) hitstop = Math.max(hitstop, 0.045)
        if (e.hp <= 0) kill(i, dx, dy)
      }

      function fire(a: number, color: number, tint: number, dmg: number) {
        const R = heroes[2]
        for (const ar of arrows) {
          if (ar.on) continue
          ar.on = true; ar.x = R.x + R.face * 4; ar.y = R.y - 6; ar.vx = Math.cos(a) * 170; ar.vy = Math.sin(a) * 170
          ar.age = 0; ar.color = color; ar.tint = tint; ar.dmg = dmg
          return
        }
      }

      function spawnEnemy() {
        for (let i = 0; i < ENEMY_N; i++) {
          const e = enemies[i]
          if (e.on) continue
          const edge = Math.floor(rnd() * 4)
          if (edge === 0) { e.x = -8; e.y = 8 + rnd() * 90 }
          else if (edge === 1) { e.x = W + 8; e.y = 8 + rnd() * 90 }
          else if (edge === 2) { e.x = 10 + rnd() * 180; e.y = -8 }
          else { e.x = 10 + rnd() * 180; e.y = 110 }
          const r = rnd()
          e.kind = r < 0.12 ? 2 : r < 0.45 ? 1 : 0
          e.hp = ENEMY_HP[e.kind]
          e.on = true; e.kx = 0; e.ky = 0; e.flash = 0; e.frozen = 0; e.atk = 0
          e.target = Math.floor(rnd() * 3)
          e.ph = rnd() * 6
          alive++
          return
        }
      }

      // --- Simulation step ----------------------------------------------------
      function step(dtReal: number) {
        flash = Math.max(0, flash - dtReal)
        shake = Math.max(0, shake - dtReal)
        let dt = dtReal
        if (hitstop > 0) { hitstop -= dtReal; dt *= 0.12 }
        const prevCyc = time % CYCLE
        time += dt
        const cyc = time % CYCLE
        for (let i = 0; i < 6; i++) slotFlash[i] = Math.max(0, slotFlash[i] - dt)

        // Spawning: keep the swarm topped up, pouring in from every edge
        spawnAcc += dt
        while (spawnAcc > 0.085) {
          spawnAcc -= 0.085
          if (alive < SWARM) spawnEnemy()
        }

        // Heroes: always moving, kiting, dashing
        for (let h = 0; h < 3; h++) {
          const hero = heroes[h]
          hero.retarget -= dt
          hero.act = Math.max(0, hero.act - dt * 4)
          const ne = nearest(hero.x, hero.y, 200, false)
          if (hero.retarget <= 0) {
            hero.retarget = 0.45 + rnd() * 0.6
            if (h === 0 && ne >= 0) { hero.tx = enemies[ne].x + (rnd() - 0.5) * 10; hero.ty = enemies[ne].y + (rnd() - 0.5) * 8 }
            else if (h === 1 && ne >= 0) {
              const dx = hero.x - enemies[ne].x, dy = hero.y - enemies[ne].y, l = Math.hypot(dx, dy) || 1
              hero.tx = hero.x + (dx / l) * 24 + (rnd() - 0.5) * 16; hero.ty = hero.y + (dy / l) * 16 + (rnd() - 0.5) * 12
            } else {
              const a = rnd() * Math.PI * 2
              hero.tx = 100 + Math.cos(a) * 30; hero.ty = 54 + Math.sin(a) * 20
            }
            hero.tx = clamp(hero.tx, 44, 156); hero.ty = clamp(hero.ty, 26, 84)
            if (rnd() < 0.35) hero.dash = 0.16
          }
          if (h === 0 && cd.whirlOn > 0 && ne >= 0) { hero.tx = enemies[ne].x; hero.ty = enemies[ne].y }
          hero.dash = Math.max(0, hero.dash - dt)
          const speed = (h === 0 ? 30 : 26) * (hero.dash > 0 ? 3.4 : 1) * (h === 0 && cd.whirlOn > 0 ? 1.4 : 1)
          const dx = hero.tx - hero.x, dy = hero.ty - hero.y, d = Math.hypot(dx, dy)
          hero.mx = 0; hero.my = 0
          if (d > 1.5) {
            const s = Math.min(d, speed * dt)
            hero.mx = dx / d; hero.my = dy / d
            hero.x += hero.mx * s; hero.y += hero.my * s
          }
          for (let o = 0; o < 3; o++) {
            if (o === h) continue
            const ox = hero.x - heroes[o].x, oy = hero.y - heroes[o].y, od = Math.hypot(ox, oy)
            if (od < 12 && od > 0.01) { hero.x += (ox / od) * (12 - od) * 0.5; hero.y += (oy / od) * (12 - od) * 0.5 }
          }
          if (ne >= 0) hero.face = enemies[ne].x >= hero.x ? 1 : -1
          else if (Math.abs(hero.mx) > 0.2) hero.face = hero.mx > 0 ? 1 : -1
        }
        const K = heroes[0], M = heroes[1], R = heroes[2]

        // Knight: auto cleave + whirlwind
        cd.cleave -= dt; cd.whirl -= dt
        if (cd.cleave <= 0 && cd.whirlOn <= 0) {
          const ne = nearest(K.x, K.y, 16, false)
          if (ne >= 0) {
            cd.cleave = 0.36
            const a = Math.atan2(enemies[ne].y - K.y, enemies[ne].x - K.x)
            getFx(0, K.x, K.y - 4, a, 0.2)
            K.act = 1
            for (let i = 0; i < ENEMY_N; i++) {
              const e = enemies[i]
              if (!e.on) continue
              const dx = e.x - K.x, dy = e.y - K.y
              if (dx * dx + dy * dy > 18 * 18) continue
              let da = Math.atan2(dy, dx) - a
              da = Math.atan2(Math.sin(da), Math.cos(da))
              if (Math.abs(da) < 1.2) hit(i, 8 + Math.floor(rnd() * 6), N_PHYS, K.x, K.y, 70)
            }
          }
        }
        if (cd.whirl <= 0 && nearest(K.x, K.y, 22, false) >= 0) { cd.whirl = 4.6; cd.whirlOn = 1.3; slotFlash[5] = 0.3; mana -= 0.08 }
        if (cd.whirlOn > 0) {
          cd.whirlOn -= dt; cd.whirlTick -= dt
          if (cd.whirlTick <= 0) {
            cd.whirlTick = 0.13
            for (let i = 0; i < ENEMY_N; i++) {
              const e = enemies[i]
              if (!e.on) continue
              const dx = e.x - K.x, dy = (e.y - K.y) / TILT
              if (dx * dx + dy * dy < 17 * 17) hit(i, 5 + Math.floor(rnd() * 5), 0xff9a9a, K.x, K.y, 55)
            }
          }
        }

        // Mage: chain lightning + frost nova
        const tipX = M.x + M.face * 4, tipY = M.y - 13
        cd.chain -= dt; cd.nova -= dt
        if (cd.chain <= 0) {
          markId++
          let cur = nearest(M.x, M.y, 75, true)
          if (cur >= 0) {
            cd.chain = 0.95; slotFlash[2] = 0.2; M.act = 1; mana -= 0.03
            const f = getFx(2, tipX, tipY, 0, 0.22)
            f.pts[0] = tipX; f.pts[1] = tipY; f.n = 1
            for (let k = 0; k < 5 && cur >= 0; k++) {
              const e = enemies[cur]
              f.pts[f.n * 2] = e.x; f.pts[f.n * 2 + 1] = e.y - 4; f.n++
              mark[cur] = markId
              const ex = e.x, ey = e.y
              hit(cur, 9 + Math.floor(rnd() * 7), N_LIGHT, f.pts[f.n * 2 - 4], f.pts[f.n * 2 - 3], 25)
              cur = nearest(ex, ey, 34, true)
            }
          }
        }
        if (cd.nova <= 0) {
          let near = 0
          for (const e of enemies) if (e.on && Math.hypot(e.x - M.x, (e.y - M.y) / TILT) < 26) near++
          if (near >= 3 || cd.nova < -1.5) {
            cd.nova = 3.2; slotFlash[1] = 0.3; M.act = 1; mana -= 0.1
            getFx(1, M.x, M.y, 0, 0.5)
            for (let i = 0; i < ENEMY_N; i++) {
              const e = enemies[i]
              if (!e.on || Math.hypot(e.x - M.x, (e.y - M.y) / TILT) > 28) continue
              e.frozen = 1.4
              hit(i, 6 + Math.floor(rnd() * 4), N_FROST, M.x, M.y, 90)
            }
          }
        }

        // Ranger: rapid arrows + arcane multishot
        cd.arrow -= dt; cd.multi -= dt
        if (cd.arrow <= 0) {
          const ne = nearest(R.x, R.y, 95, false)
          if (ne >= 0) {
            cd.arrow = 0.24; slotFlash[4] = 0.12; R.act = 1
            fire(Math.atan2(enemies[ne].y - 3 - (R.y - 6), enemies[ne].x - (R.x + R.face * 4)), NATURE, N_NAT, 6 + Math.floor(rnd() * 4))
          }
        }
        if (cd.multi <= 0) {
          const ne = nearest(R.x, R.y, 95, false)
          if (ne >= 0) {
            cd.multi = 2.3; slotFlash[3] = 0.3; R.act = 1; mana -= 0.05
            const a = Math.atan2(enemies[ne].y - (R.y - 6), enemies[ne].x - R.x)
            for (let k = -2; k <= 2; k++) fire(a + k * 0.24, ARCANE, N_ARC, 10 + Math.floor(rnd() * 5))
          }
        }

        // Meteor: telegraph on the thickest part of the swarm, then wipe it
        if (crossedAt(prevCyc, cyc, TELE)) {
          let sx = 0, sy = 0, c = 0
          for (const e of enemies) if (e.on) { sx += e.x; sy += e.y; c++ }
          meteorX = c ? clamp(sx / c, 50, 150) : 100
          meteorY = c ? clamp(sy / c, 30, 80) : 55
          slotFlash[0] = 0.4; mana -= 0.25
        }
        if (cyc >= TELE && cyc < IMPACT) M.act = 1
        if (crossedAt(prevCyc, cyc, IMPACT)) {
          let shown = 0
          for (let i = 0; i < ENEMY_N; i++) {
            const e = enemies[i]
            if (!e.on) continue
            const dx = e.x - meteorX, dy = (e.y - meteorY) / TILT, d = Math.hypot(dx, dy)
            if (d < METEOR_R) {
              const dmg = 180 + Math.floor(rnd() * 260)
              if (shown < 7) { spawnNum(e.x, e.y - 11, dmg, N_CRIT, true); shown++ }
              e.hp = 0
              kill(i, dx || 1, dy * TILT)
            } else if (d < 70) {
              e.kx += (dx / d) * 140; e.ky += (dy / d) * 140 * TILT
            }
          }
          for (let k = 0; k < 18; k++) {
            const a = rnd() * Math.PI * 2, s = 40 + rnd() * 70
            spawnPart(meteorX, meteorY - 2, Math.cos(a) * s, Math.sin(a) * s * TILT, 30 + rnd() * 50, 0.5 + rnd() * 0.4, k % 3 ? 0xff8a2a : 0xffe0a0, 0.9 + rnd())
          }
          getFx(3, meteorX, meteorY, 0, 0.75)
          dropCoin(meteorX, meteorY, 0xff8a1a, true)
          shake = 0.35; flash = 0.14; hitstop = 0.08
        }

        // Arrows
        for (const ar of arrows) {
          if (!ar.on) continue
          ar.age += dt; ar.x += ar.vx * dt; ar.y += ar.vy * dt
          if (ar.age > 0.7) { ar.on = false; continue }
          for (let i = 0; i < ENEMY_N; i++) {
            const e = enemies[i]
            if (!e.on) continue
            const dx = e.x - ar.x, dy = e.y - 3 - ar.y
            if (dx * dx + dy * dy < 14) { hit(i, ar.dmg, ar.tint, ar.x - ar.vx * 0.05, ar.y - ar.vy * 0.05, 35); ar.on = false; break }
          }
        }

        // Enemies: chase, surround, attack; separation keeps it a swarm
        let attackers = 0
        for (let i = 0; i < ENEMY_N; i++) {
          const e = enemies[i]
          if (!e.on) continue
          e.flash = Math.max(0, e.flash - dt)
          e.frozen = Math.max(0, e.frozen - dt)
          const h = heroes[e.target]
          const dx = h.x - e.x, dy = h.y - e.y, d = Math.hypot(dx, dy) || 1
          const sp = ENEMY_SPEED[e.kind] * (e.frozen > 0 ? 0.3 : 1)
          if (d > 7) { e.x += (dx / d) * sp * dt; e.y += (dy / d) * sp * dt; e.atk = 0 }
          else { e.atk += dt; attackers++ }
          for (let j = i + 1; j < ENEMY_N; j++) {
            const o = enemies[j]
            if (!o.on) continue
            const sx = e.x - o.x, sy = e.y - o.y, sd = sx * sx + sy * sy
            if (sd < 30 && sd > 0.001) {
              const l = Math.sqrt(sd), push = (5.5 - l) * 0.5
              e.x += (sx / l) * push; e.y += (sy / l) * push; o.x -= (sx / l) * push; o.y -= (sy / l) * push
            }
          }
          e.x += e.kx * dt; e.y += e.ky * dt
          const damp = Math.exp(-9 * dt)
          e.kx *= damp; e.ky *= damp
        }

        // Party resources
        hpLevel = clamp(hpLevel - attackers * 0.004 * dt + 0.05 * dt, 0.45, 0.95)
        mana = clamp(mana + 0.09 * dt, 0.3, 0.95)

        // Particles, coins, numbers, effects
        for (const p of parts) {
          if (!p.on) continue
          p.age += dt
          if (p.age >= p.life) { p.on = false; continue }
          p.vz -= 150 * dt; p.z += p.vz * dt
          if (p.z < 0) { p.z = 0; p.vz *= -0.3; p.vx *= 0.6; p.vy *= 0.6 }
          p.x += p.vx * dt; p.y += p.vy * dt
        }
        for (const c of coins) {
          if (!c.on) continue
          c.age += dt
          c.vz -= 160 * dt; c.z += c.vz * dt
          if (c.z < 0) { c.z = 0; c.vz = -c.vz * 0.35; c.vx *= 0.5; c.vy *= 0.5 }
          c.x += c.vx * dt; c.y += c.vy * dt
          if (c.age > (c.beam ? 3.2 : 1.1)) {
            let best = 0, bd = 1e9
            for (let h = 0; h < 3; h++) { const d = Math.hypot(heroes[h].x - c.x, heroes[h].y - c.y); if (d < bd) { bd = d; best = h } }
            if (bd < 4) { c.on = false; spawnPart(c.x, c.y, 0, 0, 30, 0.25, 0xfff4c0, 0.7); continue }
            const s = Math.min(bd, 90 * dt)
            c.x += ((heroes[best].x - c.x) / bd) * s; c.y += ((heroes[best].y - c.y) / bd) * s
          }
          if (c.age > 5) c.on = false
        }
        for (const n of nums) {
          if (!n.on) continue
          n.age += dtReal
          if (n.age > (n.crit ? 0.9 : 0.6)) { n.on = false; n.t.visible = false }
        }
        for (const f of fxs) {
          if (!f.on) continue
          f.age += dt
          if (f.age >= f.life) f.on = false
        }
      }

      // --- Rendering ------------------------------------------------------------
      function drawEnemy(e: Enemy) {
        const k = ENEMY_SIZE[e.kind]
        const lunge = e.atk > 0 ? Math.max(0, Math.sin(e.atk * 9 + e.ph)) * 2 : 0
        const dir = heroes[e.target].x >= e.x ? 1 : -1
        const x = e.x + dir * lunge
        const y = e.y - (e.atk > 0 ? 0 : Math.abs(Math.sin(time * 12 + e.ph)) * 1)
        const body = e.flash > 0 ? 0xffffff : e.frozen > 0 ? 0x7fb4d8 : ENEMY_BODY[e.kind]
        actors.ellipse(e.x, e.y + 0.4, 3.2 * k, 1.3 * k).fill({ color: 0x000000, alpha: 0.4 })
        actors.ellipse(x, y - 3 * k, 2.6 * k, 3 * k).fill(body).stroke({ color: 0x0c0608, width: 0.5 })
        actors.circle(x + dir * 1.1 * k, y - 6.3 * k, 1.9 * k).fill(body).stroke({ color: 0x0c0608, width: 0.5 })
        if (e.kind !== 1) {
          actors.poly([x + dir * 0.2 * k, y - 7.6 * k, x - dir * 0.6 * k, y - 9.8 * k, x + dir * 1 * k, y - 8 * k]).fill(0xd8cbb0)
        }
        actors.circle(x + dir * 2 * k, y - 6.5 * k, 0.55 * k).fill(e.kind === 1 ? 0x7fe0ff : 0xffd34a)
        if (e.kind === 2 && e.hp < ENEMY_HP[2]) {
          actors.rect(x - 4, y - 12.5 * k + 2, 8, 1.3).fill(0x000000)
          actors.rect(x - 3.8, y - 12.5 * k + 2.2, 7.6 * Math.max(0, e.hp / ENEMY_HP[2]), 0.9).fill(0xd23a3a)
        }
      }

      function drawHero(kind: number, hero: Hero) {
        const f = hero.face
        const moving = hero.mx !== 0 || hero.my !== 0
        const bob = moving ? Math.abs(Math.sin(time * 14 + kind)) * 1 : 0
        const x = hero.x, y0 = hero.y, y = y0 - bob
        if (hero.dash > 0) {
          for (let g = 1; g <= 2; g++) {
            actors.ellipse(x - hero.mx * g * 5, y - 6 - hero.my * g * 4, 3, 5).fill({ color: kind === 0 ? 0xb9c3cf : kind === 1 ? 0x6a4fd8 : 0x3f8f4a, alpha: 0.25 / g })
          }
        }
        actors.ellipse(x, y0 + 0.6, 5.5, 2).fill({ color: 0x000000, alpha: 0.45 })
        actors.ellipse(x, y0 + 0.6, 6, 2.4).stroke({ color: 0x3fd16b, alpha: 0.85, width: 0.8 })
        const step = moving ? Math.sin(time * 14 + kind) * 1 : 0
        actors.rect(x - 2 + step * 0.5, y - 3, 1.5, 3).fill(0x1f1b25).rect(x + 0.5 - step * 0.5, y - 3, 1.5, 3).fill(0x1f1b25)
        const act = hero.act
        if (kind === 0) {
          const whirl = cd.whirlOn > 0
          actors.roundRect(x - f * 4 - 1.4, y - 8.4, 2.8, 5.4, 1).fill(0x6e4a2c).stroke({ color: 0xaab4c0, width: 0.5 })
          actors.roundRect(x - 3, y - 8.6, 6, 6, 1.5).fill(0xb9c3cf)
          actors.rect(x - 1.2, y - 8.2, 2.4, 5.4).fill(0xb8322b)
          actors.circle(x, y - 10.7, 2.3).fill(0xd5dde6)
          actors.rect(f > 0 ? x + 0.2 : x - 2.4, y - 11.2, 2.2, 0.8).fill(0x22252b)
          const a = whirl ? time * 24 : f > 0 ? -1.1 + act * 1.9 : Math.PI + 1.1 - act * 1.9
          const hx = x + (whirl ? 0 : f * 3), hy = y - 6
          actors.moveTo(hx, hy).lineTo(hx + Math.cos(a) * 9, hy + Math.sin(a) * 9 * (whirl ? TILT : 1))
            .stroke({ color: 0xeef3f8, width: 1.2, cap: 'round' })
        } else if (kind === 1) {
          actors.poly([x - 3.4, y - 0.5, x + 3.4, y - 0.5, x + 2, y - 9, x - 2, y - 9]).fill(0x6a4fd8)
          actors.circle(x, y - 10.3, 2).fill(0xe6c3a0)
          actors.poly([x - 3.4, y - 11.2, x + 3.4, y - 11.2, x - f * 0.8, y - 17]).fill(0x4a35a8)
          const tx = x + f * 4, ty = y - 13 - act * 1.5
          actors.moveTo(x + f * 4, y + 0.5).lineTo(tx, ty).stroke({ color: 0x8a6a45, width: 1.1, cap: 'round' })
          actors.circle(tx, ty, 3.8).fill({ color: ARCANE, alpha: 0.2 + 0.4 * act })
          actors.circle(tx, ty, 1.6).fill(0xe0d6ff)
        } else {
          actors.poly([x - 3, y - 0.5, x + 3, y - 0.5, x + 2.4, y - 9, x - 2.4, y - 9]).fill(0x3f8f4a)
          actors.circle(x, y - 10.8, 2.4).fill(0x2f6e3a)
          actors.circle(x + f * 0.7, y - 10.2, 1.4).fill(0xe0b890)
          const cx = x + f * 0.2, by = y - 6, a0 = f > 0 ? -1.2 : Math.PI - 1.2
          actors.moveTo(cx + Math.cos(a0) * 5.5, by + Math.sin(a0) * 5.5).arc(cx, by, 5.5, a0, a0 + 2.4)
            .stroke({ color: 0xa8743f, width: 1 })
          const ex = cx + Math.cos(1.2) * 5.5 * f, ey = Math.sin(1.2) * 5.5
          actors.moveTo(ex, by - ey).lineTo(ex - f * act * 2.4, by).lineTo(ex, by + ey).stroke({ color: 0xdcd6c8, width: 0.4 })
        }
      }

      function globe(x: number, y: number, r: number, level: number, color: number, deep: number) {
        hudFx.circle(x, y, r + 1.8).fill(0x0b0a0e).stroke({ color: 0x6b5634, width: 1.2 })
        hudFx.circle(x, y, r).fill(deep)
        const top = y + r - level * 2 * r
        hudFx.moveTo(x - r, top)
        for (let k = 0; k <= 20; k++) {
          const a = Math.PI + (k / 20) * Math.PI * 2
          const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r
          hudFx.lineTo(px, Math.max(py, top + Math.sin(time * 3 + k * 0.8) * 0.4))
        }
        hudFx.closePath().fill(color)
        hudFx.ellipse(x - r * 0.3, y - r * 0.45, r * 0.45, r * 0.25).fill({ color: 0xffffff, alpha: 0.22 })
      }

      function render() {
        ground.clear(); actors.clear(); air.clear(); hudFx.clear(); sweep.clear(); flashG.clear()
        const cyc = time % CYCLE

        // Drifting camera + impact shake
        world.x = Math.sin(time * 0.35) * 4 + (shake > 0 ? (rnd() - 0.5) * 6 * (shake / 0.35) : 0)
        world.y = Math.cos(time * 0.27) * 3 + (shake > 0 ? (rnd() - 0.5) * 5 * (shake / 0.35) : 0)

        // Telegraph + scorch
        if (cyc >= TELE && cyc < IMPACT) {
          const p = (cyc - TELE) / (IMPACT - TELE)
          const blink = 0.5 + 0.5 * Math.sin(time * 18)
          ground.ellipse(meteorX, meteorY, METEOR_R, METEOR_R * TILT).fill({ color: 0xff2a2a, alpha: 0.1 + 0.06 * blink })
          ground.ellipse(meteorX, meteorY, METEOR_R * p, METEOR_R * p * TILT).fill({ color: 0xff2a2a, alpha: 0.2 })
          ground.ellipse(meteorX, meteorY, METEOR_R, METEOR_R * TILT).stroke({ color: 0xff4a3a, alpha: 0.85, width: 1 })
        }
        const since = cyc - IMPACT
        if (since >= 0 && since < 2.5) ground.ellipse(meteorX, meteorY, 26, 26 * TILT).fill({ color: 0x000000, alpha: 0.5 * (1 - since / 2.5) })

        // Ground effects: frost novas, shock rings
        for (const f of fxs) {
          if (!f.on) continue
          const p = f.age / f.life
          if (f.type === 1) {
            const r = 4 + easeOut(p) * 26
            ground.ellipse(f.x, f.y, r, r * TILT).fill({ color: FROST, alpha: 0.16 * (1 - p) })
              .stroke({ color: 0xd6efff, alpha: 0.9 * (1 - p), width: 2 - 1.5 * p })
            for (let j = 0; j < 8; j++) {
              const a = (j / 8) * Math.PI * 2
              const cx = f.x + Math.cos(a) * r, cy = f.y + Math.sin(a) * r * TILT
              air.moveTo(cx, cy).lineTo(cx, cy - 3.5).stroke({ color: 0xd6efff, alpha: 0.85 * (1 - p), width: 0.9 })
            }
          } else if (f.type === 3) {
            const r = 8 + easeOut(p) * 64
            ground.ellipse(f.x, f.y, r, r * TILT).stroke({ color: 0xffb060, alpha: 0.95 * (1 - p), width: 3.2 - 2.6 * p })
            ground.ellipse(f.x, f.y, r * 0.78, r * 0.78 * TILT).stroke({ color: 0xff6a2a, alpha: 0.45 * (1 - p), width: 1 })
          }
        }

        // Loot on the floor
        for (const c of coins) {
          if (!c.on) continue
          if (c.beam) {
            const bh = 38 * Math.min(1, c.age / 0.4), pulse = 0.8 + 0.2 * Math.sin(time * 5)
            air.rect(c.x - 2.4, c.y - bh, 4.8, bh).fill({ color: c.color, alpha: 0.18 * pulse })
            air.rect(c.x - 0.6, c.y - bh, 1.2, bh).fill({ color: c.color, alpha: 0.8 * pulse })
            air.poly([c.x, c.y - c.z - 2.6, c.x + 2, c.y - c.z, c.x, c.y - c.z + 1.3, c.x - 2, c.y - c.z]).fill(c.color)
          } else {
            ground.ellipse(c.x, c.y + 0.5, 1.6, 0.6).fill({ color: 0x000000, alpha: 0.4 })
            air.circle(c.x, c.y - c.z, 1.2).fill(c.color)
            if ((time * 2 + c.x * 0.1) % 1 < 0.15) air.star(c.x + 0.6, c.y - c.z - 0.8, 4, 2.2, 0.5).fill({ color: 0xffffff, alpha: 0.9 })
          }
        }

        // Actors
        for (const e of enemies) if (e.on) drawEnemy(e)
        drawHero(2, heroes[2]); drawHero(1, heroes[1]); drawHero(0, heroes[0])

        // Whirlwind blades around the knight
        if (cd.whirlOn > 0) {
          const K = heroes[0]
          for (let j = 0; j < 2; j++) {
            const a0 = time * 18 + j * Math.PI
            air.moveTo(K.x + Math.cos(a0) * 13, K.y - 4 + Math.sin(a0) * 13 * TILT)
            for (let s = 1; s <= 6; s++) {
              const a = a0 + s * 0.28
              air.lineTo(K.x + Math.cos(a) * 13, K.y - 4 + Math.sin(a) * 13 * TILT)
            }
            air.stroke({ color: 0xff5a5a, alpha: 0.75, width: 2.2, cap: 'round' })
          }
          air.ellipse(K.x, K.y - 3, 15, 15 * TILT).stroke({ color: BLOOD, alpha: 0.3, width: 1 })
        }

        // Air effects: cleaves, chains
        for (const f of fxs) {
          if (!f.on) continue
          const p = f.age / f.life
          if (f.type === 0) {
            const r = 12 + p * 5, a0 = f.a - 1.15, a1 = f.a + 1.15
            air.moveTo(f.x + Math.cos(a0) * r, f.y + Math.sin(a0) * r).arc(f.x, f.y, r, a0, a1)
              .stroke({ color: 0xffffff, alpha: 0.9 * (1 - p), width: 2.6 * (1 - p) + 0.4 })
            air.moveTo(f.x + Math.cos(a0) * (r + 2), f.y + Math.sin(a0) * (r + 2)).arc(f.x, f.y, r + 2, a0, a1)
              .stroke({ color: BLOOD, alpha: 0.6 * (1 - p), width: 1.2 })
          } else if (f.type === 2) {
            const seed = Math.floor(time * 30)
            air.moveTo(f.pts[0], f.pts[1])
            for (let k = 1; k < f.n; k++) {
              const ax = f.pts[k * 2 - 2], ay = f.pts[k * 2 - 1], bx = f.pts[k * 2], by = f.pts[k * 2 + 1]
              for (let s = 1; s < 4; s++) {
                const q = s / 4
                air.lineTo(ax + (bx - ax) * q + (hash(seed + k * 7 + s) - 0.5) * 5, ay + (by - ay) * q + (hash(seed * 3 + s + k) - 0.5) * 5)
              }
              air.lineTo(bx, by)
            }
            air.stroke({ color: LIGHT, alpha: 0.35 * (1 - p), width: 3.2, join: 'round' })
            air.moveTo(f.pts[0], f.pts[1])
            for (let k = 1; k < f.n; k++) air.lineTo(f.pts[k * 2], f.pts[k * 2 + 1])
            air.stroke({ color: 0xfffbe0, alpha: 0.95 * (1 - p), width: 0.8 })
          }
        }

        // Arrows
        for (const ar of arrows) {
          if (!ar.on) continue
          air.moveTo(ar.x - ar.vx * 0.03, ar.y - ar.vy * 0.03).lineTo(ar.x, ar.y).stroke({ color: ar.color, width: 1, cap: 'round' })
        }

        // Particles: gibs, embers, sparks
        for (const p of parts) {
          if (!p.on) continue
          const a = 1 - p.age / p.life
          air.circle(p.x, p.y - p.z, p.size * (0.5 + 0.5 * a)).fill({ color: p.color, alpha: Math.min(1, a * 1.6) })
        }

        // Meteor fall + flash
        if (cyc >= FALL && cyc < IMPACT) {
          const p = (cyc - FALL) / (IMPACT - FALL), q = p * p
          const sx = meteorX + 90, sy = -40
          const x = sx + (meteorX - sx) * q, y = sy + (meteorY - 4 - sy) * q
          const dx = meteorX - sx, dy = meteorY - sy, len = Math.hypot(dx, dy)
          for (let j = 4; j >= 1; j--) {
            const t = j * 8
            air.moveTo(x - (dx / len) * t, y - (dy / len) * t).lineTo(x - (dx / len) * (t - 8), y - (dy / len) * (t - 8))
              .stroke({ color: 0xff8a2a, alpha: 0.65 - j * 0.12, width: 6 - j, cap: 'round' })
          }
          air.circle(x, y, 7.5).fill({ color: 0xff8a2a, alpha: 0.35 })
          air.circle(x, y, 4).fill(0xfff0c0)
        }
        if (since >= 0 && since < 0.25) air.ellipse(meteorX, meteorY - 3, 34, 34 * TILT).fill({ color: 0xffd9a0, alpha: 0.6 * (1 - since / 0.25) })

        // Damage numbers
        for (const n of nums) {
          if (!n.on) continue
          const life = n.crit ? 0.9 : 0.6
          const p = n.age / life
          n.t.position.set(n.x, n.y - n.age * (n.crit ? 12 : 16))
          n.t.alpha = 1 - Math.max(0, (p - 0.6) / 0.4)
          const base = n.crit ? 1.45 : 1
          n.t.scale.set(base * (1 + 0.5 * Math.max(0, 1 - n.age / 0.1)))
        }

        if (flash > 0) flashG.rect(0, 0, W, H).fill({ color: 0xfff4e0, alpha: (flash / 0.14) * 0.45 })

        // Hotbar: globes at both ends, slots with cooldown sweeps
        globe(14, 108, 10.5, hpLevel, 0xc8202c, 0x2a0a0e)
        globe(W - 14, 108, 10.5, mana, 0x2f6fe0, 0x0a1430)
        const meteorS = (cyc - IMPACT + CYCLE) % CYCLE
        rems[0] = meteorS < CYCLE - (IMPACT - TELE) ? 1 - meteorS / (CYCLE - (IMPACT - TELE)) : 0
        rems[1] = Math.max(0, cd.nova) / 3.2
        rems[2] = Math.max(0, cd.chain) / 0.95
        rems[3] = Math.max(0, cd.multi) / 2.3
        rems[4] = 0
        rems[5] = cd.whirlOn > 0 ? 0 : Math.max(0, cd.whirl) / 4.6
        for (let i = 0; i < 6; i++) {
          const x = BAR_X + i * (SLOT + SLOT_GAP), cx = x + SLOT / 2, cy = BAR_Y + SLOT / 2
          const c = SLOT_COLORS[i]
          const fl = Math.min(1, slotFlash[i] / 0.2)
          const active = (i === 5 && cd.whirlOn > 0) || (i === 0 && cyc >= TELE && cyc < IMPACT)
          if (fl > 0 || active) {
            const v = active ? 0.6 + 0.4 * Math.sin(time * 14) : fl
            hudFx.roundRect(x - 1.5, BAR_Y - 1.5, SLOT + 3, SLOT + 3, 3).fill({ color: c, alpha: 0.25 * v })
            hudFx.roundRect(x, BAR_Y, SLOT, SLOT, 2).fill({ color: c, alpha: 0.4 * v })
          }
          const rem = rems[i]
          glyph(hudFx, i, cx, cy, c, rem > 0 ? 0.55 : 1)
          if (rem <= 0) hudFx.roundRect(x, BAR_Y, SLOT, SLOT, 2).stroke({ color: c, alpha: 0.6, width: 0.7 })
          else sweep.moveTo(cx, cy).arc(cx, cy, 10, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * rem).closePath().fill({ color: 0x000000, alpha: 0.62 })
        }
      }

      if (still) {
        // One representative frame: the meteor has just landed in the swarm
        app.ticker.stop()
        while (time < IMPACT + 0.1) step(1 / 60)
        render()
        app.render()
        return
      }

      // Warm up so the swarm is already in full swing when it scrolls into view
      while (time < 2.5) step(1 / 60)

      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) app.ticker.start()
        else app.ticker.stop()
      })
      io.observe(container)

      app.ticker.add((ticker) => {
        step(Math.min(ticker.deltaMS, 50) / 1000)
        render()
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
