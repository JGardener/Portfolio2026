export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="Hero"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'min(100vh, 920px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <h1 className="sr-only">James Gardener — Developer building interactive things</h1>

      <canvas
        id="hero-canvas"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      <div
        id="hero-svg-wrapper"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />

      {/* Bottom-left anchor */}
      <div style={{ position: 'absolute', bottom: '40px', left: '64px', zIndex: 10 }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-mute)',
            marginBottom: '8px',
          }}
        >
          ↳ 01 · Hello
        </p>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '4px',
          }}
        >
          James Gardener
        </p>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '16px',
            lineHeight: 1.6,
            color: 'var(--text-dim)',
            maxWidth: '320px',
          }}
        >
          Creative frontend developer. React, TypeScript, PixiJS — building interfaces that feel
          alive.
        </p>
      </div>

      {/* Bottom-right meta block */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '64px',
          zIndex: 10,
          textAlign: 'right',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '6px',
            marginBottom: '4px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-dim)',
            }}
          >
            Available · 2026
          </span>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-mute)',
            letterSpacing: '0.06em',
            marginBottom: '8px',
          }}
        >
          Kent, UK · Remote
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <a
            href="https://github.com/you"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
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
              fontSize: '10px',
              color: 'var(--text-mute)',
              textDecoration: 'none',
            }}
          >
            LinkedIn
          </a>
        </div>
      </div>

      {/* Top-center eyebrow pill */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          padding: '4px 12px',
          border: '1px solid var(--line-2)',
          borderRadius: '999px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.08em',
          color: 'var(--text-mute)',
          whiteSpace: 'nowrap',
        }}
      >
        // Portfolio · 2026
      </div>
    </section>
  )
}
