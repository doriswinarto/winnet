import { useEffect, useRef, useState } from 'react';
import { Tappable } from '../components/primitives';
import { BffError, sendOtp, verifyOtp } from '../api/bff';
import { usePortal } from '../api/PortalContext';
import { useApp } from '../state/AppContext';

/**
 * The panel authenticates with a WhatsApp OTP and an optional "ingat saya"
 * token — there is no password endpoint, so the design's password field has
 * nothing behind it and is replaced by the code step. Everything else keeps
 * the design's layout: same logo block, illustration panel, tab switcher and
 * button stack.
 */

type IdentifierKind = 'Customer ID' | 'Email' | 'No. HP';

const KINDS: IdentifierKind[] = ['Customer ID', 'Email', 'No. HP'];

const PLACEHOLDER: Record<IdentifierKind, string> = {
  'Customer ID': 'WN-0000-0000',
  Email: 'nama@email.com',
  'No. HP': '08xx xxxx xxxx',
};

const INPUT_MODE: Record<IdentifierKind, 'text' | 'email' | 'tel'> = {
  'Customer ID': 'text',
  Email: 'email',
  'No. HP': 'tel',
};

/** Provisional: the panel's OTP length is not documented. */
const OTP_LENGTH = 6;

export function LoginScreen() {
  const { go, showToast } = useApp();
  const { settings, signIn } = usePortal();

  const [kind, setKind] = useState<IdentifierKind>('Customer ID');
  const [identifier, setIdentifier] = useState('');
  const [ingatSaya, setIngatSaya] = useState(true);
  const [step, setStep] = useState<'identifier' | 'code'>('identifier');
  const [code, setCode] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const codeInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  useEffect(() => {
    if (step === 'code') codeInput.current?.focus();
  }, [step]);

  async function kirimKode() {
    if (busy || !identifier.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await sendOtp({ identifier: identifier.trim() });
      setSentTo(res.sentTo);
      setCooldown(res.retryAfter);
      setStep('code');
      setCode('');
      showToast(`Kode OTP dikirim ke ${res.sentTo}`);
    } catch (err) {
      setError(
        err instanceof BffError ? err.message : 'Gagal mengirim kode OTP.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function verifikasi(value: string) {
    if (busy || value.length < 4) return;
    setBusy(true);
    setError(null);
    try {
      await verifyOtp({
        identifier: identifier.trim(),
        code: value,
        ingatSaya,
      });
      signIn();
      go('home');
    } catch (err) {
      setError(err instanceof BffError ? err.message : 'Verifikasi gagal.');
      setCode('');
      codeInput.current?.focus();
    } finally {
      setBusy(false);
    }
  }

  const label = step === 'identifier' ? kind : 'Kode OTP';

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
            overflow: 'hidden',
          }}
        >
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            settings.companyName.slice(0, 1).toUpperCase()
          )}
        </div>
        <div
          style={{
            fontSize: 21,
            fontWeight: 800,
            color: 'var(--tx)',
            letterSpacing: '-.02em',
          }}
        >
          {settings.companyName}
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--yel)' }}>
          {settings.tagline}
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
          {step === 'identifier'
            ? '[ masuk dengan kode OTP WhatsApp ]'
            : `[ kode dikirim ke ${sentTo} ]`}
        </span>
      </div>

      {step === 'identifier' && (
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
          {KINDS.map((k) => {
            const active = k === kind;
            return (
              <button
                key={k}
                type="button"
                className="tapglow"
                onClick={() => {
                  setKind(k);
                  setIdentifier('');
                }}
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
                {k}
              </button>
            );
          })}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step === 'identifier') void kirimKode();
          else void verifikasi(code);
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 11 }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--tx2)',
              marginBottom: 6,
            }}
          >
            {label}
          </div>

          {step === 'identifier' ? (
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={PLACEHOLDER[kind]}
              inputMode={INPUT_MODE[kind]}
              autoComplete="username"
              aria-label={kind}
              style={{
                width: '100%',
                height: 50,
                borderRadius: 13,
                border: '1.5px solid var(--blue)',
                background: 'var(--card)',
                padding: '0 14px',
                fontSize: 14.5,
                fontWeight: 600,
                fontFamily: 'inherit',
                color: 'var(--tx)',
                boxShadow: 'var(--glowB)',
                outline: 'none',
              }}
            />
          ) : (
            <div style={{ position: 'relative' }}>
              <input
                ref={codeInput}
                value={code}
                onChange={(e) => {
                  const next = e.target.value
                    .replace(/\D/g, '')
                    .slice(0, OTP_LENGTH);
                  setCode(next);
                  if (next.length === OTP_LENGTH) void verifikasi(next);
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                aria-label="Kode OTP"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  border: 0,
                  // Keeps the caret off-screen while the boxes below show state.
                  color: 'transparent',
                  background: 'transparent',
                }}
              />
              <div
                style={{ display: 'flex', justifyContent: 'center', gap: 9 }}
                aria-hidden
              >
                {Array.from({ length: OTP_LENGTH }, (_, i) => {
                  const ch = code[i] ?? '';
                  const filled = ch !== '';
                  const cursor = i === code.length;
                  return (
                    <div
                      key={i}
                      style={{
                        width: 46,
                        height: 54,
                        borderRadius: 13,
                        border: `1.5px solid ${
                          filled || cursor ? 'var(--blue)' : 'var(--bd)'
                        }`,
                        background: 'var(--card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        fontWeight: 800,
                        color: 'var(--tx)',
                        boxShadow: filled || cursor ? 'var(--glowB)' : 'none',
                      }}
                    >
                      {ch}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div
            role="alert"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--dang)',
              lineHeight: 1.4,
            }}
          >
            {error}
          </div>
        )}

        {step === 'identifier' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <button
              type="button"
              onClick={() => setIngatSaya((v) => !v)}
              role="switch"
              aria-checked={ingatSaya}
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
                  background: ingatSaya ? 'var(--blue)' : 'transparent',
                  border: ingatSaya ? 'none' : '1.5px solid var(--bd)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 800,
                  boxShadow: ingatSaya ? 'var(--glowB)' : 'none',
                }}
              >
                {ingatSaya ? '✓' : ''}
              </span>{' '}
              Ingat saya
            </button>
            <span
              style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--tx2)' }}
            >
              Kode via WhatsApp
            </span>
          </div>
        )}

        <Tappable
          type="submit"
          disabled={
            busy ||
            (step === 'identifier' ? !identifier.trim() : code.length < 4)
          }
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
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy
            ? 'Memproses…'
            : step === 'identifier'
              ? 'Kirim Kode OTP'
              : 'Verifikasi & Masuk'}
        </Tappable>
      </form>

      {step === 'code' && (
        <>
          <Tappable
            onClick={() => void kirimKode()}
            disabled={cooldown > 0 || busy}
            style={{
              height: 50,
              flex: 'none',
              borderRadius: 15,
              border: '1.5px solid var(--bd)',
              color: cooldown > 0 ? 'var(--tx2)' : 'var(--tx)',
              fontSize: 14,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {cooldown > 0 ? `Kirim ulang dalam ${cooldown}s` : 'Kirim ulang kode'}
          </Tappable>
          <div
            style={{
              textAlign: 'center',
              fontSize: 12.5,
              color: 'var(--tx2)',
              fontWeight: 600,
            }}
          >
            <button
              type="button"
              onClick={() => {
                setStep('identifier');
                setError(null);
              }}
              style={{ color: 'var(--blue)', fontWeight: 800 }}
            >
              Ganti nomor atau ID
            </button>
          </div>
        </>
      )}

      {step === 'identifier' && (
        <div
          style={{
            textAlign: 'center',
            fontSize: 12.5,
            color: 'var(--tx2)',
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          Belum jadi pelanggan?{' '}
          <button
            type="button"
            onClick={() => go('register')}
            style={{ color: 'var(--blue)', fontWeight: 800 }}
          >
            Daftar sekarang
          </button>
        </div>
      )}
    </div>
  );
}
