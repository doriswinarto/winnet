import { Card, IconTile, Tappable } from '../components/primitives';
import { usePortal } from '../api/PortalContext';
import { PAY_STEPS } from '../data/billing';
import { methodStyle } from '../data/derive';
import { useApp } from '../state/AppContext';
import type { KeyValue } from '../types';

function StepBar({ step }: { step: number }) {
  return (
    <ol
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        listStyle: 'none',
        margin: 0,
        padding: 0,
      }}
    >
      {PAY_STEPS.map((label, i) => {
        const done = step >= i;
        const last = i === PAY_STEPS.length - 1;
        const accent = last ? 'var(--ok)' : 'var(--blue)';
        const fill = done ? accent : 'var(--ring)';
        const glow = done ? (last ? 'var(--glowG)' : 'var(--glowB)') : 'none';
        return (
          <li
            key={label}
            aria-current={step === i ? 'step' : undefined}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}
          >
            <div
              style={{
                height: 5,
                borderRadius: 99,
                background: fill,
                boxShadow: glow,
              }}
            />
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: done ? accent : 'var(--tx2)',
              }}
            >
              {label}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function SummaryRow({ rows, dense }: { rows: KeyValue[]; dense?: boolean }) {
  return (
    <>
      {rows.map((r) => (
        <div
          key={r.k}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: dense ? '8px 0' : '9px 0',
            borderBottom: dense ? undefined : '1px solid var(--bd)',
            fontSize: 12.5,
          }}
        >
          <span style={{ color: 'var(--tx2)', fontWeight: 600 }}>{r.k}</span>
          <span style={{ color: 'var(--tx)', fontWeight: 800 }}>{r.v}</span>
        </div>
      ))}
    </>
  );
}

function PickMethod() {
  const { method, setMethod, payNext } = useApp();
  const { snapshot } = usePortal();
  const { currentInvoice, methods, outlets } = snapshot;
  const all = [...methods, ...outlets];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
      <Card
        pad={15}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--tx2)' }}
          >
            Total pembayaran
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: 'var(--tx)',
              letterSpacing: '-.03em',
            }}
          >
            {currentInvoice?.amount ?? '—'}
          </div>
        </div>
        <div
          className="mono"
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--tx2)',
            textAlign: 'right',
          }}
        >
          {currentInvoice?.no ?? '—'}
        </div>
      </Card>

      <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--tx)' }}>
        Pilih Metode Pembayaran
      </div>

      <div
        role="radiogroup"
        aria-label="Metode pembayaran"
        style={{ display: 'flex', flexDirection: 'column', gap: 11 }}
      >
        {all.map((m) => {
          const on = m.id === method;
          const style = methodStyle(m.kind);
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={on}
              className="tapglow"
              onClick={() => setMethod(m.id)}
              style={{
                width: '100%',
                background: 'var(--card)',
                border: `1.5px solid ${on ? 'var(--blue)' : 'var(--bd)'}`,
                borderRadius: 16,
                padding: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: on ? 'var(--glowB)' : 'var(--sh)',
              }}
            >
              <IconTile
                size={38}
                radius={11}
                bg={style.bg}
                fg={style.fg}
                dot={14}
                dotRadius="4px"
              />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div
                  style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--tx)' }}
                >
                  {m.name}
                </div>
                <div
                  style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx2)' }}
                >
                  {m.note}
                </div>
              </div>
              <span
                style={{
                  width: 20,
                  height: 20,
                  flex: 'none',
                  borderRadius: 99,
                  border: `2px solid ${on ? 'var(--blue)' : 'var(--bd)'}`,
                  background: on ? 'var(--blue)' : 'transparent',
                  boxShadow: on ? 'var(--glowB)' : 'none',
                  display: 'block',
                }}
              />
            </button>
          );
        })}
      </div>

      <Tappable
        onClick={payNext}
        style={{
          height: 54,
          borderRadius: 15,
          background: 'linear-gradient(135deg,var(--blue),var(--blued))',
          color: '#fff',
          fontSize: 15.5,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--glowB)',
        }}
      >
        Lanjutkan
      </Tappable>
    </div>
  );
}

