import { useEffect, useRef } from 'react'
import type { ComponentType } from 'react'
import { projects } from '../../data/projects'
import GameThumb from '../ui/GameThumb'
import { FigmaThumb, GameUIThumb } from '../ui/ProjectThumb'
import { gsap, ease } from '../../lib/gsap'

const thumbRegistry: Record<string, ComponentType> = {
  'project-2': FigmaThumb,
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
              el.style.paddingLeft = '24px'
              el.style.borderTopColor = 'var(--accent)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.paddingLeft = '0'
              el.style.borderTopColor = 'var(--line)'
            }}
          >
            <span className="work-row__year mono-label">{project.year}</span>

            <div className="work-row__info">
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '32px',
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
                      padding: '4px 8px',
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

            <div className="work-row__action" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              {project.hasGame ? (
                <>
                  <button
                    onClick={onPlayGame}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--accent)',
                      cursor: 'none',
                    }}
                  >
                    Play →
                  </button>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 500,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--text-mute)',
                        textDecoration: 'none',
                      }}
                    >
                      Code →
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
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 500,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--accent)',
                        textDecoration: 'none',
                      }}
                    >
                      Live →
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 500,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--text-mute)',
                        textDecoration: 'none',
                      }}
                    >
                      Code →
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
