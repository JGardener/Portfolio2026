import { useEffect, useRef } from 'react'

export default function LensCursor() {
  const lensRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lens = lensRef.current
    if (!lens) return

    let currentX = -200
    let currentY = -200
    let targetX = -200
    let targetY = -200
    let rafId = 0
    const LERP = 0.22
    const EPS = 0.1

    function tick() {
      currentX += (targetX - currentX) * LERP
      currentY += (targetY - currentY) * LERP
      lens!.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`
      if (Math.abs(targetX - currentX) > EPS || Math.abs(targetY - currentY) > EPS) {
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
        lens!.style.width = '140px'
        lens!.style.height = '140px'
      }
    }
    const onLeave = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button')) {
        lens!.style.width = '80px'
        lens!.style.height = '80px'
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
        transition: 'width 200ms var(--ease-out), height 200ms var(--ease-out)',
        transform: 'translate(-200px, -200px) translate(-50%, -50%)',
      }}
    />
  )
}
