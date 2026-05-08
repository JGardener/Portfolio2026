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

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved) setTheme(saved)
  }, [])

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
        <Work />
        <About />
        <Experience />
        <Contact />
      </main>
    </>
  )
}
