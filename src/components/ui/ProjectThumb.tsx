export function FigmaThumb() {
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="200" height="120">
      {[0, 1, 2, 3].map((col) =>
        [0, 1, 2].map((row) => (
          <rect
            key={`${col}-${row}`}
            x={30 + col * 40}
            y={20 + row * 30}
            width={30}
            height={20}
            rx="2"
            stroke="var(--line-2)"
            strokeWidth="1"
            fill={col === 1 && row === 1 ? 'var(--accent-faint)' : 'none'}
          />
        )),
      )}
    </svg>
  )
}

export function GameUIThumb() {
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="200" height="120">
      <rect x="20" y="50" width="160" height="4" rx="2" fill="var(--line-2)" />
      <rect x="20" y="50" width="110" height="4" rx="2" fill="var(--accent)" fillOpacity="0.6" />
      <rect x="20" y="62" width="160" height="4" rx="2" fill="var(--line-2)" />
      <rect x="20" y="62" width="60" height="4" rx="2" fill="var(--accent)" fillOpacity="0.35" />
      <rect x="20" y="30" width="40" height="12" rx="2" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="1" />
      <rect x="140" y="30" width="40" height="12" rx="2" stroke="var(--line-2)" strokeWidth="1" />
    </svg>
  )
}
