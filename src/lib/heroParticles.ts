interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
  ph: number
}

interface DrawFieldOptions {
  linkDist: number
  linkAlpha: number
  mouseStrength: number
  alphaScale: number
  glowR: number
}

const ACCENT: [number, number, number] = [79, 140, 255]

export function initHeroParticles(): () => void {
  const bg = document.getElementById('hero-canvas') as HTMLCanvasElement | null
  const fg = document.getElementById('hero-letter-canvas') as HTMLCanvasElement | null
  if (!bg) return () => {}

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const mouse = { x: -9999, y: -9999, active: false }

  // ---- Background field (sparse, ambient, linked) ----
  const bgCtx = bg.getContext('2d')!
  let bgW = 0, bgH = 0, bgLeft = 0, bgTop = 0
  let bgParticles: Particle[] = []

  function bgResize() {
    const r = bg!.getBoundingClientRect()
    bgW = r.width
    bgH = r.height
    bgLeft = r.left
    bgTop = r.top
    bg!.width = bgW * dpr
    bg!.height = bgH * dpr
    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const N = Math.round((bgW * bgH) / 24000)
    bgParticles = Array.from({ length: N }, () => ({
      x: Math.random() * bgW,
      y: Math.random() * bgH,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      r: Math.random() * 1.2 + 0.3,
      a: Math.random() * 0.3 + 0.08,
      ph: Math.random() * Math.PI * 2,
    }))
  }

  const onPointerMove = (e: PointerEvent) => {
    mouse.x = e.clientX - bgLeft
    mouse.y = e.clientY - bgTop
    mouse.active = true
  }
  const onPointerLeave = () => {
    mouse.x = -9999
    mouse.y = -9999
    mouse.active = false
  }
  bg.addEventListener('pointermove', onPointerMove)
  bg.addEventListener('pointerleave', onPointerLeave)

  // ---- Letter canvas (dense, bright, clipped by SVG) ----
  const fgCtx: CanvasRenderingContext2D | null = fg ? fg.getContext('2d') : null
  let fgW = 0, fgH = 0
  let fgParticles: Particle[] = []

  function fgResize() {
    if (!fg || !fgCtx) return
    const r = fg.getBoundingClientRect()
    fgW = r.width
    fgH = r.height
    fg.width = fgW * dpr
    fg.height = fgH * dpr
    fgCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const N = Math.round((fgW * fgH) / 3200)
    fgParticles = Array.from({ length: N }, () => ({
      x: Math.random() * fgW,
      y: Math.random() * fgH,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.4,
      a: Math.random() * 0.7 + 0.3,
      ph: Math.random() * Math.PI * 2,
    }))
  }

  function drawField(
    ctx: CanvasRenderingContext2D | null,
    w: number,
    h: number,
    particles: Particle[],
    opts: DrawFieldOptions,
    t: number
  ) {
    if (!ctx || w === 0 || h === 0) return
    ctx.clearRect(0, 0, w, h)

    const [r, g, b] = ACCENT

    if (opts.linkDist > 0) {
      const linkDist2 = opts.linkDist * opts.linkDist
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const d2 = dx * dx + dy * dy
          if (d2 < linkDist2) {
            const alpha = (1 - Math.sqrt(d2) / opts.linkDist) * opts.linkAlpha
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
      }
    }

    for (const p of particles) {
      if (mouse.active && opts.mouseStrength > 0) {
        const mdx = p.x - mouse.x
        const mdy = p.y - mouse.y
        const md2 = mdx * mdx + mdy * mdy
        if (md2 < 160 * 160) {
          const md = Math.sqrt(md2) || 1
          const force = (1 - md / 160) * opts.mouseStrength
          p.vx += (mdx / md) * force * 0.05
          p.vy += (mdy / md) * force * 0.05
        }
      }

      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.985
      p.vy *= 0.985
      p.vx += (Math.random() - 0.5) * 0.004
      p.vy += (Math.random() - 0.5) * 0.004

      if (p.x < -10) p.x = w + 10
      if (p.x > w + 10) p.x = -10
      if (p.y < -10) p.y = h + 10
      if (p.y > h + 10) p.y = -10

      const tw = Math.sin(t * 0.0008 + p.ph) * 0.3 + 0.7
      const alpha = p.a * tw * opts.alphaScale

      ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.25})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r * opts.glowR, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  let rafId: number
  function loop() {
    const t = performance.now()
    drawField(bgCtx, bgW, bgH, bgParticles, {
      linkDist: 120, linkAlpha: 0.12,
      mouseStrength: 0.5, alphaScale: 0.55, glowR: 3,
    }, t)
    drawField(fgCtx, fgW, fgH, fgParticles, {
      linkDist: 60, linkAlpha: 0.35,
      mouseStrength: 0, alphaScale: 1.0, glowR: 5,
    }, t)
    rafId = requestAnimationFrame(loop)
  }

  const ro = new ResizeObserver(() => { bgResize(); fgResize() })
  ro.observe(bg)
  if (fg) ro.observe(fg)

  bgResize()
  fgResize()
  rafId = requestAnimationFrame(loop)

  return () => {
    cancelAnimationFrame(rafId)
    ro.disconnect()
    bg.removeEventListener('pointermove', onPointerMove)
    bg.removeEventListener('pointerleave', onPointerLeave)
  }
}
