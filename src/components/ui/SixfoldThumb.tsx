import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { prefersReducedMotion } from '../../lib/gsap'

const W = 200
const H = 120

// Element colours: six ability slots, no classes
const FIRE = 0xff7a1a
const FROST = 0x5ab8ff
const LIGHT = 0xffe14a
const ARCANE = 0xa070ff
const NATURE = 0x5fd068
const BLOOD = 0xe0283c

// One loop: walk in, a pack charges, abilities, meteor, loot, walk on
const L = 9
const P = 96            // floor pattern period; the party walks exactly one per loop
const WALK = 2.8        // seconds of walking per loop (0–1.2 and 7.4–9)
const IMPACT = 5.9
const MC = { x: 142, y: 71 } // meteor target, the middle of the pack
const TILT = 0.55       // ground ellipses squashed for the angled camera

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const easeOut = (v: number) => 1 - (1 - v) * (1 - v)
const scrollAt = (tm: number) => (P * (Math.min(tm, 1.2) + Math.max(0, tm - 7.4))) / WALK
const walking = (tm: number) => tm < 1.2 || tm > 7.4

const ENEMIES = [
  { x: 122, y: 62, hp: 100, d: 0.0 },
  { x: 126, y: 83, hp: 100, d: 0.1 },
  { x: 143, y: 72, hp: 240, d: 0.25, elite: true },
  { x: 151, y: 56, hp: 100, d: 0.15 },
  { x: 156, y: 89, hp: 100, d: 0.3 },
  { x: 168, y: 68, hp: 90, d: 0.05 },
]
const deathAt = (i: number) => (i === 5 ? 3.95 : IMPACT)

// [time, enemy, damage, colour, crit]
const HITS: [number, number, number, number, boolean][] = [
  [1.75, 0, 18, FIRE, false], [1.78, 1, 22, FIRE, false], [1.81, 2, 21, FIRE, false],
  [2.4, 1, 14, NATURE, false], [2.42, 4, 12, NATURE, false], [2.44, 3, 15, NATURE, false],
  [2.85, 0, 26, LIGHT, false], [2.9, 3, 24, LIGHT, false], [2.95, 5, 31, LIGHT, false],
  [3.5, 5, 20, 0xc9b6ff, false], [3.7, 5, 20, 0xc9b6ff, false], [3.9, 5, 24, 0xc9b6ff, false],
  [4.3, 0, 11, 0xbfe6ff, false], [4.32, 1, 9, 0xbfe6ff, false], [4.34, 2, 13, 0xbfe6ff, false],
  [5.92, 0, 248, 0xffb347, true], [5.93, 1, 231, 0xffb347, true], [5.92, 2, 412, 0xffb347, true],
  [5.94, 3, 226, 0xffb347, true], [5.93, 4, 239, 0xffb347, true],
]

// Loot: where it lands, what it is, when it drops (from which enemy)
const LOOT = [
  { e: 5, x: 171, y: 76, c: FROST, beam: 0, t: 4.0 },
  { e: 2, x: 147, y: 80, c: 0xff8a1a, beam: 40, t: 6.0 },  // legendary
  { e: 1, x: 121, y: 92, c: LIGHT, beam: 14, t: 6.06 },    // rare
  { e: 0, x: 114, y: 68, c: 0xe8e8e8, beam: 0, t: 6.03 },
  { e: 3, x: 160, y: 60, c: 0xe8e8e8, beam: 0, t: 6.09 },
  { e: 4, x: 165, y: 96, c: FROST, beam: 0, t: 6.12 },
]

// Hotbar: slot colour, cast time, cooldown
const SLOTS = [
  { c: FIRE, cast: 1.6, cd: 2.2 }, { c: FROST, cast: 4.25, cd: 3.5 }, { c: LIGHT, cast: 2.8, cd: 3 },
  { c: ARCANE, cast: 3.4, cd: 3 }, { c: NATURE, cast: 2.1, cd: 2.5 }, { c: BLOOD, cast: 5.0, cd: 7.5 },
]
const SLOT = 13
const SLOT_GAP = 2
const BAR_X = (W - (6 * SLOT + 5 * SLOT_GAP)) / 2
const BAR_Y = 105

