import {
  Card,
  FiberLine,
  IconTile,
  ProgressRing,
  PulseDot,
  SectionTitle,
  Tappable,
} from '../components/primitives';
import { usePortal } from '../api/PortalContext';
import { notificationFeed } from '../data/derive';
import { useApp } from '../state/AppContext';
import type { ScreenId } from '../types';

const QUICK_ACTIONS: {
  label: string;
  bg: string;
  fg: string;
  sh: string;
  r: string;
  to: ScreenId;
}[] = [
  {
    label: 'Bayar Tagihan',
    bg: 'var(--blues)',
    fg: 'var(--blue)',
    sh: 'var(--glowB)',
    r: '4px',
    to: 'payment',
  },
  {
    label: 'Cek Pemakaian',
    bg: 'var(--yels)',
    fg: 'var(--warn)',
    sh: 'var(--glowY)',
    r: '99px',
    to: 'usage',
  },
  {
    label: 'Buat Tiket',
    bg: 'var(--oks)',
    fg: 'var(--ok)',
    sh: 'var(--glowG)',
    r: '4px',
    to: 'tickets',
  },
  {
    label: 'Upgrade Paket',
    bg: 'var(--dangs)',
    fg: 'var(--dang)',
    sh: 'none',
    r: '2px',
    to: 'package',
  },
];

