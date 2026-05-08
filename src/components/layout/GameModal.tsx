interface GameModalProps {
  onClose: () => void
}

export default function GameModal({ onClose }: GameModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Asteroid Blaster"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-1)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-lg)',
          padding: '48px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close game"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-mute)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Esc ×
        </button>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-mute)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          // Game coming in a later phase
        </p>
      </div>
    </div>
  )
}
