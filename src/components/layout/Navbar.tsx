import { useState, useEffect } from 'react'
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

export default function Navbar({ theme, onThemeToggle }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
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
        backgroundColor: scrolled ? 'rgba(10,10,15,0.7)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        border: scrolled ? '1px solid var(--line)' : 'none',
        transition: 'all 250ms var(--ease-out)',
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

      <ul style={{ display: 'flex', gap: '32px', listStyle: 'none' }}>
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
      </div>
    </nav>
  )
}
