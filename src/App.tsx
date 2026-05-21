import { useState, useEffect, lazy, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import Hero from './components/sections/Hero'
import Work from './components/sections/Work'
import About from './components/sections/About'
import Experience from './components/sections/Experience'
import Contact from './components/sections/Contact'
import LensCursor from './components/layout/LensCursor'
import Navbar from './components/layout/Navbar'
import Loader from './components/layout/Loader'
import type { Theme } from './types'

const GameModal = lazy(() => import('./components/layout/GameModal'))

// Silently resets gameOpen when the GameModal chunk fails to load,
// so the user can try again without refreshing.
function ChunkErrorFallback({ onClose }: { onClose: () => void }) {
  useEffect(() => { onClose() }, [onClose])
  return null
}

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
  const handleCloseGame = () => setGameOpen(false)

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
      {gameOpen && (
        <ErrorBoundary fallback={<ChunkErrorFallback onClose={handleCloseGame} />}>
          <Suspense fallback={null}>
            <GameModal onClose={handleCloseGame} />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  )
}
