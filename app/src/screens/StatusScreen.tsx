import {
  Card,
  FiberDrop,
  PulseDot,
  SpeedGauge,
  StatLabel,
  Tappable,
} from '../components/primitives';
import { NETWORK_CHAIN, OUTAGE, statusMetrics } from '../data/status';
import { useApp } from '../state/AppContext';

export function StatusScreen() {
  const { speed, go } = useApp();

  return (
    <div
      className="rise"
      style={{ display: 'flex', flexDirection: 'column', gap: 13 }}
    >
      {/* live status */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 20,
          padding: 18,
          background: 'linear-gradient(140deg,var(--blued),var(--blue))',
          boxShadow: 'var(--glowB)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: 'rgba(255,255,255,.82)',
            letterSpacing: '.12em',
          }}
        >
          STATUS INTERNET
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 9,
            marginTop: 9,
            padding: '8px 16px',
            borderRadius: 99,
            background: 'rgba(91,255,176,.16)',
            border: '1px solid rgba(91,255,176,.45)',
          }}
        >
          <PulseDot color="#5BFFB0" size={10} />
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '.06em',
            }}
          >
            ONLINE
          </span>
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'rgba(255,255,255,.88)',
            marginTop: 9,
          }}
        >
          Internet Anda berjalan normal
        </div>
        <div
          style={{
            marginTop: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          <SpeedGauge value={speed} />
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-.04em',
              }}
            >
              {speed.toFixed(1)}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#FFD24A' }}>
              Mbps · realtime
            </div>
          </div>
        </div>
      </div>

      {/* metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 11,
        }}
      >
        {statusMetrics(speed).map((m) => (
          <Card key={m.label} radius={16} pad={13}>
            <StatLabel>{m.label}</StatLabel>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: m.c,
                marginTop: 4,
                letterSpacing: '-.02em',
              }}
            >
              {m.v}
            </div>
          </Card>
        ))}
      </div>

      {/* network path */}
      <Card radius={20} pad={16}>
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 800,
            color: 'var(--tx)',
            marginBottom: 12,
          }}
        >
          Jalur Jaringan
        </div>
        {NETWORK_CHAIN.map((hop, i) => (
          <div key={hop.name}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PulseDot
                color="var(--ok)"
                size={11}
                speed={1.9}
                glow="var(--glowG)"
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 13, fontWeight: 800, color: 'var(--tx)' }}
                >
                  {hop.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--tx2)',
                  }}
                >
                  {hop.note}
                </div>
              </div>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: 'var(--ok)',
                  background: 'var(--oks)',
                  padding: '4px 9px',
                  borderRadius: 99,
                }}
              >
                Normal
              </span>
            </div>
            {i < NETWORK_CHAIN.length - 1 && <FiberDrop />}
          </div>
        ))}
      </Card>

      {/* outage notice */}
      <div
        style={{
          background: 'var(--dangs)',
          border: '1px solid var(--dang)',
          borderRadius: 18,
          padding: 15,
          boxShadow: 'var(--sh)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <PulseDot color="var(--dang)" size={9} speed={1.3} />
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dang)' }}>
            {OUTAGE.title}
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--tx)',
            lineHeight: 1.5,
            marginTop: 7,
          }}
        >
          Tim teknis kami sedang melakukan perbaikan di area {OUTAGE.area}.
          Estimasi normal kembali <b>{OUTAGE.eta}</b>.
        </div>
        <Tappable
          onClick={() => go('tickets')}
          style={{
            marginTop: 12,
            width: 'auto',
            padding: '11px 15px',
            display: 'inline-flex',
            borderRadius: 13,
            background: 'var(--dang)',
            color: '#fff',
            fontSize: 12.5,
            fontWeight: 800,
            boxShadow: 'var(--dangGlow)',
          }}
        >
          Buat Tiket Gangguan
        </Tappable>
      </div>
    </div>
  );
}
