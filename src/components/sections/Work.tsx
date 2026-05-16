import React, { useEffect, useRef } from 'react'
import type { ComponentType } from 'react'
import { projects } from '../../data/projects'
import GameThumb from '../ui/GameThumb'
import VISIOThumb from '../ui/VISIOThumb'
import { GameUIThumb } from '../ui/ProjectThumb'
import { gsap, ease } from '../../lib/gsap'

const thumbRegistry: Record<string, ComponentType> = {
  'project-2': VISIOThumb,
  'project-3': GameUIThumb,
}


interface WorkProps {
  onPlayGame: () => void
}

export default function Work({ onPlayGame }: WorkProps) {
  const headingRef = useRef<HTMLDivElement>(null)
  const rowsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const headingAnim = gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: ease.draw,
        scrollTrigger: { trigger: headingRef.current, start: 'top 88%' },
      }
    )

    const rows = rowsRef.current?.children
    const rowsAnim = rows
      ? gsap.fromTo(
          Array.from(rows),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: ease.draw,
            scrollTrigger: { trigger: rowsRef.current, start: 'top 85%' },
          }
        )
      : null

    return () => {
      headingAnim.scrollTrigger?.kill()
      rowsAnim?.scrollTrigger?.kill()
    }
  }, [])

  return (
    <section id="work" className="section">
      <div ref={headingRef} style={{ opacity: 0 }}>
        <p className="mono-label" style={{ marginBottom: '24px' }}>// Selected work</p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: 'var(--text)',
            marginBottom: '8px',
          }}
        >
          Things I've built
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            color: 'var(--text-dim)',
            marginBottom: '64px',
          }}
        >
          {projects.length} projects
        </p>
      </div>

      <div ref={rowsRef} style={{ display: 'flex', flexDirection: 'column' }}>
        {projects.map((project, i) => {
          const Thumb = thumbRegistry[project.id]
          return (
          <div
            key={project.id}
            className="work-row"
            style={{
              borderBottom: i === projects.length - 1 ? '1px solid var(--line)' : 'none',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              if (window.innerWidth > 640) el.style.transform = 'translateX(24px)'
              el.style.borderTopColor = 'var(--accent)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.transform = ''
              el.style.borderTopColor = 'var(--line)'
            }}
          >
            <span className="work-row__year mono-label">{project.year}</span>

            <div className="work-row__info">
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(22px, 3.5vw, 32px)',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--text)',
                  marginBottom: '4px',
                }}
              >
                {project.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  lineHeight: 1.55,
                  color: 'var(--text-dim)',
                  marginBottom: '12px',
                }}
              >
                {project.description}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--text-mute)',
                      border: '1px solid var(--line-2)',
                      borderRadius: 'var(--r-sm)',
                      padding: '8px 12px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="work-row__thumb">
              {project.hasGame ? (
                <GameThumb />
              ) : (
                <div
                  style={{
                    width: '200px',
                    height: '120px',
                    backgroundColor: 'var(--bg-2)',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--r-md)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {Thumb ? <Thumb /> : (
                    <span className="mono-label" style={{ fontSize: '10px' }}>thumb</span>
                  )}
                </div>
              )}
            </div>

            <div className="work-row__action" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              {project.hasGame ? (
                <>
                  <button
                    onClick={onPlayGame}
                    className="work-btn"
                    style={{ '--btn-clr': 'var(--accent)' } as React.CSSProperties}
                  >
                    Play
                  </button>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} source code on GitHub (opens in new tab)`}
                      className="work-btn"
                      style={{ '--btn-clr': 'var(--text-mute)' } as React.CSSProperties}
                    >
                      Code
                    </a>
                  )}
                </>
              ) : (
                <>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} live site (opens in new tab)`}
                      className="work-btn"
                      style={{ '--btn-clr': 'var(--accent)' } as React.CSSProperties}
                    >
                      Live
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
                      Code
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
          )
        })}
      </div>
    </section>
  )
}
