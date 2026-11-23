import type { Theme } from '../../types'
import { MoonIcon, SunIcon } from '../ui/Icons'

interface SpineProps {
  theme: Theme
  onThemeToggle: () => void
}

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

// The box spine: the edge you hold. Fixed down the left on desktop,
// across the top on phones. It is also the hinge the cover turns on.
export default function Spine({ theme, onThemeToggle }: SpineProps) {
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <nav className="spine" aria-label="Main">
      <a href="#top" className="spine__mark" aria-label="James Gardener, back to the cover">
        JG
      </a>
      <ul className="spine__links">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="spine__link">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="spine__theme"
        onClick={onThemeToggle}
        aria-label={`Switch to the ${next === 'light' ? 'white' : 'black'} box (${next} theme)`}
        title={`${next === 'light' ? 'Light' : 'Dark'} theme`}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    </nav>
  )
}
