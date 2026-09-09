import { CUSTOMER } from '../data/customer';
import { TITLES } from '../data/screens';
import { useApp } from '../state/AppContext';

export function AppHeader() {
  const { screen, go } = useApp();
  const [title, sub] = TITLES[screen] ?? ['', ''];

  return (
    <div
      style={{
        flex: 'none',
        padding: '2px 20px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
          background: 'linear-gradient(140deg,var(--blue),var(--blued))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 800,
          fontSize: 16,
          boxShadow: 'var(--glowB)',
        }}
      >
        W
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 14.5,
            fontWeight: 800,
            color: 'var(--tx)',
            letterSpacing: '-.01em',
          }}
        >
          {title}
        </h1>
        <div
          style={{
            fontSize: 11.5,
            color: 'var(--tx2)',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {sub}
        </div>
      </div>

      <button
        type="button"
        className="tapglow"
        onClick={() => go('notif')}
        aria-label="Notifikasi, 3 belum dibaca"
        style={{
          position: 'relative',
          width: 36,
          height: 36,
          borderRadius: 11,
          border: '1px solid var(--bd)',
          background: 'var(--card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--sh)',
        }}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--tx)"
          strokeWidth="1.9"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
          <path d="M10.3 20a2 2 0 0 0 3.4 0" />
        </svg>
        <span
          style={{
            position: 'absolute',
            top: 6,
            right: 7,
            width: 8,
            height: 8,
            borderRadius: 99,
            background: 'var(--dang)',
            color: 'var(--dang)',
            animation: 'pulseDot 1.8s infinite',
          }}
        />
      </button>

      <button
        type="button"
        className="tapglow"
        onClick={() => go('profile')}
        aria-label={`Profil ${CUSTOMER.name}`}
        style={{
          width: 36,
          height: 36,
          borderRadius: 99,
          background: 'linear-gradient(140deg,var(--yel),#F59E0B)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 14,
          color: '#3b2a00',
          boxShadow: 'var(--glowY)',
        }}
      >
        {CUSTOMER.initials}
      </button>
    </div>
  );
}
