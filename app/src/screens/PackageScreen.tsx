import { SectionTitle, Tappable } from '../components/primitives';
import { requestUpgrade } from '../api/bff';
import { usePortal } from '../api/PortalContext';
import { BENEFITS } from '../data/packages';
import { useApp } from '../state/AppContext';

export function PackageScreen() {
  const { showToast } = useApp();
  const { snapshot, source, refresh } = usePortal();
  const { plan, packages, pendingUpgrade } = snapshot;

  async function pilih(id: string, speed: number, current: boolean) {
    if (current) {
      showToast('Paket ini sudah aktif');
      return;
    }
    if (source !== 'api') {
      showToast(`Permintaan upgrade ${speed} Mbps dikirim`);
      return;
    }
    try {
      await requestUpgrade({ paketId: id });
      showToast(`Permintaan upgrade ${speed} Mbps dikirim`);
      refresh();
    } catch {
      showToast('Pengajuan gagal. Coba lagi nanti.');
    }
  }

  return (
    <div
      className="rise"
      style={{ display: 'flex', flexDirection: 'column', gap: 13 }}
    >
      {/* active package */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 20,
          padding: 17,
          background: 'linear-gradient(135deg,var(--blued),var(--blue))',
          boxShadow: 'var(--glowB)',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: 'rgba(255,255,255,.8)',
            letterSpacing: '.1em',
          }}
        >
          PAKET AKTIF
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
            marginTop: 5,
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-.04em',
            }}
          >
            {plan.speed}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
            {plan.unit}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 14, fontWeight: 800, color: '#FFD24A' }}>
            {plan.price}
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.8)' }}>
              /bln
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 7,
            marginTop: 13,
          }}
        >
          {BENEFITS.map((b) => (
            <div
              key={b}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 11.5,
                fontWeight: 600,
                color: 'rgba(255,255,255,.92)',
              }}
            >
              <span style={{ color: '#5BFFB0', fontWeight: 800 }}>✓</span>
              {b}
            </div>
          ))}
        </div>
      </div>

      {pendingUpgrade && (
        <div
          style={{
            background: 'var(--yels)',
            border: '1px solid var(--yel)',
            borderRadius: 18,
            padding: 15,
            boxShadow: 'var(--sh)',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--warn)' }}>
            Pengajuan upgrade sedang diproses
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--tx)',
              lineHeight: 1.5,
              marginTop: 6,
            }}
          >
            Ke paket {pendingUpgrade.toSpeed} Mbps, diajukan{' '}
            {pendingUpgrade.requestedOn}. Status: {pendingUpgrade.status}.
          </div>
        </div>
      )}

      <SectionTitle>Bandingkan Paket</SectionTitle>

      {packages.map((pk) => {
        const cur = !!pk.current;
        const pop = !!pk.popular;
        const border = cur ? 'var(--ok)' : pop ? 'var(--yel)' : 'var(--bd)';
        return (
          <div
            key={pk.id}
            style={{
              position: 'relative',
              background: 'var(--card)',
              border: `1.5px solid ${border}`,
              borderRadius: 18,
              padding: 15,
              boxShadow: pop
                ? 'var(--glowY)'
                : cur
                  ? 'var(--glowG)'
                  : 'var(--sh)',
              display: 'flex',
              alignItems: 'center',
              gap: 13,
            }}
          >
            <div style={{ flex: 'none', width: 66 }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: cur || pop ? 'var(--blue)' : 'var(--tx)',
                  letterSpacing: '-.03em',
                }}
              >
                {pk.speed}
              </div>
              <div
                style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--tx2)' }}
              >
                Mbps
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{ fontSize: 14, fontWeight: 800, color: 'var(--tx)' }}
              >
                {pk.price}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--tx2)',
                  }}
                >
                  /bln
                </span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--tx2)',
                  lineHeight: 1.4,
                }}
              >
                {pk.note}
              </div>
              {pop && (
                <div
                  style={{
                    display: 'inline-flex',
                    marginTop: 6,
                    padding: '3px 9px',
                    borderRadius: 99,
                    background: 'var(--yel)',
                    color: '#3b2a00',
                    fontSize: 9.5,
                    fontWeight: 800,
                    letterSpacing: '.06em',
                    boxShadow: 'var(--glowY)',
                  }}
                >
                  PALING POPULER
                </div>
              )}
            </div>

            <Tappable
              onClick={() => void pilih(pk.id, pk.speed, cur)}
              style={{
                flex: 'none',
                width: 'auto',
                padding: '11px 13px',
                borderRadius: 13,
                background: cur
                  ? 'var(--oks)'
                  : pop
                    ? 'var(--yel)'
                    : 'var(--card2)',
                color: cur ? 'var(--ok)' : pop ? '#3b2a00' : 'var(--tx)',
                fontSize: 12,
                fontWeight: 800,
                boxShadow: pop ? 'var(--glowY)' : 'none',
                border: `1px solid ${border}`,
              }}
            >
              {cur ? 'Aktif' : 'Pilih Paket'}
            </Tappable>
          </div>
        );
      })}
    </div>
  );
}
