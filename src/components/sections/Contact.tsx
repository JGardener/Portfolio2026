import { ArrowOutIcon } from '../ui/Icons'

const EMAIL = 'jamesgardener92@gmail.com'

// Decorative barcode, derived from the email so it is stable between renders.
const bars = (() => {
  const out: { x: number; w: number }[] = []
  let x = 0
  for (const ch of EMAIL) {
    const c = ch.charCodeAt(0)
    for (let b = 0; b < 3; b++) {
      const w = 1 + ((c >> b) & 1) + ((c >> (b + 3)) & 1)
      out.push({ x, w })
      x += w + 1 + ((c >> (b + 1)) & 1)
    }
  }
  return { out, width: x }
})()

// The publisher strip along the bottom of the box: barcode, contact, small print.
export default function Contact() {
  return (
    <footer id="contact" className="publisher" aria-labelledby="contact-title">
      <div className="publisher__inner">
        <div className="publisher__label" aria-hidden="true">
          <svg viewBox={`0 0 ${bars.width} 40`} preserveAspectRatio="none" className="barcode" focusable="false">
            {bars.out.map((b) => (
              <rect key={b.x} x={b.x} y={0} width={b.w} height={40} />
            ))}
          </svg>
        </div>

        <div className="publisher__main">
          <h2 id="contact-title" className="publisher__title">
            Get in touch
          </h2>
          <a href={`mailto:${EMAIL}`} className="publisher__email">
            {EMAIL}
          </a>
          <ul className="publisher__links">
            <li>
              <a href="https://github.com/JGardener" target="_blank" rel="noopener noreferrer" className="btn">
                GitHub
                <ArrowOutIcon />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/jamesgardener92"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                LinkedIn
                <ArrowOutIcon />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a
                href="https://drive.google.com/file/d/11X5hGT0fusSBq31cH1yG9Znybu5s_Yu9/view?usp=sharing"
                download
                className="btn"
              >
                Download CV (PDF)
              </a>
            </li>
          </ul>
        </div>

        <p className="publisher__small">
          © 2026 James Gardener · Kent, UK · Built with React, TypeScript, PixiJS and GSAP
        </p>
      </div>
    </footer>
  )
}
