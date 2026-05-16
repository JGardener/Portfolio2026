import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'

const TEAL = 0x00d4aa
const W = 200
const H = 120
const N = 200

type Phase = 'drift' | 'converge' | 'hold'

function mortonCode(x: number, y: number): number {
  let z = 0
  for (let i = 0; i < 8; i++) {
    z |= ((x >> i) & 1) << (2 * i)
    z |= ((y >> i) & 1) << (2 * i + 1)
  }
  return z
}

async function sampleLetterTargets(count: number): Promise<Array<{ x: number; y: number }>> {
  await document.fonts.load('700 92px "Syne"')

  const scale = 2
  const cw = W * scale
  const ch = H * scale
  const offscreen = document.createElement('canvas')
  offscreen.width = cw
  offscreen.height = ch
  const ctx = offscreen.getContext('2d')!

  ctx.fillStyle = '#fff'
  ctx.font = 'bold 92px Syne'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('VISIO', cw / 2, ch / 2)

  const { data } = ctx.getImageData(0, 0, cw, ch)
  const pool: Array<{ x: number; y: number }> = []

  for (let r = 0; r < ch; r++) {
    for (let c = 0; c < cw; c++) {
      if (data[(r * cw + c) * 4 + 3] > 128) {
        pool.push({ x: c / scale, y: r / scale })
      }
    }
  }

  if (pool.length === 0) {
    return Array.from({ length: count }, () => ({ x: Math.random() * W, y: Math.random() * H }))
  }

  // Z-curve sort: each stratified bucket maps to a distinct 2D spatial region,
  // guaranteeing uniform coverage across all letterforms with no axis-aligned bias
  pool.sort((a, b) =>
    mortonCode(Math.floor(a.x * 2), Math.floor(a.y * 2)) -
    mortonCode(Math.floor(b.x * 2), Math.floor(b.y * 2))
  )
  const step = pool.length / count
  return Array.from({ length: count }, (_, i) => {
    const start = Math.floor(i * step)
    const end = Math.min(Math.floor((i + 1) * step), pool.length - 1)
    return pool[start + Math.floor(Math.random() * Math.max(1, end - start))]
  })
}

export default function VISIOThumb() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    const app = new PIXI.Application()
    let cancelled = false
    let initialized = false
    let io: IntersectionObserver | undefined

    async function init() {
      const targets = await sampleLetterTargets(N)
      if (cancelled) return

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

      const px  = Array.from({ length: N }, () => Math.random() * W)
      const py  = Array.from({ length: N }, () => Math.random() * H)
      const pvx = Array.from({ length: N }, () => (Math.random() - 0.5) * 0.8)
      const pvy = Array.from({ length: N }, () => (Math.random() - 0.5) * 0.8)
      const ptx = targets.map(t => t.x)
      const pty = targets.map(t => t.y)
      const pglow = new Array<number>(N).fill(1)

      const lineGfx     = new PIXI.Graphics()
      const particleGfx = new PIXI.Graphics()
      app.stage.addChild(lineGfx)
      app.stage.addChild(particleGfx)

      let phase: Phase = 'drift'
      let timer = 0

      app.ticker.add(() => {
        timer++
        lineGfx.clear()
        particleGfx.clear()

        // ── Drift ──────────────────────────────────────────────────────────
        if (phase === 'drift') {
          for (let i = 0; i < N; i++) {
            pvx[i] = pvx[i] * 0.99 + (Math.random() - 0.5) * 0.04
            pvy[i] = pvy[i] * 0.99 + (Math.random() - 0.5) * 0.04
            px[i] += pvx[i]; py[i] += pvy[i]
            if (px[i] < 0) px[i] = W; if (px[i] > W) px[i] = 0
            if (py[i] < 0) py[i] = H; if (py[i] > H) py[i] = 0
          }
          for (let i = 0; i < N; i++) {
            for (let j = i + 1; j < N; j++) {
              const dx = px[i] - px[j], dy = py[i] - py[j]
              const d2 = dx * dx + dy * dy
              if (d2 < 1600) {
                lineGfx.moveTo(px[i], py[i]).lineTo(px[j], py[j])
                  .stroke({ color: TEAL, alpha: (1 - Math.sqrt(d2) / 40) * 0.15, width: 0.4 })
              }
            }
          }
          if (timer >= 180) { phase = 'converge'; timer = 0 }

        // ── Converge ───────────────────────────────────────────────────────
        } else if (phase === 'converge') {
          let settled = true
          for (let i = 0; i < N; i++) {
            px[i] += (ptx[i] - px[i]) * 0.08
            py[i] += (pty[i] - py[i]) * 0.08
            const dx = ptx[i] - px[i], dy = pty[i] - py[i]
            if (dx * dx + dy * dy > 2.25) settled = false
          }
          if (settled || timer >= 90) {
            phase = 'hold'; timer = 0
            for (let i = 0; i < N; i++) pglow[i] = 2.5
          }

        // ── Hold ───────────────────────────────────────────────────────────
        } else {
          for (let i = 0; i < N; i++) {
            if (pglow[i] > 1) pglow[i] -= (pglow[i] - 1) * 0.08
          }
          if (timer >= 80) {
            phase = 'drift'; timer = 0
            for (let i = 0; i < N; i++) {
              pvx[i] = (Math.random() - 0.5) * 2
              pvy[i] = (Math.random() - 0.5) * 2
              pglow[i] = 1
            }
          }
        }

        // ── Draw ───────────────────────────────────────────────────────────
        for (let i = 0; i < N; i++) {
          particleGfx.circle(px[i], py[i], 6 * pglow[i]).fill({ color: TEAL, alpha: 0.12 })
          particleGfx.circle(px[i], py[i], 2).fill({ color: TEAL, alpha: 0.9 })
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