const KNIGHT = { x: 66, y: 73 }
const MAGE = { x: 42, y: 59 }
const RANGER = { x: 40, y: 88 }

function glyph(g: PIXI.Graphics, i: number, x: number, y: number, color: number, alpha: number) {
  switch (i) {
    case 0: g.poly([x, y - 3.4, x + 2.8, y + 2.6, x - 2.8, y + 2.6]).fill({ color, alpha }); break         // fire
    case 1: g.poly([x, y - 3.6, x + 2.4, y, x, y + 3.6, x - 2.4, y]).fill({ color, alpha }); break      // frost
    case 2: g.moveTo(x + 1.5, y - 3.6).lineTo(x - 1.5, y + 0.2).lineTo(x + 1.5, y + 0.2).lineTo(x - 1.5, y + 3.6)
      .stroke({ color, alpha, width: 1.2, join: 'round', cap: 'round' }); break                          // lightning
    case 3: g.star(x, y, 4, 3.6, 1.2).fill({ color, alpha }); break                                    // arcane
    case 4: g.ellipse(x, y, 2, 3.4).fill({ color, alpha }); break                                      // nature
    default: g.circle(x, y + 1, 2.4).fill({ color, alpha }).poly([x - 2.1, y, x, y - 3.6, x + 2.1, y]).fill({ color, alpha }) // blood
  }
}

// Deterministic per-tile variation
const hash = (n: number) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s) }

