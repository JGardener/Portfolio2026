import {
  Application,
  Graphics,
  Particle,
  ParticleContainer,
  type Texture,
} from 'pixi.js'

/**
 * WebGL hero — a GPU particle field that morphs between words.
 *
 * Particles spring toward sampled letterform targets, repel from the
 * pointer, and disperse upward as the hero scrolls out (driven by
 * setScatter from a ScrollTrigger). A sparse ambient starfield drifts
 * behind with light pointer parallax. Tint follows the --accent token
 * and updates live on theme change.
 */

const WORDS = ['JG', 'REACT', 'TYPESCRIPT', 'PIXIJS', 'GSAP', 'WEBGL']
const HOLD_MS = 3000
const MOUSE_R = 150
const DAMPING = 0.88

export interface PixiHeroHandle {
  /** 0 = settled, 1 = fully dispersed. Driven by scroll progress. */
  setScatter(v: number): void
  destroy(): void
}

interface WordParticle {
  x: number
  y: number
  vx: number
  vy: number
  tx: number
  ty: number
  k: number
  baseAlpha: number
  phase: number
  isAccent: boolean
  view: Particle
}

interface AmbientParticle {
  x: number
  y: number
  vx: number
  vy: number
  depth: number
  baseAlpha: number
  phase: number
  isAccent: boolean
  view: Particle
}

function readAccent(): number {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent')
    .trim()
  if (/^#[0-9a-f]{6}$/i.test(v)) return parseInt(v.slice(1), 16)
  return 0x4f8cff
}

/** Sample letterform pixels of a word into shuffled target points. */
function sampleWord(
  word: string,
  w: number,
  h: number,
  budget: number
): { x: number; y: number }[] {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []

  let fontSize = Math.min(h * 0.55, 440)
  const setFont = () => {
    ctx.font = `800 ${fontSize}px Syne, sans-serif`
  }
  setFont()
  const maxWidth = w * 0.86
  const measured = ctx.measureText(word).width
  if (measured > maxWidth) {
    fontSize *= maxWidth / measured
    setFont()
  }
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#fff'
  ctx.fillText(word, w / 2, h * 0.46)

  const data = ctx.getImageData(0, 0, w, h).data
  const points: { x: number; y: number }[] = []
  const collect = (step: number) => {
    points.length = 0
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        if (data[(y * w + x) * 4 + 3] > 128) points.push({ x, y })
      }
    }
  }
  let step = 4
  collect(step)
  while (points.length > budget * 1.5 && step < 14) collect(++step)
  while (points.length < budget * 0.4 && step > 2) collect(--step)

  for (let i = points.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0
    ;[points[i], points[j]] = [points[j], points[i]]
  }
  return points
}

