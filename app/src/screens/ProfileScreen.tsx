import { Card, Tappable } from '../components/primitives';
import { usePortal } from '../api/PortalContext';
import { PROFILE_TABS } from '../data/customer';
import { profileRows } from '../data/derive';
import { useApp } from '../state/AppContext';

export function ProfileScreen() {
  const { tab, setTab, theme, toggleTheme, go, showToast } = useApp();
  const { snapshot, settings, signOut } = usePortal();
  const { customer, live } = snapshot;
  const neon = theme === 'neon';
  const rows = profileRows(customer, live)[tab];

  async function keluar() {
    await signOut();
    go('login');
  }

  return (
    <div
      className="rise"
      style={{ display: 'flex', flexDirection: 'column', gap: 13 }}
    >
      <Card
        radius={20}
        pad={18}
        style={{ display: 'flex', alignItems: 'center', gap: 14 }}
      >
        <div
          style={{
            width: 66,
            height: 66,
            flex: 'none',
            borderRadius: 99,
            background: 'linear-gradient(140deg,var(--yel),#F59E0B)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 800,
            color: '#3b2a00',
            boxShadow: 'var(--glowY)',
          }}
        >
          {customer.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: 'var(--tx)',
              letterSpacing: '-.02em',
            }}
          >
            {customer.name}
          </div>
          <div
            className="mono"
            style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--blue)' }}
          >
            {customer.id}
          </div>
          <div
            style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--tx2)' }}
          >
            {customer.email}
          </div>
        </div>
      </Card>

      <div
        style={{
          display: 'flex',
          gap: 6,
          background: 'var(--card2)',
          border: '1px solid var(--bd)',
          borderRadius: 13,
          padding: 4,
        }}
      >
        {PROFILE_TABS.map((t) => {
          const on = t === tab;
          return (
            <button
              key={t}
              type="button"
              className="tapglow"
              onClick={() => setTab(t)}
              aria-pressed={on}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '9px 0',
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 700,
                color: on ? 'var(--blue)' : 'var(--tx2)',
                background: on ? 'var(--card)' : 'transparent',
                boxShadow: on ? 'var(--sh)' : 'none',
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      <Card radius={20} pad="6px 16px">
        {rows.map((r) => (
          <div
            key={r.k}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 14,
              padding: '13px 0',
              borderBottom: '1px solid var(--bd)',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--tx2)',
                whiteSpace: 'nowrap',
              }}
            >
              {r.k}
            </span>
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: 'var(--tx)',
                textAlign: 'right',
              }}
            >
              {r.v}
            </span>
          </div>
        ))}
      </Card>

      <Tappable
        onClick={toggleTheme}
        role="switch"
        aria-checked={neon}
        style={{
          background: 'var(--card)',
          border: '1px solid var(--bd)',
          borderRadius: 18,
          padding: 15,
          boxShadow: 'var(--sh)',
          display: 'flex',
          alignItems: 'center',
          gap: 13,
          textAlign: 'left',
        }}
      >
        <span
          style={{
            width: 38,
            height: 38,
            flex: 'none',
            borderRadius: 12,
            background: 'var(--blues)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--glowB)',
          }}
        >
          <span
            style={{
              width: 13,
              height: 13,
              borderRadius: 99,
              background: 'var(--blue)',
              display: 'block',
            }}
          />
        </span>
        <div style={{ flex: 1 }}>
          <div
            style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--tx)' }}
          >
            Mode Neon
          </div>
          <div
            style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)' }}
          >
            Tampilan gelap dengan aksen menyala
          </div>
        </div>
        <span
          style={{
            width: 48,
            height: 28,
            flex: 'none',
            borderRadius: 99,
            background: neon ? 'var(--blue)' : 'var(--ring)',
            boxShadow: neon ? 'var(--glowB)' : 'none',
            position: 'relative',
            display: 'block',
            transition: 'background .25s ease',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 3,
              left: neon ? 23 : 3,
              width: 22,
              height: 22,
              borderRadius: 99,
              background: '#fff',
              transition: 'left .25s ease',
              display: 'block',
            }}
          />
        </span>
      </Tappable>

      <div style={{ display: 'flex', gap: 11 }}>
        <Tappable
          onClick={() => showToast('Formulir edit profil dibuka')}
          style={{
            flex: 1,
            height: 50,
            borderRadius: 15,
            background: 'linear-gradient(135deg,var(--blue),var(--blued))',
            color: '#fff',
            fontSize: 13.5,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--glowB)',
          }}
        >
          Edit Profil
        </Tappable>
        {/* The panel authenticates by WhatsApp OTP — there is no password to
            change — so this slot offers support contact instead. */}
        <Tappable
          onClick={() =>
            showToast(
              settings.supportPhone
                ? `Hubungi CS di ${settings.supportPhone}`
                : 'Hubungi CS melalui WhatsApp resmi WinNet',
            )
          }
          style={{
            flex: 1,
            height: 50,
            borderRadius: 15,
            border: '1.5px solid var(--bd)',
            background: 'var(--card)',
            color: 'var(--tx)',
            fontSize: 13.5,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Hubungi CS
        </Tappable>
      </div>

      <Tappable
        onClick={() => void keluar()}
        style={{
          height: 48,
          borderRadius: 15,
          border: '1.5px solid var(--dang)',
          color: 'var(--dang)',
          fontSize: 13.5,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Keluar
      </Tappable>
    </div>
  );
}
