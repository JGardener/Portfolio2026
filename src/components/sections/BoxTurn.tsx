import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap'
import { projects } from '../../data/projects'
import CoverArt from '../ui/CoverArt'
import PlaySticker from '../ui/Sticker'
import { ArrowDownIcon } from '../ui/Icons'

interface BoxTurnProps {
  onPlayGame: () => void
}

// How far the fixed spine pushes content down (phones: it runs across the top).
function spineTopOffset(): number {
  const spine = document.querySelector('.spine')
  if (!spine) return 0
  const r = spine.getBoundingClientRect()
  return r.width > r.height ? r.height : 0
}

// The signature moment: the box front is hinged on the spine. Scrolling
// swings it open (rotateY around its left edge) to reveal the back cover,
// which sits beneath it in the same pinned frame. Reduced motion: no pin,
// the front and back simply stack.
export default function BoxTurn({ onPlayGame }: BoxTurnProps) {
  const turnRef = useRef<HTMLDivElement>(null)
  const frontRef = useRef<HTMLElement>(null)
  const shadeRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    const turn = turnRef.current
    const front = frontRef.current
    const shade = shadeRef.current
    const back = backRef.current
    if (!turn || !front || !shade || !back || prefersReducedMotion()) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      turn.classList.add('turn--live')
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: turn,
          start: () => `top top+=${spineTopOffset()}`,
          end: '+=90%',
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      })
      tl.fromTo(front, { rotateY: 0 }, { rotateY: 100, ease: 'power2.in', duration: 1 }, 0)
        .fromTo(shade, { opacity: 0 }, { opacity: 0.75, ease: 'power1.in', duration: 1 }, 0)
        .fromTo(back, { scale: 0.95 }, { scale: 1, ease: 'power2.out', duration: 1 }, 0)
        .set(front, { visibility: 'hidden' }, 1)
      triggerRef.current = tl.scrollTrigger ?? null

      // Idle at the top: the front lifts on its hinge, twice, to show it opens.
      const hint = window.setTimeout(() => {
        if (window.scrollY < 8) turn.classList.add('turn--hint')
      }, 2200)
      const stopHint = () => turn.classList.remove('turn--hint')
      window.addEventListener('scroll', stopHint, { once: true, passive: true })

      return () => {
        window.clearTimeout(hint)
        window.removeEventListener('scroll', stopHint)
        turn.classList.remove('turn--hint')
        triggerRef.current = null
        tl.scrollTrigger?.kill()
        tl.kill()
        gsap.set([front, shade, back], { clearProps: 'all' })
        turn.classList.remove('turn--live')
      }
    })

    return () => mm.revert()
  }, [])

  // Turn it over: glide to the end of the turn (or straight to the back
  // cover when there is no pinned turn), then hand focus to the back cover.
  const turnOver = () => {
    const back = backRef.current
    if (!back) return
    const st = triggerRef.current
    const top = st ? st.end : back.getBoundingClientRect().top + window.scrollY - spineTopOffset()
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    back.querySelector<HTMLElement>('#inside-title')?.focus({ preventScroll: true })
  }

  return (
    <div ref={turnRef} className="turn">
      <header ref={frontRef} id="top" className="front">
        <div className="front__band">
          <h1 className="front__title">
            <span>James</span> <span>Gardener</span>
          </h1>
          <p className="front__sub">Frontend developer — React, TypeScript, PixiJS</p>
          <p className="front__side">Making games on the side.</p>
        </div>

        <div className="front__art">
          <CoverArt />
          <PlaySticker onClick={onPlayGame} className="front__sticker" />
          <p className="front__credit">Cover art: Asteroid Blaster, running live</p>
        </div>

        <div className="front__foot">
          <p className="front__inside">
            <span className="front__inside-label">Inside</span>
            {projects.map((p) => p.title).join(' · ')}
          </p>
          <button type="button" className="front__turn" onClick={turnOver}>
            <span className="front__turn-label">Turn it over</span>
            <span className="front__turn-hint">or scroll</span>
            <ArrowDownIcon className="front__turn-arrow" />
          </button>
        </div>
        <div ref={shadeRef} className="front__shade" aria-hidden="true" />
      </header>

      <section ref={backRef} id="inside" className="backcover" aria-labelledby="inside-title">
        <div className="backcover__inner">
          <h2 id="inside-title" className="backcover__title" tabIndex={-1}>
            I build interfaces for games and for products.
          </h2>
          <div className="backcover__copy">
            <p>
              For 3+ years at Incentive Games I shipped React, TypeScript and PixiJS front ends
              for live iGaming products. On my own time I build full-stack apps: Supabase auth,
              Postgres with row-level security, Deno edge functions, the Claude API and typed REST
              clients, with Vitest and Sentry behind them.
            </p>
            <p>Based in Kent, UK. Available now.</p>
          </div>
          <div className="backcover__contents">
            <h3 className="backcover__contents-title">In this box</h3>
            <ol className="contents">
              {projects.map((p) => (
                <li key={p.id}>
                  <a href={`#${p.id}`} className="contents__link">
                    <span className="contents__name">{p.title}</span>
                    <span className="contents__line">{p.tagline}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  )
}
