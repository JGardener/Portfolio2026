import React, { useEffect, useRef } from 'react'
import type { ComponentType } from 'react'
import { projects } from '../../data/projects'
import GameThumb from '../ui/GameThumb'
import VISIOThumb from '../ui/VISIOThumb'
import GithubHeatmapThumb from '../ui/GithubHeatmapThumb'
import BloodwebThumb from '../ui/BloodwebThumb'
import SectionHeading from '../ui/SectionHeading'
import { gsap, ease, prefersReducedMotion } from '../../lib/gsap'

const thumbRegistry: Record<string, ComponentType> = {
  'project-2': VISIOThumb,
  'project-3': GithubHeatmapThumb,
  'project-4': BloodwebThumb,
}

interface WorkProps {
  onPlayGame: () => void
}

export default function Work({ onPlayGame }: WorkProps) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const cards = gsap.utils.toArray<HTMLElement>('.showcase', list)

    if (prefersReducedMotion()) {
      gsap.set(cards, { opacity: 1, y: 0 })
      return
    }

    const anims: gsap.core.Tween[] = []
    for (const card of cards) {
      anims.push(
        gsap.fromTo(
          card,
          { opacity: 0, y: 70 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: ease.draw,
            scrollTrigger: { trigger: card, start: 'top 85%' },
          }
        )
      )
      const thumb = card.querySelector<HTMLElement>('.showcase__thumb')
      if (thumb) {
        anims.push(
          gsap.fromTo(
            thumb,
            { yPercent: 8 },
            {
              yPercent: -8,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          )
        )
      }
    }

    return () => {
      for (const anim of anims) {
        anim.scrollTrigger?.kill()
        anim.kill()
      }
    }
  }, [])

  return (
    <section id="work" className="section">
      <SectionHeading
        index="01"
        label="Selected work"
        title="Things I've built"
        sub={`${projects.length} projects — built to learn, shipped to last`}
      />

      <div ref={listRef} className="showcase-list">
        {projects.map((project, i) => {
          const Thumb = thumbRegistry[project.id]
          return (
            <article key={project.id} className="showcase" style={{ opacity: 0 }}>
              <div className="showcase__panel">
                <span className="showcase__index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="showcase__thumb">
                  <div className="showcase__thumb-inner">
                    {project.hasGame ? <GameThumb /> : Thumb ? <Thumb /> : null}
                  </div>
                </div>
              </div>

              <div className="showcase__info">
                <p className="mono-label" style={{ marginBottom: '12px' }}>
                  {project.year}
                  {project.hasGame && (
                    <span style={{ color: 'var(--accent)', marginLeft: '12px' }}>· Playable</span>
                  )}
                </p>
                <h3 className="showcase__title">{project.title}</h3>
                <p className="showcase__desc">{project.description}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {project.hasGame && (
                    <button
                      onClick={onPlayGame}
                      className="work-btn"
                      style={{ '--btn-clr': 'var(--accent)' } as React.CSSProperties}
                    >
                      ▶ Play it
                    </button>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} live site (opens in new tab)`}
                      className="work-btn"
                      style={{ '--btn-clr': 'var(--accent)' } as React.CSSProperties}
                    >
                      Live ↗
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} source code on GitHub (opens in new tab)`}
                      className="work-btn"
                      style={{ '--btn-clr': 'var(--text-mute)' } as React.CSSProperties}
                    >
                      Code ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
