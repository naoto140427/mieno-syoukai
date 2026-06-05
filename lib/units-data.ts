// 比較・詳細ページ共通の車両モックデータ

export type CompareSpec = {
  label: string;
  value: string;
  numericValue?: number; // 比較バー用 (0-100 normalized)
};

export type CompareUnit = {
  slug: string;
  name: string;
  nameEn: string;
  role: string;
  themeColor: 'cyan' | 'blue' | 'red';
  imageUrl?: string;
  displacement: string;
  powerKw: number;     // kW (比較用)
  torqueNm: number;    // N・m (比較用)
  weightKg: number;    // kg (比較用、軽いほど高スコア)
  tankL: number;       // L (比較用)
  specs: CompareSpec[];
};

export const COMPARE_UNITS: CompareUnit[] = [
  {
    slug: 'cbr600rr',
    name: 'CBR600RR',
    nameEn: 'SPEED & AGILITY',
    role: '末森 知輝 CMO',
    themeColor: 'red',
    displacement: '599cc',
    powerKw: 89,
    torqueNm: 64,
    weightKg: 194,
    tankL: 18,
    specs: [
      { label: 'Engine',      value: 'Liquid-Cooled DOHC Inline-4' },
      { label: 'Displacement',value: '599cc',                numericValue: 60 },
      { label: 'Max Power',   value: '89kW (121PS)',         numericValue: 99 },
      { label: 'Max Torque',  value: '64N·m / 11,500rpm',   numericValue: 75 },
      { label: 'Weight',      value: '194kg',                numericValue: 45 },
      { label: 'Fuel Tank',   value: '18L',                  numericValue: 75 },
    ],
  },
  {
    slug: 'yzf-r3',
    name: 'YZF-R3',
    nameEn: 'NEXT STANDARD',
    role: '坂井 龍之介 COO',
    themeColor: 'blue',
    displacement: '320cc',
    powerKw: 31,
    torqueNm: 30,
    weightKg: 169,
    tankL: 14,
    specs: [
      { label: 'Engine',      value: 'Liquid-Cooled DOHC Parallel Twin' },
      { label: 'Displacement',value: '320cc',                numericValue: 32 },
      { label: 'Max Power',   value: '31kW (42PS)',          numericValue: 40 },
      { label: 'Max Torque',  value: '30N·m / 9,000rpm',    numericValue: 35 },
      { label: 'Weight',      value: '169kg',                numericValue: 70 },
      { label: 'Fuel Tank',   value: '14L',                  numericValue: 58 },
    ],
  },
  {
    slug: 'cbr400r',
    name: 'CBR400R',
    nameEn: 'CORE OF OPERATIONS',
    role: '渡辺 直人 CTO',
    themeColor: 'red',
    displacement: '399cc',
    powerKw: 34,
    torqueNm: 38,
    weightKg: 192,
    tankL: 17,
    specs: [
      { label: 'Engine',      value: 'Liquid-Cooled DOHC Parallel Twin' },
      { label: 'Displacement',value: '399cc',                numericValue: 40 },
      { label: 'Max Power',   value: '34kW (46PS)',          numericValue: 44 },
      { label: 'Max Torque',  value: '38N·m / 7,500rpm',    numericValue: 45 },
      { label: 'Weight',      value: '192kg',                numericValue: 46 },
      { label: 'Fuel Tank',   value: '17L',                  numericValue: 70 },
    ],
  },
  {
    slug: 'gb350',
    name: 'GB350',
    nameEn: 'CLASSIC AUTHORITY',
    role: '三重野 匠 CEO',
    themeColor: 'blue',
    displacement: '348cc',
    powerKw: 15,
    torqueNm: 29,
    weightKg: 180,
    tankL: 15,
    specs: [
      { label: 'Engine',      value: 'Air-Cooled OHC Single' },
      { label: 'Displacement',value: '348cc',                numericValue: 35 },
      { label: 'Max Power',   value: '15kW (20PS)',          numericValue: 18 },
      { label: 'Max Torque',  value: '29N·m / 3,000rpm',    numericValue: 34 },
      { label: 'Weight',      value: '180kg',                numericValue: 55 },
      { label: 'Fuel Tank',   value: '15L',                  numericValue: 62 },
    ],
  },
  {
    slug: 'monkey125',
    name: 'Monkey 125',
    nameEn: 'LAST MILE PIONEER',
    role: '末森 知輝 CMO',
    themeColor: 'red',
    displacement: '124cc',
    powerKw: 6.9,
    torqueNm: 11,
    weightKg: 104,
    tankL: 5.6,
    specs: [
      { label: 'Engine',      value: 'Air-Cooled OHC Single' },
      { label: 'Displacement',value: '124cc',                numericValue: 12 },
      { label: 'Max Power',   value: '6.9kW (9.4PS)',        numericValue: 8  },
      { label: 'Max Torque',  value: '11N·m / 5,500rpm',    numericValue: 13 },
      { label: 'Weight',      value: '104kg',                numericValue: 95 },
      { label: 'Fuel Tank',   value: '5.6L',                 numericValue: 23 },
    ],
  },
  {
    slug: 'serena-luxion',
    name: 'SERENA LUXION',
    nameEn: 'MOBILE COMMAND',
    role: '渡辺 直人 CTO',
    themeColor: 'cyan',
    displacement: '1,433cc',
    powerKw: 120,
    torqueNm: 315,
    weightKg: 1990,
    tankL: 60,
    specs: [
      { label: 'Engine',      value: 'e-POWER (HR14DDe-EM57)' },
      { label: 'Displacement',value: '1,433cc + Motor',      numericValue: 100 },
      { label: 'Max Power',   value: '120kW (163PS)',         numericValue: 100 },
      { label: 'Max Torque',  value: '315N·m',               numericValue: 100 },
      { label: 'Weight',      value: '1,990kg',              numericValue: 2   },
      { label: 'Fuel Tank',   value: '60L相当',              numericValue: 100 },
    ],
  },
];

export const THEME_COLORS = {
  cyan: {
    bg: 'bg-cyan-500', light: 'bg-cyan-50', border: 'border-cyan-200',
    text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-700',
    gradient: 'from-cyan-400 to-cyan-600',
  },
  blue: {
    bg: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-200',
    text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700',
    gradient: 'from-blue-400 to-blue-600',
  },
  red: {
    bg: 'bg-red-500', light: 'bg-red-50', border: 'border-red-200',
    text: 'text-red-700', badge: 'bg-red-100 text-red-700',
    gradient: 'from-red-400 to-red-600',
  },
};
