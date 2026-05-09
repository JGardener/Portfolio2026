import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap, ease } from '../../lib/gsap'

interface GameModalProps {
  onClose: () => void
}

export default function GameModal({ onClose }: GameModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: ease.inOut }
    ).fromTo(
      panelRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.4, ease: ease.draw },
      '-=0.1'
    )
    return () => { tl.kill() }
  }, [])

  const handleClose = useCallback(() => {
    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(panelRef.current, { opacity: 0, y: 24, duration: 0.25, ease: ease.inOut }).to(
      backdropRef.current,
      { opacity: 0, duration: 0.2, ease: ease.inOut },
      '-=0.1'
    )
  }, [onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleClose])

  return createPortal(
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label="Asteroid Blaster"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div
        ref={panelRef}
        style={{
          backgroundColor: 'var(--bg-1)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-lg)',
          width: 'min(960px, 90vw)',
          height: 'min(640px, 85vh)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          opacity: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid var(--line)',
            flexShrink: 0,
          }}
        >
          <span className="mono-label">// Asteroid Blaster</span>
          <button
            onClick={handleClose}
            aria-label="Close game"
            className="mono-btn"
            style={{ padding: '4px 10px' }}
          >
            Esc ×
          </button>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-mute)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            // PixiJS canvas mounts here — game build phases
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}
