import type { Theme } from '../../types'

interface NavbarProps {
  theme: Theme
  onThemeToggle: () => void
}

export default function Navbar({ theme: _theme, onThemeToggle: _onThemeToggle }: NavbarProps) {
  return <div />
}
