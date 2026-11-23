import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { projects } from '../../data/projects'
import { mockMatchMedia } from '../../test/matchMedia'
import Work from './Work'

// The real thumbnails are live PixiJS scenes (WebGL) — swap each for a marker
// so we can assert which thumb a project row resolves to.
vi.mock('../ui/GameThumb', () => ({ default: () => <div data-testid="thumb-game" /> }))
vi.mock('../ui/VISIOThumb', () => ({ default: () => <div data-testid="thumb-visio" /> }))
vi.mock('../ui/GithubHeatmapThumb', () => ({ default: () => <div data-testid="thumb-github" /> }))
vi.mock('../ui/BloodwebThumb', () => ({ default: () => <div data-testid="thumb-bloodweb" /> }))

const rows = () => screen.getAllByRole('article')

describe('<Work />', () => {
  it('renders one showcase row per project, in data order', () => {
    render(<Work onPlayGame={() => {}} />)
    expect(rows()).toHaveLength(projects.length)
    rows().forEach((row, i) => {
      expect(within(row).getByRole('heading', { level: 3 })).toHaveTextContent(projects[i].title)
    })
  })

  it('gives every project a thumbnail (game thumb or a thumbRegistry entry)', () => {
    render(<Work onPlayGame={() => {}} />)
    rows().forEach((row, i) => {
      expect(within(row).queryAllByTestId(/^thumb-/), projects[i].id).toHaveLength(1)
    })
  })

  it('wires the Play button on the game project to onPlayGame', () => {
    const onPlayGame = vi.fn()
    render(<Work onPlayGame={onPlayGame} />)
    const playButtons = screen.getAllByRole('button', { name: /play it/i })
    expect(playButtons).toHaveLength(projects.filter((p) => p.hasGame).length)
    fireEvent.click(playButtons[0])
    expect(onPlayGame).toHaveBeenCalledOnce()
  })

  it('opens every external link in a new tab with rel="noopener noreferrer"', () => {
    render(<Work onPlayGame={() => {}} />)
    const links = screen.getAllByRole('link')
    const expected = projects.reduce((n, p) => n + Number(!!p.liveUrl) + Number(!!p.githubUrl), 0)
    expect(links).toHaveLength(expected)
    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link).toHaveAccessibleName(/opens in new tab/)
    }
  })

  it('shows rows immediately (no hidden fade-in state) under prefers-reduced-motion', () => {
    mockMatchMedia((q) => q === '(prefers-reduced-motion: reduce)')
    render(<Work onPlayGame={() => {}} />)
    for (const row of rows()) {
      expect(row.style.opacity).toBe('1')
    }
  })
})
