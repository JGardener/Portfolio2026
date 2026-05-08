export default function HeroSVG() {
  return (
    <svg
      viewBox="0 0 1600 800"
      aria-hidden="true"
      style={{
        width: 'min(96vw, 1640px)',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        overflow: 'visible',
      }}
    >
      <defs>
        {/*
          clipPath defines the JG letterforms.
          The <canvas> inside foreignObject is masked to these shapes —
          only particles inside the letters are visible.
        */}
        <clipPath id="letter-clip">
          <text
            x="800"
            y="520"
            textAnchor="middle"
            fontFamily="Syne, sans-serif"
            fontSize="420"
            fontWeight="700"
            letterSpacing="-15"
          >
            JG
          </text>
        </clipPath>
      </defs>

      {/* Ghost fill — subtle visible form behind the particles */}
      <text
        x="800"
        y="520"
        textAnchor="middle"
        fontFamily="Syne, sans-serif"
        fontSize="420"
        fontWeight="700"
        letterSpacing="-15"
        fill="var(--text)"
        fillOpacity="0.14"
      >
        JG
      </text>

      {/*
        foreignObject contains the letter canvas.
        clipPath clips its rendering to the JG shapes.
        Size matches the full SVG viewBox so particles can be anywhere inside.
      */}
      <foreignObject x="0" y="0" width="1600" height="800" clipPath="url(#letter-clip)">
        <canvas
          id="hero-letter-canvas"
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </foreignObject>
    </svg>
  )
}
