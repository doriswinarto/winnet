import { useState } from 'react';
import { Tappable } from '../components/primitives';
import { CUSTOMER } from '../data/customer';
import { useApp } from '../state/AppContext';

type LoginMethod = 'Customer ID' | 'Email' | 'No. HP';

const LOGIN_METHODS: LoginMethod[] = ['Customer ID', 'Email', 'No. HP'];

const IDENTIFIERS: Record<LoginMethod, string> = {
  'Customer ID': CUSTOMER.id,
  Email: CUSTOMER.email,
  'No. HP': CUSTOMER.phone,
};

export function LoginScreen() {
  const { go, showPw, togglePw, showToast } = useApp();
  const [method, setMethod] = useState<LoginMethod>('Customer ID');

  return (
    <div
      className="rise scroll"
      style={{
        padding: '14px 22px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 9,
          paddingTop: 6,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 17,
            background: 'linear-gradient(140deg,var(--blue),var(--blued))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: 26,
            boxShadow: 'var(--glowB)',
            animation: 'glowBreathe 3.4s ease-in-out infinite',
          }}
        >
          W
        </div>
        <div
          style={{
            fontSize: 21,
            fontWeight: 800,
            color: 'var(--tx)',
            letterSpacing: '-.02em',
          }}
        >
          WinNet ISP
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--yel)' }}>
          Internet Cepat Tanpa Batas
        </div>
      </div>

      <div
        style={{
          height: 112,
          flex: 'none',
          borderRadius: 18,
          border: '1px solid var(--bd)',
          background:
            'repeating-linear-gradient(115deg,var(--card) 0 11px,var(--card2) 11px 22px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          boxShadow: 'var(--sh)',
        }}
      >
        <svg width="120" height="34" viewBox="0 0 120 34" fill="none" aria-hidden>
          <circle cx="60" cy="26" r="3.4" fill="var(--blue)" />
          <path
            d="M46 22a19 19 0 0 1 28 0"
            stroke="var(--blue)"
            strokeWidth="2.6"
            strokeLinecap="round"
            opacity=".9"
          />
          <path
            d="M36 14a34 34 0 0 1 48 0"
            stroke="var(--blue)"
            strokeWidth="2.6"
            strokeLinecap="round"
            opacity=".55"
          />
          <path
            d="M26 6a49 49 0 0 1 68 0"
            stroke="var(--yel)"
            strokeWidth="2.6"
            strokeLinecap="round"
            opacity=".8"
          />
        </svg>
        <span
          className="mono"
          style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--tx2)' }}
        >
          [ ilustrasi pelanggan + fiber optic ]
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 6,
          background: 'var(--card2)',
          border: '1px solid var(--bd)',
          borderRadius: 12,
          padding: 4,
        }}
      >
        {LOGIN_METHODS.map((m) => {
          const active = m === method;
          return (
            <button
              key={m}
              type="button"
              className="tapglow"
              onClick={() => setMethod(m)}
              aria-pressed={active}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '8px 0',
                borderRadius: 9,
                fontSize: 12,
                fontWeight: active ? 700 : 600,
                background: active ? 'var(--card)' : 'transparent',
                color: active ? 'var(--blue)' : 'var(--tx2)',
                boxShadow: active ? 'var(--sh)' : 'none',
              }}
            >
              {m}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--tx2)',
              marginBottom: 6,
            }}
          >
            {method}
          </div>
          <div
            style={{
              height: 50,
              borderRadius: 13,
              border: '1.5px solid var(--blue)',
              background: 'var(--card)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 14px',
              fontSize: 14.5,
              fontWeight: 600,
              color: 'var(--tx)',
              boxShadow: 'var(--glowB)',
            }}
          >
            {IDENTIFIERS[method]}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--tx2)',
              marginBottom: 6,
            }}
          >
            Password
          </div>
          <div
            style={{
              height: 50,
              borderRadius: 13,
              border: '1px solid var(--bd)',
              background: 'var(--card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 14px',
              boxShadow: 'var(--sh)',
            }}
          >
            <span
              style={{
                fontSize: 15,
                letterSpacing: '.18em',
                color: 'var(--tx)',
              }}
            >
              {showPw ? CUSTOMER.password : '••••••••'}
            </span>
            <button
              type="button"
              onClick={togglePw}
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--blue)',
              }}
            >
              {showPw ? 'Sembunyikan' : 'Lihat'}
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12.5,
              fontWeight: 600,
              color: 'var(--tx2)',
            }}
          >
            <span
              style={{
                width: 19,
                height: 19,
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
            </span>{' '}
            Ingat saya
          </div>
          <span
            style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--blue)' }}
          >
            Lupa password?
          </span>
        </div>
      </div>

      <Tappable
        onClick={() => go('home')}
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
        Masuk
      </Tappable>

      <Tappable
        onClick={() => showToast(`Kode OTP dikirim ke ${CUSTOMER.phoneMasked}`)}
        style={{
          height: 50,
          flex: 'none',
          borderRadius: 15,
          border: '1.5px solid var(--bd)',
          color: 'var(--tx)',
          fontSize: 14,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Masuk dengan OTP
      </Tappable>

      <div
        style={{
          textAlign: 'center',
          fontSize: 12.5,
          color: 'var(--tx2)',
          fontWeight: 600,
        }}
      >
        Belum punya akun?{' '}
        <button
          type="button"
          onClick={() => go('register')}
          style={{ color: 'var(--blue)', fontWeight: 800 }}
        >
          Daftar sekarang
        </button>
      </div>
    </div>
  );
}
