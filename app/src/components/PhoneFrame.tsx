import type { ReactNode } from 'react';

function StatusBar() {
  return (
    <div
      style={{
        height: 52,
        flex: 'none',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: '0 26px 6px',
        fontSize: 12.5,
        fontWeight: 700,
        color: 'var(--tx)',
      }}
    >
      <span>09:41</span>
      <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <span
          style={{
            width: 16,
            height: 9,
            border: '1.5px solid var(--tx)',
            borderRadius: 2,
            display: 'inline-block',
            opacity: 0.7,
          }}
        />
        <span
          style={{
            width: 15,
            height: 9,
            background: 'var(--tx)',
            borderRadius: 2,
            opacity: 0.7,
            display: 'inline-block',
          }}
        />
      </span>
    </div>
  );
}

/** Device bezel, notch and status bar. Collapses to fullscreen on mobile. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="bezel">
      <div className="screen">
        <StatusBar />
        <div className="notch" />
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
