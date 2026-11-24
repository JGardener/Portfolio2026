import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { prefersReducedMotion } from '../../lib/gsap'

// A miniature of git/compare: two GitHub profiles side by side, each with an
// avatar, name, follower/star chips, contribution heatmap, language bar and
// top repos. Names are abstract bars. Loops gently: the heatmap fills in,
// the language bar grows and the counts tick up, holds, then eases out.
const W = 200
const H = 120

// GitHub dark palette.
const PAGE = 0x010409
const CARD = 0x0d1117
const BORDER = 0x30363d
const CHIP = 0x161b22
const TEXT = 0xe6edf3
const MUTED = 0x7d8590
const LINK = 0x4493f8
const STAR = 0xe3b341
const LEVELS = [0x161b22, 0x0e4429, 0x006d32, 0x26a641, 0x39d353]

// Linguist colours, lifted a touch where they vanish on the dark card.
const LANGS = { ts: 0x3178c6, js: 0xf1e05a, css: 0x8a5cd1, html: 0xe34c26, shell: 0x89e051 }

const PAD = 5
const GAP = 4
const COL_W = (W - PAD * 2 - GAP) / 2 // 93
const CELL = 4
const CELL_GAP = 1
const HM_COLS = 16
const HM_ROWS = 7

// Loop timeline, in seconds.
const T_IN = 2.6
const T_HOLD = 6.4
const T_OUT = 0.9
const T_LOOP = T_IN + T_HOLD + T_OUT

interface Profile {
  avatar: number
  nameW: number
  handleW: number
  followers: number
  stars: number
  langs: [number, number][] // [colour, share]
  repos: { nameW: number; stars: number }[]
  density: number
}

const PROFILES: Profile[] = [
  {
    avatar: 0x2f81f7,
    nameW: 38,
    handleW: 24,
    followers: 1284,
    stars: 3471,
    langs: [[LANGS.ts, 0.52], [LANGS.js, 0.22], [LANGS.css, 0.16], [LANGS.html, 0.1]],
    repos: [{ nameW: 34, stars: 1820 }, { nameW: 26, stars: 942 }, { nameW: 30, stars: 377 }],
    density: 0.72,
  },
  {
    avatar: 0xdb6d28,
    nameW: 30,
    handleW: 20,
    followers: 862,
    stars: 1958,
    langs: [[LANGS.js, 0.38], [LANGS.ts, 0.31], [LANGS.css, 0.19], [LANGS.shell, 0.12]],
    repos: [{ nameW: 28, stars: 1106 }, { nameW: 36, stars: 514 }, { nameW: 22, stars: 203 }],
    density: 0.55,
  },
]

const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

function lerpColor(a: number, b: number, t: number) {
  const ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff
  const br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff
  return (
    (Math.round(ar + (br - ar) * t) << 16) |
    (Math.round(ag + (bg - ag) * t) << 8) |
    Math.round(ab + (bb - ab) * t)
  )
}

const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n))

