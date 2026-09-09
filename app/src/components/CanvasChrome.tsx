import { useApp } from '../state/AppContext';

/**
 * Desktop-only chrome around the phone: brand mark plus the Light / Neon Glow
 * theme pills. Hidden on a phone-sized viewport, where the app fills the
 * screen and the theme is switched from Profil → Mode Neon instead.
 */
export function CanvasChrome() {
  const { theme, setTheme } = useApp();
  const neon = theme === 'neon';

  return (
    <div className="canvas-chrome">
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: 'linear-gradient(140deg,var(--blue),var(--blued))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 800,
          fontSize: 19,
          boxShadow: 'var(--glowB)',
        }}
      >
        W
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: 'var(--tx)',
            letterSpacing: '-.02em',
          }}
        >
          WinNet ISP
        </div>
        <div style={{ fontSize: 12, color: 'var(--tx2)', fontWeight: 500 }}>
          Internet Cepat Tanpa Batas
        </div>
      </div>

      <div
        role="group"
        aria-label="Tema tampilan"
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          background: 'var(--card)',
          border: '1px solid var(--bd)',
          borderRadius: 999,
          padding: 5,
          boxShadow: 'var(--sh)',
        }}
      >
        <button
          type="button"
          className="tapglow"
          onClick={() => setTheme('lite')}
          aria-pressed={!neon}
          style={{
            padding: '7px 15px',
            borderRadius: 999,
            fontSize: 12.5,
            fontWeight: 700,
            color: neon ? 'var(--tx2)' : '#fff',
            background: neon ? 'transparent' : 'var(--blue)',
          }}
        >
          Light
        </button>
        <button
          type="button"
          className="tapglow"
          onClick={() => setTheme('neon')}
          aria-pressed={neon}
          style={{
            padding: '7px 15px',
            borderRadius: 999,
            fontSize: 12.5,
            fontWeight: 700,
            color: neon ? '#05070F' : 'var(--tx2)',
            background: neon ? 'var(--yel)' : 'transparent',
            boxShadow: neon ? 'var(--glowY)' : 'none',
          }}
        >
          Neon Glow
        </button>
      </div>
    </div>
  );
}
