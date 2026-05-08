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
    let rafId: number
    const LERP = 0.22

    function tick() {
      currentX += (targetX - currentX) * LERP
      currentY += (targetY - currentY) * LERP
      lens!.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const onEnter = () => {
      lens!.style.width = '140px'
      lens!.style.height = '140px'
    }
    const onLeave = () => {
      lens!.style.width = '80px'
      lens!.style.height = '80px'
    }

    window.addEventListener('pointermove', onMove)

    const hoverEls = document.querySelectorAll('a, button')
    hoverEls.forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onMove)
      hoverEls.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
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
