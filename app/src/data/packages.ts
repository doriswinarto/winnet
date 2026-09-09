export interface PackageTier {
  speed: number;
  price: string;
  note: string;
  /** The customer's currently active package. */
  current?: boolean;
  popular?: boolean;
}

export const BENEFITS = [
  'Unlimited Internet',
  'Fiber Optic',
  'Support 24/7',
  'Gratis ONT',
  'Koneksi Stabil',
];

export const PACKAGES: PackageTier[] = [
  {
    speed: 20,
    price: 'Rp110.000',
    note: 'Cocok 1–2 perangkat, browsing & sosmed',
  },
  {
    speed: 30,
    price: 'Rp150.000',
    note: 'Streaming HD lancar untuk keluarga kecil',
  },
  {
    speed: 50,
    price: 'Rp165.000',
    note: 'Paket aktif Anda · streaming 4K + WFH',
    current: true,
  },
  {
    speed: 100,
    price: 'Rp225.000',
    note: 'Gaming, WFH, dan 4K bersamaan',
    popular: true,
  },
  {
    speed: 200,
    price: 'Rp290.000',
    note: 'Rumah besar, 15+ perangkat aktif',
  },
];