export function HomeScreen() {
  const { go } = useApp();
  const { snapshot } = usePortal();
  const { plan, currentInvoice, live, notices } = snapshot;
  const feed = notificationFeed(notices, currentInvoice).slice(0, 2);
  const online = live?.online ?? false;

  return (
    <div
      className="rise"
      style={{ display: 'flex', flexDirection: 'column', gap: 13 }}
    >
      {/* Connection status. The design leaves Service Status unreachable, so
          this card is the way in — it is the summary of that screen. */}
      <Tappable
        onClick={() => go('status')}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 20,
          padding: 16,
          background: 'linear-gradient(135deg,var(--blue),var(--blued))',
          boxShadow: 'var(--glowB)',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PulseDot color={online ? '#5BFFB0' : '#FF8A8A'} />
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '.1em',
            }}
          >
            {online ? 'ONLINE' : 'OFFLINE'}
          </span>
          <span style={{ flex: 1 }} />
          <span
            className="mono"
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: 'rgba(255,255,255,.8)',
            }}
          >
            uptime {live?.uptime || '—'}
          </span>
        </div>
        <div
          style={{
            fontSize: 19,
            fontWeight: 800,
            color: '#fff',
            marginTop: 9,
            letterSpacing: '-.02em',
          }}
        >
          {online
            ? 'Internet aktif dan berjalan baik'
            : 'Koneksi sedang terputus'}
        </div>
        <FiberLine />
      </Tappable>

      {/* plan + usage */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 13,
        }}
      >
        <Card pad={14}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: 'var(--tx2)',
              letterSpacing: '.08em',
            }}
          >
            PAKET SAYA
          </div>
          <div
            style={{
              fontSize: 23,
              fontWeight: 800,
              color: 'var(--tx)',
              marginTop: 6,
              letterSpacing: '-.03em',
            }}
          >
            {plan.speed} <span style={{ fontSize: 14 }}>{plan.unit}</span>
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--blue)' }}>
            {plan.price} / bulan
          </div>
        </Card>

        <Card
          pad={14}
          style={{ display: 'flex', alignItems: 'center', gap: 11 }}
        >
          <ProgressRing
            size={62}
            box={120}
            r={48}
            sw={13}
            fraction={plan.usedFraction ?? 0}
            blur={6}
          />
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: 'var(--tx2)',
                letterSpacing: '.08em',
              }}
            >
              PEMAKAIAN
            </div>
            <div
              style={{
                fontSize: 19,
                fontWeight: 800,
                color: 'var(--tx)',
                letterSpacing: '-.02em',
              }}
            >
              {plan.quotaUsed || '—'}
            </div>
            <div
              style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--tx2)' }}
            >
              dari {plan.quotaTotal}
            </div>
          </div>
        </Card>
      </div>

      {/* this month's bill */}
      <Card
        pad={15}
        style={{ display: 'flex', alignItems: 'center', gap: 14 }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: 'var(--tx2)',
              letterSpacing: '.08em',
            }}
          >
            TAGIHAN BULAN INI
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: 'var(--tx)',
              marginTop: 4,
              letterSpacing: '-.03em',
            }}
          >
            {currentInvoice?.amount ?? '—'}
          </div>
          <div
            style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--dang)' }}
          >
            {currentInvoice ? `Jatuh tempo ${currentInvoice.due}` : 'Tidak ada tagihan'}
          </div>
        </div>
        <Tappable
          onClick={() => go('payment')}
          style={{
            flex: 'none',
            width: 'auto',
            padding: '13px 15px',
            borderRadius: 14,
            background: 'var(--yel)',
            color: '#3b2a00',
            fontSize: 13,
            fontWeight: 800,
            boxShadow: 'var(--glowY)',
          }}
        >
          Bayar Sekarang
        </Tappable>
      </Card>

      {/* quick actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 9,
        }}
      >
        {QUICK_ACTIONS.map((q) => (
          <Tappable
            key={q.label}
            onClick={() => go(q.to)}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--bd)',
              borderRadius: 16,
              padding: '12px 6px',
              textAlign: 'center',
              boxShadow: 'var(--sh)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 7,
              }}
            >
              <IconTile
                size={34}
                radius={11}
                bg={q.bg}
                fg={q.fg}
                dot={12}
                dotRadius={q.r}
                glow={q.sh}
              />
            </div>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: 'var(--tx)',
                lineHeight: 1.25,
              }}
            >
              {q.label}
            </div>
          </Tappable>
        ))}
      </div>

      {/* promo */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 20,
          padding: 16,
          background: 'linear-gradient(120deg,var(--card2),var(--card))',
          border: '1px solid var(--bd)',
          boxShadow: 'var(--sh)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -30,
            top: -30,
            width: 130,
            height: 130,
            borderRadius: 99,
            background: 'var(--yel)',
            opacity: 0.16,
            boxShadow: 'var(--glowY)',
          }}
        />
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: 'var(--yel)',
            letterSpacing: '.1em',
          }}
        >
          PROMO
        </div>
        <div
          style={{
            fontSize: 19,
            fontWeight: 800,
            color: 'var(--tx)',
            marginTop: 5,
            letterSpacing: '-.02em',
          }}
        >
          Upgrade Internet Anda
        </div>
        <div
          style={{
            fontSize: 12.5,
            color: 'var(--tx2)',
            fontWeight: 600,
            lineHeight: 1.45,
            marginTop: 4,
            maxWidth: 230,
          }}
        >
          Nikmati kecepatan lebih tinggi untuk kebutuhan digital Anda
        </div>
        <Tappable
          onClick={() => go('package')}
          style={{
            display: 'inline-flex',
            width: 'auto',
            marginTop: 12,
            padding: '11px 18px',
            borderRadius: 13,
            background: 'var(--blue)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 800,
            boxShadow: 'var(--glowB)',
          }}
        >
          Lihat Paket
        </Tappable>
      </div>

      {/* recent notifications */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <SectionTitle>Notifikasi Terbaru</SectionTitle>
        <button
          type="button"
          onClick={() => go('notif')}
          style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)' }}
        >
          Lihat semua
        </button>
      </div>

      {feed.map((n) => (
        <Card
          key={n.id}
          radius={15}
          pad={12}
          style={{ display: 'flex', gap: 11, alignItems: 'center' }}
        >
          <IconTile
            size={32}
            radius={10}
            bg={n.bg}
            fg={n.fg}
            dot={10}
            dotRadius="3px"
            glow={n.glow}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--tx)' }}
            >
              {n.title}
            </div>
            <div style={{ fontSize: 11, color: 'var(--tx2)', fontWeight: 600 }}>
              {n.time}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
