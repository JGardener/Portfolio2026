export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        padding: '120px 64px',
        maxWidth: '1280px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, var(--accent-faint) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
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
          // 05 — Let's talk
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '56px',
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
          href="mailto:james@youremail.com"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
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
        >
          james@youremail.com
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
            href="https://github.com/you"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-mute)',
              textDecoration: 'none',
            }}
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/you"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-mute)',
              textDecoration: 'none',
            }}
          >
            LinkedIn
          </a>
          <a
            href="/cv.pdf"
            download
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-mute)',
              textDecoration: 'none',
            }}
          >
            Download CV
          </a>
        </div>
      </div>
    </section>
  )
}
