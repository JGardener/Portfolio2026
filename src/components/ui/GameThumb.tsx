export default function GameThumb() {
  return (
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
        overflow: 'hidden',
        position: 'relative',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 120"
        width="200"
        height="120"
        style={{ position: 'absolute', inset: 0 }}
      >
        <circle cx="100" cy="60" r="18" stroke="var(--accent)" strokeOpacity="0.25" strokeWidth="1" fill="none" />
        <circle cx="100" cy="60" r="10" stroke="var(--accent)" strokeOpacity="0.45" strokeWidth="1" fill="none" />
        <circle cx="100" cy="60" r="3" fill="var(--accent)" fillOpacity="0.7" />
        <circle cx="60" cy="35" r="1.5" fill="var(--accent)" fillOpacity="0.35" />
        <circle cx="148" cy="42" r="1" fill="var(--accent)" fillOpacity="0.3" />
        <circle cx="38" cy="82" r="1" fill="var(--accent)" fillOpacity="0.4" />
        <circle cx="162" cy="88" r="1.5" fill="var(--accent)" fillOpacity="0.3" />
        <circle cx="128" cy="22" r="1" fill="var(--accent)" fillOpacity="0.35" />
        <circle cx="72" cy="95" r="1.5" fill="var(--accent)" fillOpacity="0.25" />
        <circle cx="170" cy="55" r="1" fill="var(--accent)" fillOpacity="0.3" />
      </svg>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--text-mute)',
          letterSpacing: '0.06em',
          position: 'relative',
          zIndex: 1,
        }}
      >
        // playable
      </span>
    </div>
  )
}
