const skills = [
  'React',
  'TypeScript',
  'PixiJS',
  'WebGL',
  'Node',
  'Figma',
  'Framer Motion',
  'GSAP',
  'Texture Packer',
  'Tailwind',
]

export default function About() {
  return (
    <section
      id="about"
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
          marginBottom: '48px',
        }}
      >
        // 02 — About
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '96px',
          alignItems: 'start',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '20px',
            lineHeight: 1.5,
            color: 'var(--text-dim)',
          }}
        >
          I'm a creative frontend developer based in Kent, building interactive web experiences
          that sit at the intersection of design and engineering. Three years in iGaming taught
          me how to ship production-grade canvas work under pressure. Now I'm looking for
          mid-level roles where that craft matters.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {skills.map((skill) => (
            <span
              key={skill}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-dim)',
                border: '1px solid var(--line-2)',
                borderRadius: 'var(--r-sm)',
                padding: '8px 12px',
                backgroundColor: 'transparent',
                transition: 'border-color 150ms, color 150ms',
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