function Confirm() {
  const { method, payNext, payBack } = useApp();
  const { snapshot } = usePortal();
  const { currentInvoice, plan, methods, outlets } = snapshot;
  const chosen = [...methods, ...outlets].find((m) => m.id === method);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <Card radius={20} pad={17}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: 'var(--tx)',
            marginBottom: 12,
          }}
        >
          Konfirmasi Pembayaran
        </div>
        <SummaryRow
          rows={[
            { k: 'Metode', v: chosen?.name ?? '—' },
            { k: 'No. Invoice', v: currentInvoice?.no ?? '—' },
            { k: 'Paket', v: `Fiber ${plan.speed} ${plan.unit}` },
            { k: 'Biaya admin', v: 'Rp0' },
          ]}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 13,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx2)' }}>
            Total
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: 'var(--blue)',
              letterSpacing: '-.03em',
            }}
          >
            {currentInvoice?.amount ?? '—'}
          </span>
        </div>
      </Card>

      <div
        style={{
          background: 'var(--card2)',
          border: '1px dashed var(--bd)',
          borderRadius: 18,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 14,
            background:
              'repeating-conic-gradient(var(--tx) 0 25%,var(--card) 0 50%)',
            backgroundSize: '14px 14px',
            boxShadow: 'var(--sh)',
          }}
        />
        <div
          className="mono"
          style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--tx2)' }}
        >
          [ QRIS · berlaku 14:59 ]
        </div>
      </div>

      <Tappable
        onClick={payNext}
        style={{
          height: 54,
          borderRadius: 15,
          background: 'var(--yel)',
          color: '#3b2a00',
          fontSize: 15.5,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--glowY)',
        }}
      >
        Saya Sudah Bayar
      </Tappable>

      <button
        type="button"
        onClick={payBack}
        style={{
          textAlign: 'center',
          fontSize: 12.5,
          fontWeight: 700,
          color: 'var(--tx2)',
          width: '100%',
        }}
      >
        Ganti metode
      </button>
    </div>
  );
}

function Success() {
  const { method, go, showToast } = useApp();
  const { snapshot } = usePortal();
  const { currentInvoice, methods, outlets } = snapshot;
  const chosen = [...methods, ...outlets].find((m) => m.id === method);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 13,
        paddingTop: 26,
      }}
    >
      <div
        style={{
          width: 104,
          height: 104,
          borderRadius: 99,
          background: 'var(--oks)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--glowG)',
          animation: 'popIn .5s cubic-bezier(.3,1.5,.5,1)',
        }}
      >
        <svg
          width="46"
          height="46"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ok)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 12.5 9.5 18 20 6.5" />
        </svg>
      </div>

      <div
        style={{
          fontSize: 23,
          fontWeight: 800,
          color: 'var(--tx)',
          letterSpacing: '-.03em',
        }}
      >
        Pembayaran Berhasil
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--tx2)',
          textAlign: 'center',
          maxWidth: 250,
          lineHeight: 1.5,
        }}
      >
        Tagihan September 2026 telah lunas. Internet Anda aktif hingga 15
        Oktober 2026.
      </div>

      <Card radius={18} pad={16} style={{ width: '100%' }}>
        <SummaryRow
          dense
          rows={[
            { k: 'No. Invoice', v: currentInvoice?.no ?? '—' },
            { k: 'Metode', v: chosen?.name ?? '—' },
            { k: 'Periode', v: currentInvoice?.period ?? '—' },
            { k: 'Jumlah', v: currentInvoice?.amount ?? '—' },
          ]}
        />
      </Card>

      <Tappable
        onClick={() => showToast('Bukti pembayaran diunduh')}
        style={{
          height: 52,
          borderRadius: 15,
          background: 'linear-gradient(135deg,var(--blue),var(--blued))',
          color: '#fff',
          fontSize: 15,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--glowB)',
        }}
      >
        Unduh Bukti Pembayaran
      </Tappable>

      <button
        type="button"
        onClick={() => go('home')}
        style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue)' }}
      >
        Kembali ke Home
      </button>
    </div>
  );
}

export function PaymentScreen() {
  const { payStep } = useApp();

  return (
    <div
      className="rise"
      style={{ display: 'flex', flexDirection: 'column', gap: 13 }}
    >
      <StepBar step={payStep} />
      {payStep === 0 && <PickMethod />}
      {payStep === 1 && <Confirm />}
      {payStep === 2 && <Success />}
    </div>
  );
}
