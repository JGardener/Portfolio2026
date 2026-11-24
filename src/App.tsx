import { useState, useEffect, lazy, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import Spine from './components/layout/Spine'
import BoxTurn from './components/sections/BoxTurn'
import Work from './components/sections/Work'
import Credits from './components/sections/Credits'
import Contact from './components/sections/Contact'
import type { Theme } from './types'

const GameModal = lazy(() => import('./components/layout/GameModal'))

// Dismisses the modal on chunk load failure — prevents a white-screen
// and lets the user re-open without a full page refresh.
function ChunkErrorFallback({ onClose }: { onClose: () => void }) {
  useEffect(() => { onClose() }, [onClose])
  return null
}

// index.html applies the saved edition before first paint; start from it.
function readTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

export default function App() {
  const [gameOpen, setGameOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(readTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* storage blocked: theme still applies for this visit */
    }
  }, [theme])

  // Deep links (#contact etc.): the content renders after the browser has
  // already tried to jump, so honour the hash once on mount.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  const openGame = () => setGameOpen(true)
  const handleCloseGame = () => setGameOpen(false)

  return (
    <>
      <a href="#work" className="skip-link">
        Skip to work
      </a>
      <Spine theme={theme} onThemeToggle={toggleTheme} />
      <div className="box">
        <main>
          <BoxTurn onPlayGame={openGame} />
          <Work onPlayGame={openGame} />
          <Credits />
        </main>
        <Contact />
      </div>
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
