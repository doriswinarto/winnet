export function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'absolute',
        left: 18,
        right: 18,
        bottom: 98,
        borderRadius: 16,
        padding: 14,
        background: 'var(--card)',
        border: '1px solid var(--ok)',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        boxShadow: 'var(--glowG)',
        animation: 'toastIn .3s cubic-bezier(.3,1.4,.5,1)',
        zIndex: 10,
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          flex: 'none',
          borderRadius: 99,
          background: 'var(--oks)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ok)',
          fontSize: 14,
          fontWeight: 800,
        }}
      >
        ✓
      </span>
      <span
        style={{
          fontSize: 12.5,
          fontWeight: 700,
          color: 'var(--tx)',
          lineHeight: 1.4,
        }}
      >
        {message}
      </span>
    </div>
  );
}
