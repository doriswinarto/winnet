import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import type { BadgeStatus } from '../types';

/* ------------------------------------------------------------------ card */

interface CardProps {
  radius?: number;
  pad?: number | string;
  style?: CSSProperties;
  children: ReactNode;
}

export function Card({ radius = 18, pad = 15, style, children }: CardProps) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--bd)',
        borderRadius: radius,
        padding: pad,
        boxShadow: 'var(--sh)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* --------------------------------------------------------------- tappable */

type TappableProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  style?: CSSProperties;
};

/** A press-glow surface. Renders a real button so it is keyboard reachable. */
export function Tappable({ style, children, ...rest }: TappableProps) {
  return (
    <button
      type="button"
      className="tapglow"
      style={{ display: 'block', width: '100%', ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ dots */

interface DotProps {
  color: string;
  size?: number;
  /** Seconds for one pulse cycle. */
  speed?: number;
  glow?: string;
  style?: CSSProperties;
}

/** The pulsing status dot — `color` doubles as `currentColor` for the ring. */
export function PulseDot({
  color,
  size = 9,
  speed = 1.6,
  glow,
  style,
}: DotProps) {
  return (
    <span
      style={{
        width: size,
        height: size,
        flex: 'none',
        borderRadius: 99,
        background: color,
        color,
        boxShadow: glow,
        animation: `pulseDot ${speed}s infinite`,
        display: 'block',
        ...style,
      }}
    />
  );
}

/* ----------------------------------------------------------------- badge */

const BADGE_COLORS: Record<BadgeStatus, [string, string, string]> = {
  Lunas: ['var(--ok)', 'var(--oks)', 'var(--glowG)'],
  Pending: ['var(--warn)', 'var(--yels)', 'var(--glowY)'],
  Expired: ['var(--dang)', 'var(--dangs)', 'none'],
  Terbuka: ['var(--blue)', 'var(--blues)', 'var(--glowB)'],
  Diproses: ['var(--warn)', 'var(--yels)', 'var(--glowY)'],
  Selesai: ['var(--ok)', 'var(--oks)', 'var(--glowG)'],
};

export function Badge({
  status,
  size = 10.5,
  pad = '5px 10px',
}: {
  status: BadgeStatus;
  size?: number;
  pad?: string;
}) {
  const [c, bg, sh] = BADGE_COLORS[status];
  return (
    <span
      style={{
        flex: 'none',
        padding: pad,
        borderRadius: 99,
        fontSize: size,
        fontWeight: 800,
        color: c,
        background: bg,
        boxShadow: sh,
      }}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ chip */

export function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="tapglow"
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: '8px 12px',
        borderRadius: 99,
        fontSize: 11.5,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        color: active ? '#fff' : 'var(--tx2)',
        background: active ? 'var(--blue)' : 'var(--card)',
        border: `1px solid ${active ? 'var(--blue)' : 'var(--bd)'}`,
        boxShadow: active ? 'var(--glowB)' : 'none',
      }}
    >
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ ring */

interface RingProps {
  /** Rendered size in px. */
  size: number;
  /** Coordinate space (square). */
  box: number;
  r: number;
  sw: number;
  /** 0–1. */
  fraction: number;
  blur: number;
}

/** Circular progress ring, drawn from 12 o'clock. */
export function ProgressRing({ size, box, r, sw, fraction, blur }: RingProps) {
  const c = 2 * Math.PI * r;
  const mid = box / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${box} ${box}`} aria-hidden>
      <circle
        cx={mid}
        cy={mid}
        r={r}
        stroke="var(--ring)"
        strokeWidth={sw}
        fill="none"
      />
      <circle
        cx={mid}
        cy={mid}
        r={r}
        stroke="var(--blue)"
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - fraction)}
        transform={`rotate(-90 ${mid} ${mid})`}
        style={{ filter: `drop-shadow(0 0 ${blur}px var(--blue))` }}
      />
    </svg>
  );
}

/* ----------------------------------------------------------------- gauge */

const GAUGE_R = 72;

/** Half-circle live speed meter (0–100 Mbps). */
export function SpeedGauge({ value }: { value: number }) {
  const half = Math.PI * GAUGE_R;
  const full = 2 * Math.PI * GAUGE_R;
  const dash = `${half} ${full}`;
  const offset = half * (1 - Math.min(value, 100) / 100);
  return (
    <svg
      width="150"
      height="94"
      viewBox="0 0 200 130"
      role="img"
      aria-label={`Kecepatan ${value.toFixed(1)} Mbps dari 100 Mbps`}
    >
      <circle
        cx="100"
        cy="100"
        r={GAUGE_R}
        stroke="rgba(255,255,255,.22)"
        strokeWidth="14"
        fill="none"
        strokeDasharray={dash}
        transform="rotate(-180 100 100)"
      />
      <circle
        cx="100"
        cy="100"
        r={GAUGE_R}
        stroke="#FFD24A"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={dash}
        strokeDashoffset={offset}
        transform="rotate(-180 100 100)"
        style={{
          filter: 'drop-shadow(0 0 8px #FFD24A)',
          transition: 'stroke-dashoffset .9s ease',
        }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------ fiber line */

/** Horizontal fiber run with data flowing left to right. */
export function FiberLine() {
  return (
    <svg
      width="330"
      height="26"
      viewBox="0 0 330 26"
      fill="none"
      style={{ marginTop: 6, maxWidth: '100%' }}
      aria-hidden
    >
      <path
        d="M0 13h330"
        stroke="rgba(255,255,255,.28)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M0 13h330"
        stroke="#FFD24A"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="14 30"
        style={{ animation: 'flow 1.1s linear infinite' }}
      />
      <circle cx="6" cy="13" r="4" fill="#fff" />
      <circle cx="324" cy="13" r="4" fill="#FFD24A" />
    </svg>
  );
}

/** Vertical connector between two network-chain hops. */
export function FiberDrop() {
  return (
    <svg
      width="4"
      height="26"
      viewBox="0 0 4 26"
      style={{ marginLeft: 4 }}
      aria-hidden
    >
      <path d="M2 0v26" stroke="var(--ring)" strokeWidth="3" />
      <path
        d="M2 0v26"
        stroke="var(--ok)"
        strokeWidth="3"
        strokeDasharray="6 14"
        style={{ animation: 'flow 1.2s linear infinite' }}
      />
    </svg>
  );
}

/* ----------------------------------------------------------------- misc */

export function SectionTitle({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        fontSize: 14,
        fontWeight: 800,
        color: 'var(--tx)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Small all-caps label used above every stat value. */
export function StatLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10.5,
        fontWeight: 800,
        color: 'var(--tx2)',
        letterSpacing: '.06em',
      }}
    >
      {children}
    </div>
  );
}

/** The rounded icon tile that fronts quick actions and notifications. */
export function IconTile({
  size,
  radius,
  bg,
  fg,
  dot,
  dotRadius,
  glow,
}: {
  size: number;
  radius: number;
  bg: string;
  fg: string;
  dot: number;
  dotRadius: string;
  glow?: string;
}) {
  return (
    <span
      style={{
        width: size,
        height: size,
        flex: 'none',
        borderRadius: radius,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: glow,
      }}
    >
      <span
        style={{
          width: dot,
          height: dot,
          borderRadius: dotRadius,
          background: fg,
          display: 'block',
        }}
      />
    </span>
  );
}
