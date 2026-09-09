import { Card, ProgressRing, StatLabel } from '../components/primitives';
import { PLAN } from '../data/customer';
import {
  BREAKDOWN,
  DAILY_BARS,
  PEAK_DAY,
  PERIODS,
  USAGE_STATS,
} from '../data/usage';
import { useApp } from '../state/AppContext';

export function UsageScreen() {
  const { period, setPeriod } = useApp();
  const percent = Math.round(PLAN.usedFraction * 100);

  return (
    <div
      className="rise"
      style={{ display: 'flex', flexDirection: 'column', gap: 13 }}
    >
      {/* period selector */}
      <div style={{ display: 'flex', gap: 7 }}>
        {PERIODS.map((p) => {
          const on = p === period;
          return (
            <button
              key={p}
              type="button"
              className="tapglow"
              onClick={() => setPeriod(p)}
              aria-pressed={on}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '9px 0',
                borderRadius: 11,
                fontSize: 11.5,
                fontWeight: 700,
                color: on ? '#fff' : 'var(--tx2)',
                background: on ? 'var(--blue)' : 'var(--card)',
                border: `1px solid ${on ? 'var(--blue)' : 'var(--bd)'}`,
                boxShadow: on ? 'var(--glowB)' : 'none',
              }}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* quota ring */}
      <Card
        radius={20}
        pad={20}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', width: 190, height: 190 }}>
          <ProgressRing
            size={190}
            box={200}
            r={82}
            sw={18}
            fraction={PLAN.usedFraction}
            blur={10}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: 'var(--tx)',
                letterSpacing: '-.04em',
              }}
            >
              12.5 <span style={{ fontSize: 17 }}>GB</span>
            </div>
            <div
              style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--tx2)' }}
            >
              dari {PLAN.quotaTotal}
            </div>
            <div
              style={{
                marginTop: 6,
                padding: '4px 10px',
                borderRadius: 99,
                background: 'var(--oks)',
                color: 'var(--ok)',
                fontSize: 11,
                fontWeight: 800,
              }}
            >
              {percent}% terpakai
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 10,
            width: '100%',
            marginTop: 16,
          }}
        >
          {BREAKDOWN.map((b) => (
            <div
              key={b.label}
              style={{
                background: 'var(--card2)',
                border: '1px solid var(--bd)',
                borderRadius: 14,
                padding: 11,
                textAlign: 'center',
              }}
            >
              <StatLabel>{b.label}</StatLabel>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: b.c,
                  marginTop: 3,
                }}
              >
                {b.v}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* daily chart */}
      <Card radius={20} pad={16}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <div
            style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--tx)' }}
          >
            Pemakaian Harian
          </div>
          <div
            style={{
              display: 'flex',
              gap: 11,
              fontSize: 10.5,
              fontWeight: 700,
              color: 'var(--tx2)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 3,
                  background: 'var(--blue)',
                  display: 'block',
                }}
              />
              Download
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 3,
                  background: 'var(--yel)',
                  display: 'block',
                }}
              />
              Upload
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 9,
            height: 132,
          }}
        >
          {DAILY_BARS.map((bar) => {
            const peak = bar.d === PEAK_DAY;
            return (
              <div
                key={bar.d}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  height: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    gap: 3,
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      height: `${bar.up}%`,
                      borderRadius: 5,
                      background: 'var(--yel)',
                      boxShadow: peak ? 'var(--glowY)' : 'none',
                    }}
                  />
                  <div
                    style={{
                      height: `${bar.down}%`,
                      borderRadius: 5,
                      background: 'var(--blue)',
                      boxShadow: peak ? 'var(--glowB)' : 'none',
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: peak ? 'var(--blue)' : 'var(--tx2)',
                  }}
                >
                  {bar.d}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* summary stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 11,
        }}
      >
        {USAGE_STATS.map((s) => (
          <Card key={s.label} radius={16} pad={13}>
            <StatLabel>{s.label}</StatLabel>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: 'var(--tx)',
                marginTop: 4,
                letterSpacing: '-.02em',
              }}
            >
              {s.v}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: s.c }}>
              {s.note}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
