import { Badge, Card, Chip, Tappable } from '../components/primitives';
import { reportFault } from '../api/bff';
import { usePortal } from '../api/PortalContext';
import { TICKET_FILTERS } from '../data/tickets';
import { useApp } from '../state/AppContext';

export function TicketsScreen() {
  const { openTicket, showToast, ticketFilter, setTicketFilter } = useApp();
  const { snapshot, source, refresh } = usePortal();
  const { tickets, notices } = snapshot;
  const visible =
    ticketFilter === 'Semua'
      ? tickets
      : tickets.filter((t) => t.status === ticketFilter);

  // `/tulis/lapor` needs a category and a description. The design's button
  // opens no form, so the active network notice supplies both when there is
  // one — which is the case this button exists for.
  async function buatTiket() {
    if (source !== 'api') {
      showToast('Tiket baru dibuat');
      return;
    }
    const outage = notices.find((n) => n.severity === 'outage');
    try {
      await reportFault({
        kategori: outage ? 'Internet Gangguan' : 'Lainnya',
        keterangan: outage
          ? `Terdampak gangguan di ${outage.area ?? 'jaringan'}: ${outage.title}`
          : 'Pelanggan melaporkan kendala layanan dari aplikasi.',
      });
      showToast('Tiket baru dibuat');
      refresh();
    } catch {
      showToast('Gagal membuat tiket. Coba lagi nanti.');
    }
  }

  return (
    <div
      className="rise"
      style={{ display: 'flex', flexDirection: 'column', gap: 13 }}
    >
      <Tappable
        onClick={() => void buatTiket()}
        style={{
          height: 52,
          borderRadius: 15,
          background: 'linear-gradient(135deg,var(--blue),var(--blued))',
          color: '#fff',
          fontSize: 14.5,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: 'var(--glowB)',
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>+</span>{' '}
        Buat Tiket Baru
      </Tappable>

      <div className="scroll" style={{ display: 'flex', gap: 7 }}>
        {TICKET_FILTERS.map((f) => (
          <Chip
            key={f}
            label={f}
            active={f === ticketFilter}
            onClick={() => setTicketFilter(f)}
          />
        ))}
      </div>

      {visible.map((t) => (
        <Tappable
          key={t.id}
          onClick={() => openTicket(t.id)}
          style={{
            background: 'var(--card)',
            border: '1px solid var(--bd)',
            borderRadius: 18,
            padding: 15,
            boxShadow: 'var(--sh)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span
              className="mono"
              style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)' }}
            >
              {t.id}
            </span>
            <span style={{ flex: 1 }} />
            <Badge status={t.status} />
          </div>
          <div
            style={{
              fontSize: 14.5,
              fontWeight: 800,
              color: 'var(--tx)',
              marginTop: 7,
              letterSpacing: '-.01em',
            }}
          >
            {t.subject}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 6,
            }}
          >
            <span
              style={{
                padding: '4px 9px',
                borderRadius: 8,
                background: 'var(--card2)',
                border: '1px solid var(--bd)',
                fontSize: 10.5,
                fontWeight: 700,
                color: 'var(--tx2)',
              }}
            >
              {t.cat}
            </span>
            <span
              style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)' }}
            >
              {t.date}
            </span>
          </div>
        </Tappable>
      ))}

      <Card
        radius={18}
        pad={22}
        style={{
          border: '1px dashed var(--bd)',
          boxShadow: 'none',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            margin: '0 auto 10px',
            borderRadius: 14,
            background: 'var(--card2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: 'var(--tx2)',
              opacity: 0.5,
              display: 'block',
            }}
          />
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--tx)' }}>
          Tidak ada tiket lain
        </div>
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: 'var(--tx2)',
            marginTop: 3,
          }}
        >
          Tiket yang selesai lebih dari 30 hari akan diarsipkan.
        </div>
      </Card>
    </div>
  );
}