export function initPixiHero(host: HTMLElement): PixiHeroHandle {
  let destroyed = false
  let app: Application | null = null
  let io: IntersectionObserver | undefined
  let ro: ResizeObserver | undefined
  let themeObserver: MutationObserver | undefined
  let removePointer: (() => void) | undefined

  const state = { scatter: 0, fade: 0 }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  async function setup() {
    await document.fonts.load('800 200px "Syne"').catch(() => {})
    if (destroyed) return

    const pixi = new Application()
    await pixi.init({
      backgroundAlpha: 0,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
      resizeTo: host,
    })
    if (destroyed) {
      pixi.destroy(true, { children: true })
      return
    }
    app = pixi
    pixi.canvas.style.width = '100%'
    pixi.canvas.style.height = '100%'
    host.appendChild(pixi.canvas)

    let W = host.clientWidth
    let H = host.clientHeight
    let accent = readAccent()

    // Soft round sprite shared by every particle: bright core + faint halo.
    const dot = new Graphics()
    dot.circle(8, 8, 8).fill({ color: 0xffffff, alpha: 0.16 })
    dot.circle(8, 8, 3).fill({ color: 0xffffff, alpha: 1 })
    const texture: Texture = pixi.renderer.generateTexture({
      target: dot,
      resolution: 2,
    })
    dot.destroy()

    const container = new ParticleContainer({
      dynamicProperties: { position: true, color: true },
    })
    pixi.stage.addChild(container)

    const particleCount = () =>
      Math.round(Math.min(2400, Math.max(450, (W * H) / 550)))
    const ambientCount = () => Math.round(particleCount() / 6)

    let particles: WordParticle[] = []
    let ambient: AmbientParticle[] = []
    const wordCache = new Map<string, { x: number; y: number }[]>()
    let wordIndex = 0

    const targetsFor = (word: string) => {
      const key = `${word}:${W}x${H}`
      let pts = wordCache.get(key)
      if (!pts) {
        pts = sampleWord(word, W, H, particleCount())
        wordCache.set(key, pts)
      }
      return pts
    }

    function buildParticles() {
      particles = []
      ambient = []

      // Ambient starfield first so word particles draw on top.
      const aCount = ambientCount()
      for (let i = 0; i < aCount; i++) {
        const isAccent = Math.random() < 0.78
        const scale = 0.4 + Math.random() * 0.5
        const view = new Particle({
          texture,
          x: Math.random() * W,
          y: Math.random() * H,
          anchorX: 0.5,
          anchorY: 0.5,
          scaleX: scale,
          scaleY: scale,
          tint: isAccent ? accent : 0xffffff,
          alpha: 0,
        })
        container.addParticle(view)
        ambient.push({
          x: view.x,
          y: view.y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          depth: 0.3 + Math.random() * 0.7,
          baseAlpha: 0.06 + Math.random() * 0.2,
          phase: Math.random() * Math.PI * 2,
          isAccent,
          view,
        })
      }

      const pts = targetsFor(WORDS[wordIndex])
      const count = particleCount()
      for (let i = 0; i < count; i++) {
        const t = pts.length ? pts[i % pts.length] : { x: W / 2, y: H / 2 }
        const startX = reduced ? t.x : Math.random() * W
        const startY = reduced ? t.y : Math.random() * H
        const isAccent = Math.random() < 0.78
        const scale = 0.45 + Math.random() * 0.65
        const view = new Particle({
          texture,
          x: startX,
          y: startY,
          anchorX: 0.5,
          anchorY: 0.5,
          scaleX: scale,
          scaleY: scale,
          tint: isAccent ? accent : 0xffffff,
          alpha: 0,
        })
        container.addParticle(view)
        particles.push({
          x: startX,
          y: startY,
          vx: 0,
          vy: 0,
          tx: t.x,
          ty: t.y,
          k: 0.012 + Math.random() * 0.026,
          baseAlpha: 0.45 + Math.random() * 0.55,
          phase: Math.random() * Math.PI * 2,
          isAccent,
          view,
        })
      }
    }

    function retarget(burst: boolean) {
      const pts = targetsFor(WORDS[wordIndex])
      if (!pts.length) return
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const t = pts[i % pts.length]
        p.tx = t.x
        p.ty = t.y
        if (burst) {
          p.vx += (Math.random() - 0.5) * 7
          p.vy += (Math.random() - 0.5) * 7
        }
      }
    }

    buildParticles()
    if (reduced) state.fade = 1

    // Pointer repulsion — listen on window since the canvas itself is
    // pointer-events: none to keep hero text selectable.
    const mouse = { x: -9999, y: -9999, active: false }
    if (!reduced) {
      const onMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect()
        mouse.x = e.clientX - r.left
        mouse.y = e.clientY - r.top
        mouse.active = mouse.y >= 0 && mouse.y <= r.height
      }
      const onLeave = () => {
        mouse.active = false
      }
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerleave', onLeave)
      removePointer = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerleave', onLeave)
      }
    }

    let elapsed = 0
    let lastSwap = 0

    pixi.ticker.add((ticker) => {
      const dt = Math.min(ticker.deltaTime, 2.5)
      elapsed += ticker.deltaMS

      if (!reduced && elapsed - lastSwap > HOLD_MS) {
        lastSwap = elapsed
        wordIndex = (wordIndex + 1) % WORDS.length
        retarget(true)
      }

      state.fade = Math.min(1, state.fade + 0.012 * dt)
      const scatter = state.scatter
      const globalAlpha = state.fade * Math.max(0, 1 - scatter * 1.15)
      const scatterLift = scatter * H * 0.5

      for (const p of particles) {
        p.vx += (p.tx - p.x) * p.k * dt
        p.vy += (p.ty - scatterLift - p.y) * p.k * dt

        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < MOUSE_R * MOUSE_R && d2 > 0.01) {
            const d = Math.sqrt(d2)
            const force = ((1 - d / MOUSE_R) * 1.6 * dt) / d
            p.vx += dx * force
            p.vy += dy * force
          }
        }

        p.vx *= DAMPING
        p.vy *= DAMPING
        p.x += p.vx * dt
        p.y += p.vy * dt

        const twinkle = reduced
          ? 1
          : 0.72 + 0.28 * Math.sin(elapsed * 0.0015 + p.phase)
        p.view.x = p.x
        p.view.y = p.y
        p.view.alpha = p.baseAlpha * twinkle * globalAlpha
      }

      const px = mouse.active ? (mouse.x / W - 0.5) * 14 : 0
      const py = mouse.active ? (mouse.y / H - 0.5) * 14 : 0
      for (const a of ambient) {
        if (!reduced) {
          a.x += a.vx * dt
          a.y += a.vy * dt
          if (a.x < -12) a.x = W + 12
          if (a.x > W + 12) a.x = -12
          if (a.y < -12) a.y = H + 12
          if (a.y > H + 12) a.y = -12
        }
        const twinkle = reduced
          ? 1
          : 0.6 + 0.4 * Math.sin(elapsed * 0.001 + a.phase)
        a.view.x = a.x + px * a.depth
        a.view.y = a.y + py * a.depth
        a.view.alpha = a.baseAlpha * twinkle * state.fade * (1 - scatter * 0.6)
      }
    })

    // Pause rendering while the hero is offscreen.
    io = new IntersectionObserver(([entry]) => {
      if (!app) return
      if (entry.isIntersecting) app.ticker.start()
      else app.ticker.stop()
    })
    io.observe(host)

    // Re-sample letterforms when the hero resizes.
    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (destroyed || !app) return
        const nw = host.clientWidth
        const nh = host.clientHeight
        if (nw === W && nh === H) return
        W = nw
        H = nh
        wordCache.clear()
        retarget(false)
        for (const a of ambient) {
          a.x = Math.random() * W
          a.y = Math.random() * H
        }
      }, 150)
    })
    ro.observe(host)

    // Follow theme changes — retint accent-coloured particles.
    themeObserver = new MutationObserver(() => {
      const next = readAccent()
      if (next === accent) return
      accent = next
      for (const p of particles) {
        if (p.isAccent) p.view.tint = next
      }
      for (const a of ambient) {
        if (a.isAccent) a.view.tint = next
      }
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
  }

  void setup()

  return {
    setScatter(v: number) {
      state.scatter = Math.min(1, Math.max(0, v))
    },
    destroy() {
      destroyed = true
      io?.disconnect()
      ro?.disconnect()
      themeObserver?.disconnect()
      removePointer?.()
      if (app) {
        app.destroy(true, { children: true, texture: true })
        app = null
      }
    },
  }
}
