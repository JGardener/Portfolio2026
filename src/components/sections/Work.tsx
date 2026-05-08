import { projects } from '../../data/projects'
import GameThumb from '../ui/GameThumb'

interface WorkProps {
  onPlayGame: () => void
}

export default function Work({ onPlayGame }: WorkProps) {
  return (
    <section
      id="work"
      style={{ padding: '128px 64px', maxWidth: '1280px', margin: '0 auto' }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-mute)',
          marginBottom: '24px',
        }}
      >
        // Selected work
      </p>

      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '56px',
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

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {projects.map((project, i) => (
          <div
            key={project.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '64px 1fr 200px 120px',
              gap: '24px',
              alignItems: 'center',
              padding: '24px 0',
              borderTop: '1px solid var(--line)',
              borderBottom: i === projects.length - 1 ? '1px solid var(--line)' : 'none',
              transition: 'padding-left 250ms var(--ease-out), border-color 250ms var(--ease-out)',
              position: 'relative',
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
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-mute)',
              }}
            >
              {project.year}
            </span>

            <div>
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-mute)',
                  }}
                >
                  thumb
                </span>
              </div>
            )}

            <div style={{ textAlign: 'right' }}>
              {project.hasGame ? (
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
              ) : project.githubUrl ? (
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
                  View →
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
