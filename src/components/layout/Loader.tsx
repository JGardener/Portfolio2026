import { useEffect, useRef } from 'react'
import { gsap, ease } from '../../lib/gsap'

interface LoaderProps {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ onComplete })

    tl.fromTo(
      labelRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4, ease: ease.draw }
    )
      .to(labelRef.current, { opacity: 0, duration: 0.3 }, '+=0.7')
      .to(loaderRef.current, { opacity: 0, duration: 0.5, ease: ease.inOut }, '-=0.1')
  }, [onComplete])

  return (
    <div
      ref={loaderRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <p
        ref={labelRef}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          opacity: 0,
        }}
      >
        // Loading
      </p>
    </div>
  )
}
