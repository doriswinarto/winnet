import type { ReactNode } from 'react';
import { useApp } from '../state/AppContext';
import type { ScreenId } from '../types';

const ICON_PROPS = {
  width: 21,
  height: 21,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
} as const;

const NAV: { id: ScreenId; label: string; icon: ReactNode }[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <svg {...ICON_PROPS} strokeLinejoin="round" aria-hidden>
        <path d="M3.5 10 12 3.5 20.5 10v9.5a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z" />
        <path d="M9.5 20.5V14h5v6.5" />
      </svg>
    ),
  },
  {
    id: 'usage',
    label: 'Pemakaian',
    icon: (
      <svg {...ICON_PROPS} aria-hidden>
        <path d="M4 20V12" />
        <path d="M10 20V5" />
        <path d="M16 20v-6" />
        <path d="M22 20V9" />
      </svg>
    ),
  },
  {
    id: 'billing',
    label: 'Tagihan',
    icon: (
      <svg {...ICON_PROPS} aria-hidden>
        <rect x="2.5" y="5" width="19" height="14" rx="3" />
        <path d="M2.5 10h19" />
      </svg>
    ),
  },
  {
    id: 'tickets',
    label: 'Tiket',
    icon: (
      <svg {...ICON_PROPS} aria-hidden>
        <rect x="2.5" y="4.5" width="19" height="13" rx="3" />
        <path d="M7 21.5 11 17.5" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profil',
    icon: (
      <svg {...ICON_PROPS} aria-hidden>
        <circle cx="12" cy="8.5" r="4" />
        <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const { screen, go, theme } = useApp();
  const activeGlow =
    theme === 'neon' ? '0 0 8px var(--blue)' : '0 2px 5px rgba(11,94,215,.4)';

  return (
    <nav
      className="app-nav"
      style={{
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '9px 8px 16px',
        background: 'var(--card)',
        borderTop: '1px solid var(--bd)',
        boxShadow: 'var(--navsh)',
      }}
    >
      {NAV.map((item) => {
        const active = screen === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className="tapglow"
            onClick={() => go(item.id)}
            aria-current={active ? 'page' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              width: 62,
              color: active ? 'var(--blue)' : 'var(--tx2)',
            }}
          >
            <span
              style={{
                display: 'flex',
                filter: active ? `drop-shadow(${activeGlow})` : undefined,
              }}
            >
              {item.icon}
            </span>
            <span style={{ fontSize: 10, fontWeight: 700 }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
