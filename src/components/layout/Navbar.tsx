import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { gsap, ease } from '../../lib/gsap'
import type { Theme } from '../../types'

interface NavbarProps {
  theme: Theme
  onThemeToggle: () => void
}

const links = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
]

function MobileMenu({
  onClose,
  theme,
  onThemeToggle,
}: {
  onClose: () => void
  theme: Theme
  onThemeToggle: () => void
}) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: ease.inOut })
      .fromTo(panelRef.current, { x: '100%' }, { x: '0%', duration: 0.35, ease: ease.draw }, '-=0.15')
    return () => { tl.kill() }
  }, [])

  const handleClose = useCallback(() => {
    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(panelRef.current, { x: '100%', duration: 0.3, ease: ease.inOut })
      .to(backdropRef.current, { opacity: 0, duration: 0.2, ease: ease.inOut }, '-=0.15')
  }, [onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleClose])

  return createPortal(
    <div
      ref={backdropRef}
      className="mobile-menu-backdrop"
      onClick={handleClose}
    >
      <div
        ref={panelRef}
        className="mobile-menu-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleClose}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(24px, 4vw, 32px)',
                fontWeight: 500,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--text-dim)',
                textDecoration: 'none',
                transition: 'color 150ms var(--ease-out)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 'auto' }}>
          <a
            href="#contact"
            onClick={handleClose}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            Get in touch →
          </a>
          <button
            onClick={() => { onThemeToggle(); handleClose() }}
            aria-label="Toggle theme"
            style={{
              background: 'none',
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--r-md)',
              padding: '8px 12px',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              alignSelf: 'flex-start',
            }}
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function Navbar({ theme, onThemeToggle }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: scrolled ? '16px' : '0',
          left: scrolled ? '24px' : '0',
          right: scrolled ? '24px' : '0',
          zIndex: 50,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: scrolled ? '12px' : '0',
          backgroundColor: scrolled ? 'var(--bg-glass)' : 'transparent',
          backdropFilter: scrolled ? 'blur(18px)' : 'none',
          border: scrolled ? '1px solid var(--line)' : 'none',
          transition: 'top 250ms var(--ease-out), left 250ms var(--ease-out), right 250ms var(--ease-out), border-radius 250ms var(--ease-out), background-color 250ms var(--ease-out), backdrop-filter 250ms var(--ease-out), border-color 250ms var(--ease-out)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '18px',
            color: 'var(--accent)',
            letterSpacing: '-0.01em',
          }}
        >
          ⬢ JG
        </span>

        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="link-draw"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-dim)',
                  textDecoration: 'none',
                  transition: 'color 150ms var(--ease-out)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                onFocus={(e) => (e.currentTarget.style.color = 'var(--text)')}
                onBlur={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onThemeToggle}
            aria-label="Toggle theme"
            style={{
              background: 'none',
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--r-md)',
              padding: '6px 10px',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              transition: 'border-color 150ms, color 150ms',
            }}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <a
            href="#contact"
            className="nav-cta"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            Get in touch
          </a>
          <button
            className="hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect y="4" width="20" height="1.5" rx="0.75" fill="currentColor" />
              <rect y="9.25" width="20" height="1.5" rx="0.75" fill="currentColor" />
              <rect y="14.5" width="20" height="1.5" rx="0.75" fill="currentColor" />
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <MobileMenu
          onClose={() => setMenuOpen(false)}
          theme={theme}
          onThemeToggle={onThemeToggle}
        />
      )}
    </>
  )
}
