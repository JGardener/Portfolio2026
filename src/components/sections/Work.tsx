import type { ComponentType } from 'react'
import { projects } from '../../data/projects'
import type { Project } from '../../types'
import GameThumb from '../ui/GameThumb'
import VISIOThumb from '../ui/VISIOThumb'
import GithubHeatmapThumb from '../ui/GithubHeatmapThumb'
import BloodwebThumb from '../ui/BloodwebThumb'
import { ArrowOutIcon, PlayIcon } from '../ui/Icons'

// Let one-word camel-case names ("GithubDashboard") break between their parts
// instead of mid-word when the display face runs out of room.
function breakable(title: string) {
  const parts = title.split(/(?<=[a-z])(?=[A-Z])/)
  return parts.flatMap((part, i) => (i === 0 ? [part] : [<wbr key={i} />, part]))
}

// Live Pixi "screenshots", one per project, keyed by project id.
const thumbRegistry: Record<string, ComponentType> = {
  'asteroid-blaster': GameThumb,
  'project-2': VISIOThumb,
  'project-3': GithubHeatmapThumb,
  'project-4': BloodwebThumb,
}

// Each back panel is printed in its own colour field.
const tones = ['black', 'blue', 'paper', 'red'] as const

interface WorkProps {
  onPlayGame: () => void
}

function BackPanel({ project, tone, onPlayGame }: { project: Project; tone: string; onPlayGame: () => void }) {
  const Thumb = thumbRegistry[project.id]
  const titleId = `${project.id}-title`
  return (
    <article id={project.id} className={`back back--${tone}`} aria-labelledby={titleId}>
      <div className="back__inner">
        <header className="back__head">
          <h3 id={titleId} className="back__title">
            {breakable(project.title)}
          </h3>
          <p className="back__tagline">{project.tagline}</p>
        </header>

        <figure className="back__shot">
          <div className="shot">{Thumb ? <Thumb /> : null}</div>
          <figcaption className="back__caption">
            {project.hasGame
              ? 'Live PixiJS render. The full game is one click away.'
              : 'Live PixiJS sketch of the project, drawn for this box.'}
          </figcaption>
        </figure>

        <ul className="back__features">
          {project.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>

        <aside className="sysreq" aria-label={`${project.title} system requirements`}>
          <p className="sysreq__head">System requirements</p>
          <dl className="sysreq__list">
            {project.requires.map((r) => (
              <div key={r.label} className="sysreq__row">
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className="back__links">
          {project.hasGame && (
            <button type="button" className="btn btn--primary" onClick={onPlayGame}>
              <PlayIcon />
              Play {project.title}
            </button>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
              Open the live app
              <ArrowOutIcon />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn">
              Source on GitHub
              <ArrowOutIcon />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Work({ onPlayGame }: WorkProps) {
  return (
    <section id="work" aria-labelledby="work-title">
      <h2 id="work-title" className="sr-only">
        Work
      </h2>
      {projects.map((project, i) => (
        <BackPanel key={project.id} project={project} tone={tones[i % tones.length]} onPlayGame={onPlayGame} />
      ))}
    </section>
  )
}
