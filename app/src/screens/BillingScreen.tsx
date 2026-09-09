import {
  Badge,
  Card,
  SectionTitle,
  Tappable,
} from '../components/primitives';
import { usePortal } from '../api/PortalContext';
import { useApp } from '../state/AppContext';

export function BillingScreen() {
  const { go, showToast } = useApp();
  const { snapshot } = usePortal();
  const { currentInvoice, payments } = snapshot;

  return (
    <div
      className="rise"
      style={{ display: 'flex', flexDirection: 'column', gap: 13 }}
    >
      {/* outstanding invoice */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 20,
          padding: 18,
          background: 'linear-gradient(135deg,var(--blue),var(--blued))',
          boxShadow: 'var(--glowB)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'rgba(255,255,255,.82)',
              }}
            >
              Tagihan Internet · {currentInvoice?.period ?? '—'}
            </div>
            <div
              style={{
                fontSize: 33,
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-.04em',
                marginTop: 4,
              }}
            >
              {currentInvoice?.amount ?? '—'}
            </div>
          </div>
          <div
            style={{
              padding: '6px 11px',
              borderRadius: 99,
              background: 'rgba(255,255,255,.16)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 800,
              border: '1px solid rgba(255,255,255,.3)',
              whiteSpace: 'nowrap',
            }}
          >
            {currentInvoice?.paid ? 'Lunas' : 'Belum Dibayar'}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 18,
            marginTop: 14,
            fontSize: 11.5,
            color: 'rgba(255,255,255,.85)',
            fontWeight: 600,
          }}
        >
          <div>
            <div style={{ opacity: 0.75 }}>No. Invoice</div>
            <div
              className="mono"
              style={{ fontSize: 12.5, fontWeight: 600, color: '#fff' }}
            >
              {currentInvoice?.no ?? '—'}
            </div>
          </div>
          <div>
            <div style={{ opacity: 0.75 }}>Jatuh tempo</div>
            <div style={{ fontWeight: 800, color: '#FFD24A' }}>
              {currentInvoice?.dueShort ?? '—'}
            </div>
          </div>
        </div>

        <Tappable
          onClick={() => go('payment')}
          style={{
            marginTop: 16,
            height: 50,
            borderRadius: 14,
            background: 'var(--yel)',
            color: '#3b2a00',
            fontSize: 15,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--glowY)',
          }}
        >
          Bayar Sekarang
        </Tappable>
      </div>

      <div style={{ display: 'flex', gap: 11 }}>
        {['Unduh Invoice', 'Lihat Invoice'].map((label) => (
          <Tappable
            key={label}
            onClick={() => showToast(`${label} · ${currentInvoice?.no ?? '—'}`)}
            style={{
              flex: 1,
              padding: 13,
              borderRadius: 15,
              border: '1px solid var(--bd)',
              background: 'var(--card)',
              textAlign: 'center',
              fontSize: 12.5,
              fontWeight: 700,
              color: 'var(--tx)',
              boxShadow: 'var(--sh)',
            }}
          >
            {label}
          </Tappable>
        ))}
      </div>

      <SectionTitle style={{ marginTop: 2 }}>Riwayat Pembayaran</SectionTitle>

      {payments.map((h) => (
        <Card
          key={h.inv}
          radius={16}
          pad={13}
          style={{ display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              className="mono"
              style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--tx2)' }}
            >
              {h.inv}
            </div>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 800,
                color: 'var(--tx)',
                marginTop: 2,
              }}
            >
              {h.amount}
            </div>
            <div
              style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)' }}
            >
              {h.date} · {h.pkg}
            </div>
          </div>
          <Badge status={h.status} size={11} pad="6px 11px" />
        </Card>
      ))}
    </div>
  );
}
