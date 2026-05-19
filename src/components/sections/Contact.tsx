import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function Contact() {
  const ref = useScrollReveal({ y: 20, duration: 1.0, delay: 0.1 })

  return (
    <section
      ref={ref}
      id="contact"
      className="section"
      style={{
        textAlign: 'center',
        position: 'relative',
        opacity: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(600px, 100%)',
          height: 'min(400px, 60vw)',
          background: 'radial-gradient(ellipse, var(--accent-faint) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <p className="mono-label" style={{ marginBottom: '24px' }}>
          // 05 — Let's talk
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: 'var(--text)',
            marginBottom: '32px',
          }}
        >
          Let's build something.
        </h2>

        <a
          href="mailto:jamesgardener92@gmail.com"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(16px, 3vw, 24px)',
            fontWeight: 600,
            color: 'var(--text-dim)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--line-2)',
            paddingBottom: '2px',
            transition: 'color 200ms, border-color 200ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent)'
            e.currentTarget.style.borderColor = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-dim)'
            e.currentTarget.style.borderColor = 'var(--line-2)'
          }}
          onFocus={(e) => {
            e.currentTarget.style.color = 'var(--accent)'
            e.currentTarget.style.borderColor = 'var(--accent)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.color = 'var(--text-dim)'
            e.currentTarget.style.borderColor = 'var(--line-2)'
          }}
        >
          jamesgardener92@gmail.com
        </a>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            marginTop: '48px',
          }}
        >
          <a
            href="https://github.com/JGardener"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub (opens in new tab)"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-mute)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              padding: '0 4px',
            }}
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/jamesgardener92"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn (opens in new tab)"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-mute)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              padding: '0 4px',
            }}
          >
            LinkedIn
          </a>
          <a
            href="https://drive.google.com/file/d/1X2KfiL4Hp0XXyXDK2qjnbuOmN7j71oxR/view?usp=sharing"
            download
            aria-label="Download CV (PDF)"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-mute)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              padding: '0 4px',
            }}
          >
            Download CV
          </a>
        </div>
      </div>
    </section>
  )
}
