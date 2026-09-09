export const NETWORK_CHAIN = [
  {
    name: 'Internet Backbone',
    note: 'Upstream WinNet Core · Jakarta',
  },
  {
    name: 'OLT — BDG-CIH-01',
    note: 'Port 4/12 · sinyal -18.2 dBm',
  },
  {
    name: 'ODP — BDG-042',
    note: 'Jl. Cihampelas · 6 pelanggan',
  },
  {
    name: 'Pelanggan — ONT Anda',
    note: 'ZTE F670L · 6 perangkat',
  },
];

/** Live metrics; the speed reading is interpolated from the live meter. */
export function statusMetrics(speed: number) {
  return [
    { label: 'UPTIME', v: '12j 24m', c: 'var(--ok)' },
    { label: 'KECEPATAN', v: `${speed.toFixed(1)} Mbps`, c: 'var(--blue)' },
    { label: 'LATENCY', v: '12 ms', c: 'var(--ok)' },
    { label: 'PACKET LOSS', v: '0.0 %', c: 'var(--ok)' },
    { label: 'IP ADDRESS', v: '103.94.12.88', c: 'var(--tx)' },
    { label: 'PERANGKAT', v: '6 terhubung', c: 'var(--tx)' },
  ];
}

export const OUTAGE = {
  title: 'Sedang terjadi gangguan jaringan',
  area: 'ODP-BDG-042',
  eta: '14:30 WIB',
};

export const UPTIME = '12j 24m';
