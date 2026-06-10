import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

interface LoaderProps {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLParagraphElement>(null)
  const countRef = useRef<HTMLParagraphElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) {
      const tl = gsap.timeline({ onComplete })
      tl.to(panelRef.current, { opacity: 0, duration: 0.3, delay: 0.2 })
      return () => { tl.kill() }
    }

    const progress = { v: 0 }
    const tl = gsap.timeline({ onComplete })

    tl.fromTo(
      [markRef.current, countRef.current],
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power3.out' }
    )
      .to(
        progress,
        {
          v: 100,
          duration: 1.3,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (countRef.current) {
              countRef.current.textContent = String(Math.round(progress.v)).padStart(3, '0')
            }
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${progress.v / 100})`
            }
          },
        },
        '<0.1'
      )
      .to(
        [markRef.current, countRef.current, barRef.current],
        { opacity: 0, duration: 0.3, ease: 'power2.in' },
        '+=0.15'
      )
      .to(
        panelRef.current,
        { yPercent: -100, duration: 0.7, ease: 'power4.inOut' },
        '-=0.1'
      )

    return () => { tl.kill() }
  }, [onComplete])

  return (
    <div
      ref={panelRef}
      aria-live="polite"
      aria-label="Loading"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
      }}
    >
      <p
        ref={markRef}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: 'var(--text)',
          lineHeight: 1,
          opacity: 0,
        }}
      >
        JG
      </p>

      <div
        aria-hidden="true"
        style={{
          width: 'min(220px, 50vw)',
          height: '1px',
          backgroundColor: 'var(--line-2)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          ref={barRef}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'var(--accent)',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
          }}
        />
      </div>

      <p
        ref={countRef}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.12em',
          color: 'var(--text-mute)',
          opacity: 0,
        }}
      >
        000
      </p>
    </div>
  )
}