function drawPeriod(g: PIXI.Graphics, ox: number) {
  // Back wall with bricks
  g.rect(ox, 0, P, 23).fill(0x16141b)
  for (let r = 0; r < 4; r++) {
    const y = 2 + r * 5
    g.moveTo(ox, y).lineTo(ox + P, y)
    for (let x = (r % 2) * 6; x < P; x += 12) g.moveTo(ox + x, y).lineTo(ox + x, y + 5)
  }
  g.stroke({ color: 0x0b0a0e, width: 0.6 })
  g.rect(ox, 21, P, 2).fill(0x0e0d12)

  // Floor: flagstone rows that deepen towards the camera
  const rows = [23, 31, 40, 50, 61, 73, 87, 104]
  const widths = [12, 12, 16, 16, 16, 24, 24]
  for (let r = 0; r < widths.length; r++) {
    const w = widths[r], y0 = rows[r], y1 = rows[r + 1]
    const off = (r % 2) * (w / 2)
    for (let x = -off; x < P; x += w) {
      const n = hash(r * 31 + Math.round(x))
      const shade = n < 0.33 ? 0x221f29 : n < 0.66 ? 0x26232e : 0x2a2733
      const xa = Math.max(0, x), xb = Math.min(P, x + w)
      g.rect(ox + xa + 0.4, y0 + 0.4, xb - xa - 0.8, y1 - y0 - 0.8).fill(shade)
    }
  }
  g.rect(ox, 23, P, 5).fill({ color: 0x000000, alpha: 0.35 }) // wall shadow

  // Cracks and a faint rift seam
  g.moveTo(ox + 12, 66).lineTo(ox + 18, 70).lineTo(ox + 16, 76).moveTo(ox + 18, 70).lineTo(ox + 25, 71)
    .stroke({ color: 0x0f0e13, width: 0.7 })
  g.moveTo(ox + 52, 95).lineTo(ox + 60, 92).lineTo(ox + 67, 97).lineTo(ox + 76, 94)
    .stroke({ color: 0x8a5cff, alpha: 0.18, width: 3 })
  g.moveTo(ox + 52, 95).lineTo(ox + 60, 92).lineTo(ox + 67, 97).lineTo(ox + 76, 94)
    .stroke({ color: 0xb79bff, alpha: 0.55, width: 0.7 })
  // Rubble
  for (const [x, y, r] of [[34, 44, 1.4], [37, 46, 0.9], [88, 82, 1.2], [6, 99, 1.1]]) g.circle(ox + x, y, r).fill(0x34303d)

  // Pillar standing against the wall
  g.ellipse(ox + 78, 35, 9, 3).fill({ color: 0x000000, alpha: 0.45 })
  g.rect(ox + 72, 4, 12, 30).fill(0x2f2b37)
  g.rect(ox + 72, 4, 3, 30).fill(0x3b3645)
  g.rect(ox + 81, 4, 3, 30).fill(0x24212b)
  g.rect(ox + 70, 2, 16, 4).fill(0x3a3542)
  g.rect(ox + 70, 31, 16, 4).fill(0x3a3542)
  // Torch bracket
  g.rect(ox + 29, 10, 2, 6).fill(0x4a3a2a)
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

      // Scrolling dungeon floor: three copies of one period, shifted per frame
      const floor = new PIXI.Graphics()
      for (let k = 0; k < 3; k++) drawPeriod(floor, k * P)
      const ground = new PIXI.Graphics()  // telegraphs, novas, scorch, loot on the floor
      const actors = new PIXI.Graphics()  // heroes + enemies
      const air = new PIXI.Graphics()     // spells, meteor, loot beams, torches
      const texts = new PIXI.Container()

      // Hotbar: static frame, dynamic flashes, cooldown sweeps clipped to the slots
      const hud = new PIXI.Graphics()
      hud.rect(0, BAR_Y - 3, W, H - BAR_Y + 3).fill({ color: 0x09090b, alpha: 0.94 })
      hud.rect(0, BAR_Y - 3, W, 0.8).fill(0x2c2833)
      hud.roundRect(8, BAR_Y + 4.5, 40, 4, 2).fill(0x2a1214)
      hud.roundRect(8, BAR_Y + 4.5, 34, 4, 2).fill(0xc0392b)
      hud.roundRect(152, BAR_Y + 4.5, 40, 4, 2).fill(0x101a2c)
      hud.roundRect(160, BAR_Y + 4.5, 32, 4, 2).fill(0x3a7bd5)
      const slotMask = new PIXI.Graphics()
      SLOTS.forEach((_, i) => {
        const x = BAR_X + i * (SLOT + SLOT_GAP)
        hud.roundRect(x, BAR_Y, SLOT, SLOT, 2).fill(0x17151c).stroke({ color: 0x3d3846, width: 0.8 })
        slotMask.rect(x + 0.6, BAR_Y + 0.6, SLOT - 1.2, SLOT - 1.2).fill(0xffffff)
      })
      const hudFx = new PIXI.Graphics()
      const sweep = new PIXI.Graphics()
      sweep.mask = slotMask

      app.stage.addChild(floor, ground, actors, air, texts, hud, hudFx, sweep, slotMask)

      // Damage numbers: one Text per hit, built once and only moved/faded
      const hitTexts = HITS.map(([, , dmg, color, crit]) => {
        const t = new PIXI.Text({
          text: String(dmg),
          anchor: 0.5,
          style: {
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: crit ? 7.5 : 6.5,
            fontWeight: '900',
            fill: color,
            stroke: { color: 0x0b0b0c, width: crit ? 2.4 : 2 },
          },
        })
        t.visible = false
        texts.addChild(t)
        return t
      })

      function enemyState(i: number, tm: number) {
        const e = ENEMIES[i]
        const enter = easeOut(clamp01((tm - 0.6 - e.d) / 1.0))
        let x = 215 + i * 6 + (e.x - 215 - i * 6) * enter
        let y = e.y + Math.sin(tm * 2 + i) * 1.2
        if (enter >= 1) x += Math.sin(tm * 3.1 + i * 1.7) * 1.5
        let dmg = 0, flash = false
        for (const [ht, he, hd] of HITS) {
          if (he !== i || ht > tm) continue
          dmg += hd
          if (tm - ht < 0.1) { flash = true; x += 1.6 }
        }
        const death = deathAt(i)
        let alpha = 1, lift = 0
        if (tm >= death) {
          const s = tm - death
          if (i === 5) { alpha = 1 - clamp01(s / 0.45); lift = -s * 4 }
          else {
            let dx = e.x - MC.x, dy = (e.y - MC.y) / TILT
            const len = Math.hypot(dx, dy) || 1
            if (len < 3) { dx = 1; dy = 0.3 }
            const k = easeOut(clamp01(s / 0.45)) * 24
            x += (dx / (Math.hypot(dx, dy))) * k
            y += (dy / (Math.hypot(dx, dy))) * k * TILT
            lift = Math.sin(Math.PI * clamp01(s / 0.45)) * 7
            alpha = 1 - clamp01((s - 0.2) / 0.5)
          }
        }
        return { x, y, hp: Math.max(0, 1 - dmg / e.hp), flash, alpha, lift, frozen: i < 3 && tm > 4.3 && tm < IMPACT }
      }

      function drawEnemy(i: number, s: ReturnType<typeof enemyState>) {
        const e = ENEMIES[i]
        const k = e.elite ? 1.35 : 1
        const { x, alpha } = s
        const y = s.y - s.lift
        const body = s.flash ? 0xffffff : s.frozen ? 0x6f9fc0 : e.elite ? 0x5e2a70 : 0x7a2f2f
        actors.ellipse(x, s.y + 0.5, 4 * k, 1.6 * k).fill({ color: 0x000000, alpha: 0.4 * alpha })
        actors.ellipse(x, y - 3.6 * k, 3.4 * k, 3.8 * k).fill({ color: body, alpha }).stroke({ color: 0x120608, alpha, width: 0.6 })
        actors.circle(x - 1.6 * k, y - 7.6 * k, 2.3 * k).fill({ color: body, alpha }).stroke({ color: 0x120608, alpha, width: 0.6 })
        actors.poly([x - 2.6 * k, y - 9 * k, x - 3.6 * k, y - 11.6 * k, x - 1.6 * k, y - 9.6 * k]).fill({ color: 0xd8cbb0, alpha })
        actors.poly([x - 0.4 * k, y - 9.2 * k, x + 0.6 * k, y - 11.8 * k, x + 0.8 * k, y - 9 * k]).fill({ color: 0xd8cbb0, alpha })
        actors.circle(x - 2.7 * k, y - 7.9 * k, 0.65 * k).fill({ color: e.elite ? 0xffb347 : 0xffd34a, alpha })
        actors.moveTo(x - 2.4 * k, y - 4.2 * k).lineTo(x - 5.6 * k, y - 2.6 * k).stroke({ color: body, alpha, width: 1.1 * k, cap: 'round' })
        // Health bar
        if (s.hp > 0 && alpha > 0.9) {
          const bw = e.elite ? 12 : 9, by = y - (e.elite ? 17 : 13)
          actors.rect(x - bw / 2, by, bw, 1.6).fill(0x000000)
          actors.rect(x - bw / 2 + 0.3, by + 0.3, (bw - 0.6) * s.hp, 1).fill(e.elite ? 0xffb347 : 0xd23a3a)
        }
      }

      function drawHero(kind: 0 | 1 | 2, x: number, y0: number, act: number, bob: number) {
        const y = y0 - bob
        actors.ellipse(x, y0 + 0.6, 5.5, 2).fill({ color: 0x000000, alpha: 0.45 })
        actors.ellipse(x, y0 + 0.6, 6, 2.4).stroke({ color: 0x3fd16b, alpha: 0.8, width: 0.8 })
        actors.rect(x - 2, y - 3, 1.5, 3).fill(0x1f1b25).rect(x + 0.5, y - 3, 1.5, 3).fill(0x1f1b25)
        if (kind === 0) {
          // Knight: shield, tabard, swinging sword
          actors.roundRect(x - 5.4, y - 8.4, 2.8, 5.4, 1).fill(0x6e4a2c).stroke({ color: 0xaab4c0, width: 0.5 })
          actors.roundRect(x - 3, y - 8.6, 6, 6, 1.5).fill(0xb9c3cf)
          actors.rect(x - 1.2, y - 8.2, 2.4, 5.4).fill(0xb8322b)
          actors.circle(x, y - 10.7, 2.3).fill(0xd5dde6)
          actors.rect(x + 0.2, y - 11.2, 2.2, 0.8).fill(0x22252b)
          const a = -1.1 + act * 1.9
          const hx = x + 3, hy = y - 6
          actors.moveTo(hx, hy).lineTo(hx + Math.cos(a) * 8.5, hy + Math.sin(a) * 8.5).stroke({ color: 0xeef3f8, width: 1.2, cap: 'round' })
          actors.moveTo(hx - Math.sin(a) * 1.6, hy + Math.cos(a) * 1.6).lineTo(hx + Math.sin(a) * 1.6, hy - Math.cos(a) * 1.6)
            .stroke({ color: 0xc9a227, width: 0.9 })
        } else if (kind === 1) {
          // Mage: robe, pointed hat, staff with a glowing orb
          actors.poly([x - 3.4, y - 0.5, x + 3.4, y - 0.5, x + 2, y - 9, x - 2, y - 9]).fill(0x6a4fd8)
          actors.circle(x, y - 10.3, 2).fill(0xe6c3a0)
          actors.poly([x - 3.4, y - 11.2, x + 3.4, y - 11.2, x + 0.6, y - 17]).fill(0x4a35a8)
          const tx = x + 4 + act * 1.2, ty = y - 13 - act * 1.5
          actors.moveTo(x + 4, y + 0.5).lineTo(tx, ty).stroke({ color: 0x8a6a45, width: 1.1, cap: 'round' })
          actors.circle(tx, ty, 3.6).fill({ color: ARCANE, alpha: 0.18 + 0.35 * act })
          actors.circle(tx, ty, 1.6).fill(0xd9ceff)
        } else {
          // Ranger: hooded cloak and a bow
          actors.poly([x - 3, y - 0.5, x + 3, y - 0.5, x + 2.4, y - 9, x - 2.4, y - 9]).fill(0x3f8f4a)
          actors.circle(x, y - 10.8, 2.4).fill(0x2f6e3a)
          actors.circle(x + 0.7, y - 10.2, 1.4).fill(0xe0b890)
          const bx = x + 3.2, by = y - 6
          actors.moveTo(bx + Math.cos(-1.2) * 5.5 - 3, by + Math.sin(-1.2) * 5.5).arc(bx - 3, by, 5.5, -1.2, 1.2)
            .stroke({ color: 0xa8743f, width: 1 })
          const ex = bx - 3 + Math.cos(1.2) * 5.5, ey = Math.sin(1.2) * 5.5
          actors.moveTo(ex, by - ey).lineTo(ex - act * 2.4, by).lineTo(ex, by + ey).stroke({ color: 0xdcd6c8, width: 0.4 })
        }
      }

      function draw(T: number) {
        const tm = ((T % L) + L) % L
        const scroll = scrollAt(tm)
        floor.x = -(scroll % P)
        ground.clear(); actors.clear(); air.clear(); hudFx.clear(); sweep.clear()

        // Wall torches, flickering
        for (let k = 0; k < 3; k++) {
          const tx = 30 + k * P - (scroll % P)
          const f = 0.8 + 0.2 * Math.sin(T * 17 + k * 2) * Math.sin(T * 7.3 + k)
          air.circle(tx, 9, 11 * f).fill({ color: 0xff8a2a, alpha: 0.07 })
          air.ellipse(tx, 8.5, 1.6 * f, 2.8 * f).fill(0xffa040)
          air.circle(tx, 9.5, 0.9).fill(0xfff0c0)
        }

        // Meteor telegraph + scorch (scorch rides the floor once walking resumes)
        if (tm >= 5.0 && tm < IMPACT) {
          const p = (tm - 5.0) / (IMPACT - 5.0)
          const blink = 0.5 + 0.5 * Math.sin(tm * 18)
          ground.ellipse(MC.x, MC.y, 24, 24 * TILT).fill({ color: 0xff2a2a, alpha: 0.1 + 0.06 * blink })
          ground.ellipse(MC.x, MC.y, 24 * p, 24 * p * TILT).fill({ color: 0xff2a2a, alpha: 0.22 })
          ground.ellipse(MC.x, MC.y, 24, 24 * TILT).stroke({ color: 0xff4a3a, alpha: 0.8, width: 1 })
        }
        if (tm >= IMPACT) {
          const sc = clamp01(1 - (tm - IMPACT) / 2.6)
          if (sc > 0) ground.ellipse(MC.x - (scroll - scrollAt(IMPACT)), MC.y, 20, 20 * TILT).fill({ color: 0x000000, alpha: 0.5 * sc })
        }

        // Frost nova around the knight's dash point
        const nova = (tm - 4.25) / 0.5
        if (nova >= 0 && nova < 1) {
          const r = 4 + easeOut(nova) * 30
          ground.ellipse(104, 71, r, r * TILT).fill({ color: FROST, alpha: 0.14 * (1 - nova) })
            .stroke({ color: 0xcfeaff, alpha: 0.9 * (1 - nova), width: 2 - 1.5 * nova })
          for (let j = 0; j < 8; j++) {
            const a = (j / 8) * Math.PI * 2
            const cx = 104 + Math.cos(a) * r, cy = 71 + Math.sin(a) * r * TILT
            air.moveTo(cx, cy).lineTo(cx, cy - 3.5).stroke({ color: 0xcfeaff, alpha: 0.8 * (1 - nova), width: 0.9 })
          }
        }

        // Loot on the floor (beams drawn up into the air layer)
        for (const l of LOOT) {
          const s = tm - l.t
          if (s < 0) continue
          const fade = 1 - clamp01((tm - 8.3) / 0.6)
          if (fade <= 0) continue
          const shift = scroll - scrollAt(l.t)
          const q = easeOut(clamp01(s / 0.35))
          const src = ENEMIES[l.e]
          const x = src.x + (l.x - src.x) * q - shift
          const y = src.y + (l.y - src.y) * q - Math.sin(Math.PI * clamp01(s / 0.35)) * 8
          if (l.beam && q >= 1) {
            const pulse = 0.8 + 0.2 * Math.sin(T * 4 + l.x)
            const bh = l.beam * clamp01((s - 0.35) / 0.25)
            air.rect(x - 2.2, y - bh, 4.4, bh).fill({ color: l.c, alpha: 0.18 * fade * pulse })
            air.rect(x - 0.6, y - bh, 1.2, bh).fill({ color: l.c, alpha: 0.75 * fade * pulse })
          }
          ground.ellipse(l.x - shift, l.y + 0.8, 3, 1.1).fill({ color: l.c, alpha: 0.25 * fade * q })
          air.poly([x, y - 2.4, x + 1.8, y, x, y + 1.2, x - 1.8, y]).fill({ color: l.c, alpha: fade })
          const tw = (T * 0.9 + l.x * 0.13) % 1
          if (tw < 0.25) {
            const z = Math.sin((tw / 0.25) * Math.PI) * 3
            air.star(x + 1.2, y - 2.2, 4, z, z * 0.25).fill({ color: 0xffffff, alpha: 0.9 * fade })
          }
        }

        // Actors: enemies (back to front), then heroes
        const states = ENEMIES.map((_, i) => enemyState(i, tm))
        const order = [3, 5, 0, 2, 1, 4]
        for (const i of order) if (states[i].alpha > 0 && tm > 0.55) drawEnemy(i, states[i])

        const bob = walking(tm) ? Math.abs(Math.sin(T * 9)) * 1.1 : 0
        const dash = easeOut(clamp01((tm - 3.85) / 0.3)) * (1 - easeOut(clamp01((tm - 4.5) / 0.4)))
        const kx = KNIGHT.x + (104 - KNIGHT.x) * dash, ky = KNIGHT.y + (71 - KNIGHT.y) * dash
        const swing = Math.sin(Math.PI * clamp01((tm - 1.55) / 0.3)) + Math.sin(Math.PI * clamp01((tm - 4.15) / 0.25))
        const mageAct = Math.max(
          Math.sin(Math.PI * clamp01((tm - 2.75) / 0.35)),
          tm > 3.35 && tm < 4.05 ? 1 : 0,
          Math.sin(Math.PI * clamp01((tm - 4.95) / 0.6)),
        )
        const bowDraw = Math.sin(Math.PI * clamp01((tm - 1.9) / 0.35))
        drawHero(2, RANGER.x, RANGER.y, bowDraw, bob)
        drawHero(1, MAGE.x, MAGE.y, mageAct, bob)
        drawHero(0, kx, ky, swing, bob)
        const tip = { x: MAGE.x + 4 + mageAct * 1.2, y: MAGE.y - 13 - mageAct * 1.5 }
        const chest = (i: number) => ({ x: states[i].x - 1, y: states[i].y - 5 })

        // Fire cone from the knight's sword
        const fc = (tm - 1.6) / 0.38
        if (fc >= 0 && fc < 1) {
          const len = 84 * easeOut(clamp01(fc / 0.4))
          const a = 1 - fc
          const ox = kx + 5, oy = ky - 5
          air.moveTo(ox, oy).arc(ox, oy, len, -0.34, 0.34).closePath().fill({ color: FIRE, alpha: 0.28 * a })
          air.moveTo(ox, oy).arc(ox, oy, len * 0.62, -0.22, 0.22).closePath().fill({ color: 0xffd27a, alpha: 0.35 * a })
        }

        // Nature volley from the ranger
        const nv = (tm - 2.1) / 0.3
        if (nv >= 0 && nv < 1) {
          for (const i of [1, 4, 3]) {
            const sx = RANGER.x + 4, sy = RANGER.y - 6, to = chest(i)
            const x = sx + (to.x - sx) * nv, y = sy + (to.y - sy) * nv
            const dx = to.x - sx, dy = to.y - sy, len = Math.hypot(dx, dy)
            air.moveTo(x - (dx / len) * 6, y - (dy / len) * 6).lineTo(x, y).stroke({ color: NATURE, width: 1, cap: 'round' })
            air.circle(x, y, 1).fill(0xd8ffd0)
          }
        }

        // Lightning chain: mage -> 0 -> 3 -> 5
        const lc = (tm - 2.8) / 0.28
        if (lc >= 0 && lc < 1) {
          const pts = [tip, chest(0), chest(3), chest(5)]
          const seed = Math.floor(tm * 30)
          for (let j = 0; j < pts.length - 1; j++) {
            const a = pts[j], b = pts[j + 1]
            air.moveTo(a.x, a.y)
            for (let s = 1; s < 5; s++) {
              const f = s / 5
              air.lineTo(a.x + (b.x - a.x) * f + (hash(seed + j * 7 + s) - 0.5) * 4, a.y + (b.y - a.y) * f + (hash(seed * 3 + s + j) - 0.5) * 5)
            }
            air.lineTo(b.x, b.y)
          }
          air.stroke({ color: LIGHT, alpha: 0.3 * (1 - lc), width: 3.2, join: 'round' })
          air.moveTo(pts[0].x, pts[0].y)
          for (let j = 1; j < pts.length; j++) air.lineTo(pts[j].x, pts[j].y)
          air.stroke({ color: 0xfffbe0, alpha: 0.9 * (1 - lc), width: 0.8 })
        }

        // Arcane beam into the far enemy
        if (tm >= 3.4 && tm < 4.0) {
          const to = chest(5)
          const w = 1.6 + 0.6 * Math.sin(tm * 40)
          air.moveTo(tip.x, tip.y).lineTo(to.x, to.y).stroke({ color: ARCANE, alpha: 0.3, width: w + 3.5, cap: 'round' })
          air.moveTo(tip.x, tip.y).lineTo(to.x, to.y).stroke({ color: 0xe2d8ff, alpha: 0.95, width: w * 0.6, cap: 'round' })
          air.circle(to.x, to.y, 3 + Math.sin(tm * 30)).fill({ color: ARCANE, alpha: 0.45 })
        }

        // Meteor fall, flash, shock ring
        if (tm >= IMPACT - 0.45 && tm < IMPACT) {
          const p = (tm - (IMPACT - 0.45)) / 0.45
          const q = p * p
          const sx = 235, sy = -30
          const x = sx + (MC.x - sx) * q, y = sy + (MC.y - 5 - sy) * q
          const dx = MC.x - sx, dy = MC.y - sy, len = Math.hypot(dx, dy)
          for (let j = 4; j >= 1; j--) {
            const t = j * 7
            air.moveTo(x - (dx / len) * t, y - (dy / len) * t).lineTo(x - (dx / len) * (t - 7), y - (dy / len) * (t - 7))
              .stroke({ color: 0xff8a2a, alpha: 0.6 - j * 0.12, width: 5 - j * 0.9, cap: 'round' })
          }
          air.circle(x, y, 6.5).fill({ color: 0xff8a2a, alpha: 0.35 })
          air.circle(x, y, 3.4).fill(0xfff0c0)
        }
        const since = tm - IMPACT
        if (since >= 0 && since < 0.8) {
          const s = since / 0.8
          const flash = clamp01(1 - since / 0.25)
          if (flash > 0) air.ellipse(MC.x, MC.y - 2, 28, 28 * TILT).fill({ color: 0xffd9a0, alpha: 0.6 * flash })
          const ring = 8 + easeOut(s) * 56
          ground.ellipse(MC.x, MC.y, ring, ring * TILT).stroke({ color: 0xffb060, alpha: 0.95 * (1 - s), width: 3 - 2.4 * s })
          ground.ellipse(MC.x, MC.y, ring * 0.8, ring * 0.8 * TILT).stroke({ color: 0xff6a2a, alpha: 0.4 * (1 - s), width: 1 })
        }

        // Floating damage numbers
        HITS.forEach(([ht, he, , , crit], j) => {
          const t = hitTexts[j]
          const s = tm - ht
          if (s < 0 || s >= 0.9) { t.visible = false; return }
          const e = ENEMIES[he]
          t.visible = true
          t.position.set(e.x + ((j % 3) - 1) * 6, e.y - 14 - s * 11 - (crit ? 3 : 0))
          t.alpha = 1 - clamp01((s - 0.55) / 0.35)
          t.scale.set(1 + (crit ? 0.5 : 0.25) * (1 - clamp01(s / 0.15)))
        })

        // Hotbar: flash on cast, cooldown sweep afterwards
        SLOTS.forEach((sl, i) => {
          const x = BAR_X + i * (SLOT + SLOT_GAP), cx = x + SLOT / 2, cy = BAR_Y + SLOT / 2
          const s = (tm - sl.cast + L) % L
          const cooling = s < sl.cd
          if (s < 0.35) {
            const f = 1 - s / 0.35
            hudFx.roundRect(x - 2, BAR_Y - 2, SLOT + 4, SLOT + 4, 3).fill({ color: sl.c, alpha: 0.25 * f })
            hudFx.roundRect(x, BAR_Y, SLOT, SLOT, 2).fill({ color: sl.c, alpha: 0.45 * f })
          }
          glyph(hudFx, i, cx, cy, sl.c, cooling ? 0.5 : 1)
          if (!cooling) hudFx.roundRect(x, BAR_Y, SLOT, SLOT, 2).stroke({ color: sl.c, alpha: 0.55, width: 0.7 })
          if (cooling) {
            const rem = 1 - s / sl.cd
            sweep.moveTo(cx, cy).arc(cx, cy, 10, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * rem).closePath()
              .fill({ color: 0x000000, alpha: 0.6 })
          }
        })
      }

      if (still) {
        // One representative frame: just after the meteor lands, loot dropping
        app.ticker.stop()
        draw(IMPACT + 0.24)
        app.render()
        return
      }

      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) app.ticker.start()
        else app.ticker.stop()
      })
      io.observe(container)

      let T = 0.3
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
