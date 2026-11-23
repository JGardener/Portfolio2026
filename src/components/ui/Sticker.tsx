import { PlayIcon } from './Icons'

// 18-point starburst, the box-front sale-sticker shape.
const POINTS = 18
const burst = Array.from({ length: POINTS * 2 }, (_, i) => {
  const r = i % 2 === 0 ? 50 : 41
  const a = (i / (POINTS * 2)) * Math.PI * 2 - Math.PI / 2
  return `${(50 + Math.cos(a) * r).toFixed(2)},${(50 + Math.sin(a) * r).toFixed(2)}`
}).join(' ')

interface StickerProps {
  onClick: () => void
  className?: string
}

export default function PlaySticker({ onClick, className = '' }: StickerProps) {
  return (
    <button type="button" className={`sticker ${className}`} onClick={onClick}>
      <svg className="sticker__burst" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <polygon points={burst} />
      </svg>
      <span className="sticker__text">
        <PlayIcon className="sticker__icon" />
        <span className="sticker__big">Play now</span>
        <span className="sticker__small">Asteroid Blaster, in your browser</span>
      </span>
    </button>
  )
}
