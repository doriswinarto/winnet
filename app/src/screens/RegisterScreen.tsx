import { Tappable } from '../components/primitives';
import { CUSTOMER, OTP_DIGITS, REG_FIELDS } from '../data/customer';
import { useApp } from '../state/AppContext';

export function RegisterScreen() {
  const { go, showToast } = useApp();

  return (
    <div
      className="rise scroll"
      style={{
        padding: '6px 22px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          className="tapglow"
          onClick={() => go('login')}
          aria-label="Kembali ke halaman masuk"
          style={{
            width: 38,
            height: 38,
            flex: 'none',
            borderRadius: 12,
            border: '1px solid var(--bd)',
            background: 'var(--card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--tx)',
            fontSize: 17,
          }}
        >
          ‹
        </button>
        <div>
          <div
            style={{
              fontSize: 19,
              fontWeight: 800,
              color: 'var(--tx)',
              letterSpacing: '-.02em',
            }}
          >
            Buat Akun Baru
          </div>
          <div style={{ fontSize: 12, color: 'var(--tx2)', fontWeight: 600 }}>
            Daftar layanan WinNet dalam 1 menit
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 7, flex: 'none' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 5,
              borderRadius: 99,
              background: i === 0 ? 'var(--blue)' : 'var(--ring)',
              boxShadow: i === 0 ? 'var(--glowB)' : undefined,
            }}
          />
        ))}
      </div>

      {REG_FIELDS.map((field) => (
        <div key={field.label} style={{ flex: 'none' }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--tx2)',
              marginBottom: 6,
            }}
          >
            {field.label}
          </div>
          <div
            style={{
              minHeight: 48,
              borderRadius: 13,
              border: '1px solid var(--bd)',
              background: 'var(--card)',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 14px',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--tx)',
              boxShadow: 'var(--sh)',
            }}
          >
            {field.value}
          </div>
        </div>
      ))}

      <div
        style={{
          display: 'flex',
          gap: 9,
          alignItems: 'flex-start',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--tx2)',
          lineHeight: 1.5,
          flex: 'none',
        }}
      >
        <span
          style={{
            width: 19,
            height: 19,
            flex: 'none',
            borderRadius: 6,
            background: 'var(--blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 12,
            fontWeight: 800,
            boxShadow: 'var(--glowB)',
          }}
        >
          ✓
        </span>
        Saya menyetujui Syarat &amp; Ketentuan dan Kebijakan Privasi WinNet ISP.
      </div>

      <Tappable
        onClick={() => showToast('Akun dibuat. Verifikasi OTP untuk lanjut.')}
        style={{
          height: 54,
          flex: 'none',
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
        Daftar &amp; Kirim OTP
      </Tappable>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 9,
          flex: 'none',
        }}
      >
        {OTP_DIGITS.map((digit, i) => {
          const filled = digit !== '';
          return (
            <div
              key={i}
              style={{
                width: 46,
                height: 54,
                borderRadius: 13,
                border: `1.5px solid ${filled ? 'var(--blue)' : 'var(--bd)'}`,
                background: 'var(--card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 800,
                color: 'var(--tx)',
                boxShadow: filled ? 'var(--glowB)' : 'none',
              }}
            >
              {digit}
            </div>
          );
        })}
      </div>

      <div
        style={{
          textAlign: 'center',
          fontSize: 12,
          color: 'var(--tx2)',
          fontWeight: 600,
          flex: 'none',
        }}
      >
        Kode OTP dikirim ke {CUSTOMER.phoneMasked}
      </div>
    </div>
  );
}
