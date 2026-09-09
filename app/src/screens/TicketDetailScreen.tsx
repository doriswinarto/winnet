import { useEffect, useRef, useState } from 'react';
import { Badge, Card, PulseDot } from '../components/primitives';
import { usePortal } from '../api/PortalContext';
import { TICKET_CHAT } from '../data/tickets';
import { useApp } from '../state/AppContext';

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ opacity: 0.8 }}>{label}</div>
      <div style={{ color: 'var(--tx)', fontWeight: 700 }}>{value}</div>
    </div>
  );
}

export function TicketDetailScreen() {
  const { go, showToast, ticketId } = useApp();
  const { snapshot } = usePortal();
  const ticket =
    snapshot.tickets.find((t) => t.id === ticketId) ?? snapshot.tickets[0];
  const [draft, setDraft] = useState('');
  const thread = useRef<HTMLDivElement>(null);

  // Open on the newest message, so the technician's reply and the typing
  // indicator are visible without scrolling.
  useEffect(() => {
    const el = thread.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const send = () => {
    showToast('Pesan terkirim ke teknisi');
    setDraft('');
  };

  return (
    <div
      className="rise"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 13,
        height: '100%',
      }}
    >
      <Card radius={18} pad={15} style={{ flex: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <button
            type="button"
            onClick={() => go('tickets')}
            aria-label="Kembali ke daftar tiket"
            style={{ fontSize: 17, color: 'var(--tx)' }}
          >
            ‹
          </button>
          <span
            className="mono"
            style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)' }}
          >
            {ticket?.id ?? '—'}
          </span>
          <span style={{ flex: 1 }} />
          {ticket && <Badge status={ticket.status} />}
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: 'var(--tx)',
            marginTop: 8,
          }}
        >
          {ticket?.subject ?? 'Tiket tidak ditemukan'}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 10,
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--tx2)',
          }}
        >
          <Meta label="Kategori" value={ticket?.cat ?? '—'} />
          <Meta label="Dibuat" value={ticket?.date ?? '—'} />
          <Meta label="Status" value={ticket?.status ?? '—'} />
        </div>
      </Card>

      {/* The panel exposes ticket rows but no message thread and no reply
          endpoint, so the conversation below is illustrative. */}
      <div
        ref={thread}
        className="scroll"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 11,
        }}
      >
        {TICKET_CHAT.map((c, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: c.own ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '78%',
                borderRadius: 16,
                padding: '12px 14px',
                background: c.own ? 'var(--blue)' : 'var(--card)',
                border: `1px solid ${c.own ? 'var(--blue)' : 'var(--bd)'}`,
                boxShadow: c.own ? 'var(--glowB)' : 'var(--sh)',
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: c.own ? 'rgba(255,255,255,.8)' : 'var(--blue)',
                  letterSpacing: '.04em',
                }}
              >
                {c.name}
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: c.own ? '#fff' : 'var(--tx)',
                  lineHeight: 1.5,
                  marginTop: 4,
                }}
              >
                {c.msg}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: c.own ? 'rgba(255,255,255,.7)' : 'var(--tx2)',
                  marginTop: 5,
                }}
              >
                {c.time}
              </div>
            </div>
          </div>
        ))}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 11.5,
            fontWeight: 700,
            color: 'var(--tx2)',
            paddingLeft: 4,
          }}
        >
          <PulseDot color="var(--ok)" size={7} speed={1.4} /> Teknisi sedang
          mengetik…
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        style={{
          flex: 'none',
          display: 'flex',
          gap: 9,
          alignItems: 'center',
          background: 'var(--card)',
          border: '1px solid var(--bd)',
          borderRadius: 16,
          padding: '9px 10px',
          boxShadow: 'var(--sh)',
        }}
      >
        <button
          type="button"
          className="tapglow"
          aria-label="Lampirkan berkas"
          style={{
            width: 38,
            height: 38,
            flex: 'none',
            borderRadius: 11,
            background: 'var(--card2)',
            border: '1px solid var(--bd)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            color: 'var(--tx2)',
          }}
        >
          +
        </button>
        <input
          className="composer-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Tulis pesan…"
          aria-label="Tulis pesan"
        />
        <button
          type="submit"
          className="tapglow"
          aria-label="Kirim pesan"
          style={{
            width: 42,
            height: 38,
            flex: 'none',
            borderRadius: 11,
            background: 'var(--blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--glowB)',
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M4 12h15" />
            <path d="M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>
    </div>
  );
}
