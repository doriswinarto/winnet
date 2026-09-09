import { useState } from 'react';
import type { PaymentMethod } from '@shared/portal';
import { Card } from './primitives';
import { QrCode } from './QrCode';

/**
 * Where the customer actually sends the money.
 *
 * Every value here comes from the panel unchanged — the account number the
 * admin configured is the account number shown. Nothing is derived, formatted
 * into a different value, or supplied from a default, because a wrong number
 * here means a customer's transfer goes somewhere it cannot be recovered from.
 *
 * When the panel gives no destination the component says so and warns against
 * transferring, rather than rendering an empty row under "transfer to".
 */

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older WebViews and non-secure contexts have no clipboard API.
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}

function CopyRow({
  label,
  value,
  mono,
  large,
  onCopied,
}: {
  label: string;
  value: string;
  mono?: boolean;
  large?: boolean;
  onCopied: (label: string, ok: boolean) => void;
}) {
  const [done, setDone] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 0',
        borderBottom: '1px solid var(--bd)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx2)' }}>
          {label}
        </div>
        <div
          className={mono ? 'mono' : undefined}
          style={{
            fontSize: large ? 19 : 13.5,
            fontWeight: 800,
            color: 'var(--tx)',
            marginTop: 3,
            letterSpacing: large ? '.02em' : undefined,
            wordBreak: 'break-all',
          }}
        >
          {value}
        </div>
      </div>
      <button
        type="button"
        className="tapglow"
        onClick={async () => {
          const ok = await copy(value);
          setDone(ok);
          onCopied(label, ok);
          if (ok) window.setTimeout(() => setDone(false), 1800);
        }}
        aria-label={`Salin ${label}`}
        style={{
          flex: 'none',
          padding: '8px 12px',
          borderRadius: 10,
          border: '1px solid var(--bd)',
          background: done ? 'var(--oks)' : 'var(--card2)',
          color: done ? 'var(--ok)' : 'var(--blue)',
          fontSize: 11.5,
          fontWeight: 800,
        }}
      >
        {done ? 'Tersalin' : 'Salin'}
      </button>
    </div>
  );
}

export function PaymentDestination({
  method,
  amount,
  onCopied,
}: {
  method: PaymentMethod | undefined;
  amount: string;
  onCopied: (label: string, ok: boolean) => void;
}) {
  const hasAccount = !!method?.accountNumber;
  const hasQr = !!method?.qr;

  if (!method || (!hasAccount && !hasQr)) {
    return (
      <div
        style={{
          background: 'var(--dangs)',
          border: '1px solid var(--dang)',
          borderRadius: 18,
          padding: 16,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dang)' }}>
          Rekening tujuan belum tersedia
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
          Jangan melakukan transfer sebelum nomor rekening tampil di sini.
          Muat ulang halaman, atau hubungi customer service untuk memastikan
          rekening resmi WinNet.
        </div>
      </div>
    );
  }

  // The panel may hand back either an image URL or a raw EMV payload. An
  // image is shown as-is; a payload is encoded here, since as text it is
  // unscannable and therefore unpayable.
  const qrIsImage =
    hasQr && /^(https?:|data:image\/)/i.test(method.qr as string);

  return (
    <Card radius={20} pad={17}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: 'var(--tx)',
          marginBottom: 4,
        }}
      >
        Tujuan Pembayaran
      </div>
      <div
        style={{
          fontSize: 11.5,
          fontWeight: 600,
          color: 'var(--tx2)',
          marginBottom: 8,
        }}
      >
        Sesuai data resmi di panel WinNet
      </div>

      {hasQr && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '12px 0',
          }}
        >
          {qrIsImage ? (
            <img
              src={method.qr as string}
              alt={`Kode QR ${method.name}`}
              style={{
                width: 210,
                height: 210,
                borderRadius: 12,
                background: '#fff',
                objectFit: 'contain',
              }}
            />
          ) : (
            <QrCode
              value={method.qr as string}
              label={`Kode QR ${method.name}`}
            />
          )}
          <div
            style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--tx2)' }}
          >
            Pindai dengan aplikasi e-wallet atau m-banking
          </div>
        </div>
      )}

      {method.bank && (
        <CopyRow label="Bank" value={method.bank} onCopied={onCopied} />
      )}
      {hasAccount && (
        <CopyRow
          label={method.kind === 'va' ? 'Nomor Virtual Account' : 'Nomor Rekening'}
          value={method.accountNumber as string}
          mono
          large
          onCopied={onCopied}
        />
      )}
      {method.accountName && (
        <CopyRow
          label="Atas Nama"
          value={method.accountName}
          onCopied={onCopied}
        />
      )}
      <CopyRow label="Jumlah Transfer" value={amount} large onCopied={onCopied} />

      <div
        style={{
          fontSize: 11.5,
          fontWeight: 600,
          color: 'var(--tx2)',
          lineHeight: 1.5,
          marginTop: 12,
        }}
      >
        Transfer sesuai jumlah di atas agar pembayaran dapat dicocokkan otomatis.
      </div>
    </Card>
  );
}
