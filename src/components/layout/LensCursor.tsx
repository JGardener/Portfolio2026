import { useEffect, useRef } from 'react'

export default function LensCursor() {
  const lensRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lens = lensRef.current
    const dot = dotRef.current
    if (!lens || !dot) return

    let currentX = -200
    let currentY = -200
    let targetX = -200
    let targetY = -200
    let dotX = -200
    let dotY = -200
    let rafId = 0
    const LERP_LENS = 0.22
    const LERP_DOT = 0.60
    const EPS = 0.1

    function tick() {
      currentX += (targetX - currentX) * LERP_LENS
      currentY += (targetY - currentY) * LERP_LENS
      dotX += (targetX - dotX) * LERP_DOT
      dotY += (targetY - dotY) * LERP_DOT

      lens!.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`
      dot!.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`

      const lensSettled = Math.abs(targetX - currentX) <= EPS && Math.abs(targetY - currentY) <= EPS
      const dotSettled = Math.abs(targetX - dotX) <= EPS && Math.abs(targetY - dotY) <= EPS

      if (!lensSettled || !dotSettled) {
        rafId = requestAnimationFrame(tick)
      } else {
        rafId = 0
      }
    }

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!rafId) rafId = requestAnimationFrame(tick)
    }

    const onEnter = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button')) {
        lens!.style.opacity = '0'
        dot!.style.opacity = '1'
      }
    }

    const onLeave = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button')) {
        lens!.style.opacity = '1'
        dot!.style.opacity = '0'
      }
    }

    window.addEventListener('pointermove', onMove)
    document.addEventListener('mouseover', onEnter, true)
    document.addEventListener('mouseout', onLeave, true)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseover', onEnter, true)
      document.removeEventListener('mouseout', onLeave, true)
    }
  }, [])

  return (
    <>
      <div
        ref={lensRef}
        data-cursor-lens
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          backdropFilter: 'invert(1) hue-rotate(180deg) saturate(1.4) brightness(1.1)',
          WebkitBackdropFilter: 'invert(1) hue-rotate(180deg) saturate(1.4) brightness(1.1)',
          border: '1px solid var(--accent)',
          boxShadow: '0 0 12px var(--accent-glow)',
          transition: 'opacity 180ms ease-out',
          transform: 'translate(-200px, -200px) translate(-50%, -50%)',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          backgroundColor: 'var(--accent)',
          boxShadow: '0 0 8px var(--accent), 0 0 20px var(--accent-glow)',
          opacity: 0,
          transition: 'opacity 180ms ease-out',
          transform: 'translate(-200px, -200px) translate(-50%, -50%)',
        }}
      />
    </>
  )
}