export default function GithubHeatmapThumb() {
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

      if (cancelled) { app.destroy(true, { children: true }); return }

      initialized = true
      container.appendChild(app.canvas)

      // ---- Static chrome: page, cards, avatars, bars, icons (drawn once) ----
      const chrome = new PIXI.Graphics()
      chrome.rect(0, 0, W, H).fill({ color: PAGE })
      app.stage.addChild(chrome)

      const style = new PIXI.TextStyle({
        fontFamily: '"Archivo Variable", system-ui, -apple-system, "Segoe UI", sans-serif',
        fontSize: 5.5,
        fontWeight: '600',
        fill: TEXT,
      })
      const mutedStyle = style.clone()
      mutedStyle.fill = MUTED
      mutedStyle.fontWeight = '500'

      interface Counter { text: PIXI.Text; target: number; shown: number; fmt: (n: number) => string }
      interface Column {
        cells: PIXI.Sprite[]
        levels: number[]
        delays: number[]
        langSegs: PIXI.Sprite[]
        langShares: number[]
        langX: number
        langW: number
        counters: Counter[]
      }
      const columns: Column[] = []

      const icon = new PIXI.Graphics()
      const dynamic = new PIXI.Container()
      app.stage.addChild(dynamic)
      app.stage.addChild(icon)

      PROFILES.forEach((p, ci) => {
        const x = PAD + ci * (COL_W + GAP)
        const y = PAD
        const cw = COL_W
        const ch = H - PAD * 2
        const ix = x + 5 // inner left
        const iw = cw - 10 // inner width

        chrome.roundRect(x, y, cw, ch, 3).fill({ color: CARD }).stroke({ color: BORDER, width: 0.6 })

        // Avatar: identicon in a circle.
        const ax = ix + 7
        const ay = y + 11
        chrome.circle(ax, ay, 7).fill({ color: CHIP }).stroke({ color: BORDER, width: 0.5 })
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 2; c++) {
            if (((r * 7 + c * 3 + ci * 5) % 4) === 0) continue
            const px = 2.4
            chrome.rect(ax - px * 1.5 + c * px, ay - px * 1.5 + r * px, px, px).fill({ color: p.avatar })
            chrome.rect(ax + px * 1.5 - (c + 1) * px, ay - px * 1.5 + r * px, px, px).fill({ color: p.avatar })
          }
        }

        // Name + handle as abstract bars.
        chrome.roundRect(ix + 17, y + 6, p.nameW, 3.6, 1.8).fill({ color: TEXT, alpha: 0.88 })
        chrome.roundRect(ix + 17, y + 12.5, p.handleW, 2.6, 1.3).fill({ color: MUTED, alpha: 0.8 })

        const counters: Counter[] = []
        const addCounter = (tx: number, ty: number, target: number, s: PIXI.TextStyle, anchorX: number, fmt = formatCount) => {
          const text = new PIXI.Text({ text: fmt(target), style: s })
          text.anchor.set(anchorX, 0.5)
          text.position.set(tx, ty)
          dynamic.addChild(text)
          counters.push({ text, target, shown: target, fmt })
        }

        // Stat chips: followers, stars.
        const chipY = y + 22
        const chipW = (iw - 3) / 2
        for (let k = 0; k < 2; k++) {
          const cx = ix + k * (chipW + 3)
          chrome.roundRect(cx, chipY, chipW, 8, 4).fill({ color: CHIP }).stroke({ color: BORDER, width: 0.5 })
          if (k === 0) {
            // Person glyph.
            icon.circle(cx + 5, chipY + 3, 1.2).fill({ color: MUTED })
            icon.ellipse(cx + 5, chipY + 6.1, 2.1, 1.3).fill({ color: MUTED })
          } else {
            icon.star(cx + 5, chipY + 4, 5, 2.1, 0.95).fill({ color: STAR })
          }
          addCounter(cx + 9, chipY + 4.2, k === 0 ? p.followers : p.stars, style, 0)
        }

        // Contribution heatmap: one tinted sprite per cell.
        const hmW = HM_COLS * (CELL + CELL_GAP) - CELL_GAP
        const hmX = ix + Math.round((iw - hmW) / 2)
        const hmY = y + 35
        const cells: PIXI.Sprite[] = []
        const levels: number[] = []
        const delays: number[] = []
        for (let c = 0; c < HM_COLS; c++) {
          for (let r = 0; r < HM_ROWS; r++) {
            const sp = new PIXI.Sprite(PIXI.Texture.WHITE)
            sp.position.set(hmX + c * (CELL + CELL_GAP), hmY + r * (CELL + CELL_GAP))
            sp.width = CELL
            sp.height = CELL
            sp.tint = LEVELS[0]
            dynamic.addChild(sp)
            cells.push(sp)
            // Busier mid-week and toward recent weeks.
            const weekday = r > 0 && r < 6 ? 1 : 0.45
            const recency = 0.55 + (c / HM_COLS) * 0.6
            const roll = Math.random() * weekday * recency * p.density * 1.9
            levels.push(roll < 0.25 ? 0 : Math.min(4, Math.ceil(roll * 2.4)))
            delays.push((c / HM_COLS) * 1.3 + Math.random() * 0.35)
          }
        }

        // Stacked language bar.
        const langY = hmY + HM_ROWS * (CELL + CELL_GAP) + 3
        chrome.roundRect(ix, langY, iw, 3.5, 1.75).fill({ color: CHIP })
        const langSegs: PIXI.Sprite[] = []
        const langShares: number[] = []
        for (const [color, share] of p.langs) {
          const sp = new PIXI.Sprite(PIXI.Texture.WHITE)
          sp.tint = color
          sp.position.set(ix, langY)
          sp.height = 3.5
          sp.width = 0
          dynamic.addChild(sp)
          langSegs.push(sp)
          langShares.push(share)
        }

        // Top repos: book glyph, name bar, star count right-aligned.
        const repoY0 = langY + 9
        p.repos.forEach((repo, ri) => {
          const ry = repoY0 + ri * 8
          if (ri > 0) chrome.rect(ix, ry - 4, iw, 0.4).fill({ color: BORDER })
          icon.roundRect(ix, ry - 1.8, 2.8, 3.6, 0.5).stroke({ color: MUTED, width: 0.5 })
          chrome.roundRect(ix + 5, ry - 1.3, repo.nameW, 2.6, 1.3).fill({ color: LINK, alpha: 0.9 })
          icon.star(ix + iw - 15, ry, 5, 1.8, 0.8).fill({ color: MUTED })
          addCounter(ix + iw, ry + 0.2, repo.stars, mutedStyle, 1)
        })

        columns.push({ cells, levels, delays, langSegs, langShares, langX: ix, langW: iw, counters })
      })

      // ---- Animation: driven by elapsed seconds ----
      const render = (t: number) => {
        // grow: 0 → 1 across the intro, 1 through the hold, back to 0 on the way out.
        const out = t > T_IN + T_HOLD ? clamp01((t - T_IN - T_HOLD) / T_OUT) : 0
        for (const col of columns) {
          for (let i = 0; i < col.cells.length; i++) {
            const lvl = col.levels[i]
            if (lvl === 0) continue
            const k = easeOut((t - col.delays[i]) / 0.45) * (1 - easeOut(out))
            col.cells[i].tint = lerpColor(LEVELS[0], LEVELS[lvl], k)
          }

          let x = col.langX
          for (let s = 0; s < col.langSegs.length; s++) {
            const k = easeOut((t - 0.5 - s * 0.32) / 0.9) * (1 - easeOut(out))
            const seg = col.langSegs[s]
            seg.x = x
            seg.width = col.langShares[s] * col.langW * k
            x += seg.width
          }

          const count = easeOut((t - 0.15) / 2.1) * (1 - easeOut(out))
          for (const c of col.counters) {
            const v = Math.round(c.target * count)
            // Only re-render the text when the shown value changes.
            if (v !== c.shown) {
              c.shown = v
              const label = c.fmt(v)
              if (label !== c.text.text) c.text.text = label
            }
          }
        }
      }

      if (reduced) {
        // One finished still: everything filled in, ticker never started.
        app.ticker.stop()
        render(T_IN)
        app.render()
        return
      }

      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) app.ticker.start()
        else app.ticker.stop()
      })
      io.observe(container)

      let elapsed = 0
      render(0)
      app.ticker.add((tick) => {
        elapsed = (elapsed + Math.min(tick.deltaTime, 3) / 60) % T_LOOP
        render(elapsed)
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
