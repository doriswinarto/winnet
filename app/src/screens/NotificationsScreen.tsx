import { Chip, IconTile } from '../components/primitives';
import {
  NOTIFICATIONS,
  NOTIF_FILTERS,
  NOTIF_FILTER_CATS,
} from '../data/notifications';
import { useApp } from '../state/AppContext';

export function NotificationsScreen() {
  const { notifFilter, setNotifFilter } = useApp();
  const visible =
    notifFilter === 'Semua'
      ? NOTIFICATIONS
      : NOTIFICATIONS.filter((n) =>
          NOTIF_FILTER_CATS[notifFilter].includes(n.cat),
        );

  return (
    <div
      className="rise"
      style={{ display: 'flex', flexDirection: 'column', gap: 13 }}
    >
      <div className="scroll" style={{ display: 'flex', gap: 7 }}>
        {NOTIF_FILTERS.map((f) => (
          <Chip
            key={f}
            label={f}
            active={f === notifFilter}
            onClick={() => setNotifFilter(f)}
          />
        ))}
      </div>

      {visible.map((n) => (
        <div
          key={n.title}
          style={{
            background: n.unread ? 'var(--card)' : 'var(--card2)',
            border: '1px solid var(--bd)',
            borderRadius: 18,
            padding: 14,
            boxShadow: n.unread ? 'var(--sh)' : 'none',
            display: 'flex',
            gap: 12,
          }}
        >
          <IconTile
            size={40}
            radius={13}
            bg={n.bg}
            fg={n.fg}
            dot={13}
            dotRadius={n.r}
            glow={n.glow}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  letterSpacing: '.08em',
                  color: n.fg,
                }}
              >
                {n.cat}
              </span>
              <span style={{ flex: 1 }} />
              {n.unread && (
                <span
                  aria-label="Belum dibaca"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 99,
                    background: 'var(--blue)',
                    color: 'var(--blue)',
                    animation: 'pulseDot 1.8s infinite',
                    display: 'block',
                  }}
                />
              )}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: n.unread ? 800 : 600,
                color: 'var(--tx)',
                marginTop: 3,
                lineHeight: 1.4,
              }}
            >
              {n.title}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--tx2)',
                marginTop: 4,
              }}
            >
              {n.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
