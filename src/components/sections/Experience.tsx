import { experiences } from '../../data/experience'

export default function Experience() {
  return (
    <section
      id="experience"
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
          marginBottom: '64px',
        }}
      >
        // 03 — Experience
      </p>

      <div style={{ position: 'relative', paddingLeft: '48px' }}>
        <div
          style={{
            position: 'absolute',
            left: '32px',
            top: 0,
            bottom: 0,
            width: '1px',
            backgroundColor: 'var(--accent)',
            opacity: 0.4,
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {experiences.map((exp) => (
            <div key={exp.id}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-mute)',
                  marginBottom: '4px',
                }}
              >
                {exp.period}
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '24px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--text)',
                  marginBottom: '2px',
                }}
              >
                {exp.role}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  color: 'var(--accent)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}
              >
                {exp.company}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  lineHeight: 1.55,
                  color: 'var(--text-dim)',
                }}
              >
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
