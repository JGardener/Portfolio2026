import { useState, useEffect } from 'react'
import Hero from './components/sections/Hero'
import Work from './components/sections/Work'
import About from './components/sections/About'
import Experience from './components/sections/Experience'
import Contact from './components/sections/Contact'
import LensCursor from './components/layout/LensCursor'
import Navbar from './components/layout/Navbar'
import Loader from './components/layout/Loader'
import type { Theme } from './types'
import GameModal from './components/layout/GameModal'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [gameOpen, setGameOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme | null) ?? 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <LensCursor />
      <Navbar theme={theme} onThemeToggle={toggleTheme} />
      <main>
        <Hero />
        <Work onPlayGame={() => setGameOpen(true)} />
        <About />
        <Experience />
        <Contact />
      </main>
      {gameOpen && <GameModal onClose={() => setGameOpen(false)} />}
    </>
  )
}
