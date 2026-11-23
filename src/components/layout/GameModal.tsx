import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { gsap, ease, prefersReducedMotion } from '../../lib/gsap'
import AsteroidBlaster from 'asteroid-blaster'
import { CloseIcon } from '../ui/Icons'

interface GameModalProps {
  onClose: () => void
}

function GameErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="game-modal__error">
      <p>The game didn’t load. Close this and try again.</p>
      <button type="button" onClick={resetErrorBoundary} className="btn btn--primary">
        Close
      </button>
    </div>
  )
}

export default function GameModal({ onClose }: GameModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set([backdropRef.current, panelRef.current], { opacity: 1, y: 0 })
      return
    }
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
    if (prefersReducedMotion()) {
      onClose()
      return
    }
    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(panelRef.current, { opacity: 0, y: 24, duration: 0.25, ease: ease.inOut }).to(
      backdropRef.current,
      { opacity: 0, duration: 0.2, ease: ease.inOut },
      '-=0.1'
    )
  }, [onClose])

  useEffect(() => {
    closeButtonRef.current?.focus()

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])'
        )
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [handleClose])

  return createPortal(
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-modal-title"
      className="game-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div ref={panelRef} className="game-modal__panel">
        <div className="game-modal__bar">
          <p id="game-modal-title" className="game-modal__title">
            Asteroid Blaster
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Close the game"
            className="game-modal__close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="game-modal__screen">
          <ErrorBoundary FallbackComponent={GameErrorFallback} onReset={handleClose}>
            {/* onError prop available for future Sentry integration */}
            <AsteroidBlaster onClose={handleClose} />
          </ErrorBoundary>
        </div>
      </div>
    </div>,
    document.body
  )
}
