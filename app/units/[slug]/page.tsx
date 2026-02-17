'use client';

import { useState, use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  FileText,
  Download,
  Wrench,
  Calendar,
  Gauge,
  Box,
  Activity,
  ShieldCheck,
  Zap,
  Cpu,
  Database,
  Lock,
  ChevronRight
} from 'lucide-react';

// --- Types ---

type SpecItem = {
  label: string;
  value: string;
  progress?: number; // 0-100 for visual bars
  icon?: React.ReactNode;
};

type DocItem = {
  title: string;
  type: string;
  size: string;
  date: string;
};

type LogItem = {
  date: string;
  title: string;
  type: 'maintenance' | 'inspection' | 'upgrade' | 'incident';
  details: string;
};

type UnitData = {
  id: string;
  slug: string;
  name: { jp: string; en: string };
  role: { jp: string; en: string }; // e.g., "CTO / CIO", "Chief Technology Officer"
  description: string;
  themeColor: string; // Tailwind class prefix for colors (e.g., 'cyan', 'blue', 'red')
  specs: SpecItem[];
  docs: DocItem[];
  logs: LogItem[];
};

// --- Helpers ---

const getThemeClasses = (color: string) => {
  const map: Record<string, {
    gradientTo: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    tabIndicator: string;
  }> = {
    cyan: {
      gradientTo: 'to-cyan-900',
      badgeBg: 'bg-cyan-500/20',
      badgeText: 'text-cyan-300',
      badgeBorder: 'border-cyan-500/30',
      tabIndicator: 'bg-cyan-500',
    },
    blue: {
      gradientTo: 'to-blue-900',
      badgeBg: 'bg-blue-500/20',
      badgeText: 'text-blue-300',
      badgeBorder: 'border-blue-500/30',
      tabIndicator: 'bg-blue-500',
    },
    red: {
      gradientTo: 'to-red-900',
      badgeBg: 'bg-red-500/20',
      badgeText: 'text-red-300',
      badgeBorder: 'border-red-500/30',
      tabIndicator: 'bg-red-500',
    },
  };
  return map[color] || map.blue;
};

// --- Mock Data ---

const UNITS: Record<string, UnitData> = {
  'serena-luxion': {
    id: 'serena-luxion',
    slug: 'serena-luxion',
    name: { jp: 'SERENA LUXION (C28)', en: 'MOBILE COMMAND CENTER' },
    role: { jp: '渡辺 直人 課長 (CTO/CIO)', en: 'CHIEF TECHNOLOGY OFFICER' },
    description: '組織全体を支える移動司令基地。ProPILOT 2.0によるハンズオフ運転と、e-POWERによる静粛かつ強力な電力供給能力を備え、あらゆる場所での指揮統制を可能にする。',
    themeColor: 'cyan',
    specs: [
      { label: 'Power Unit', value: 'e-POWER (HR14DDe-EM57)', progress: 90, icon: <Zap size={16} /> },
      { label: 'Displacement', value: '1,433cc + Motor', progress: 60, icon: <Database size={16} /> },
      { label: 'Max Power', value: '120kW (163PS)', progress: 80, icon: <Gauge size={16} /> },
      { label: 'Max Torque', value: '315N・m', progress: 85, icon: <Activity size={16} /> },
      { label: 'Drive System', value: 'FWD', progress: 50, icon: <Box size={16} /> },
      { label: 'Tech Stack', value: 'ProPILOT 2.0 / NissanConnect', progress: 95, icon: <Cpu size={16} /> },
    ],
    docs: [
      { title: 'C28_Service_Manual_v2.4.pdf', type: 'PDF', size: '12.4 MB', date: '2025.01.15' },
      { title: 'ProPILOT_2.0_Operation_Guide.pdf', type: 'PDF', size: '4.8 MB', date: '2024.11.20' },
      { title: 'Vehicle_Inspection_Certificate.pdf', type: 'PDF', size: '1.2 MB', date: '2024.04.01' },
    ],
    logs: [
      { date: '2025.02.10', title: '定期法定点検 (12ヶ月)', type: 'inspection', details: '日産プリンスにて実施。ProPILOTセンサー校正完了。異常なし。' },
      { date: '2025.01.05', title: 'システム・アップデート', type: 'upgrade', details: 'NissanConnect ナビゲーション地図データ更新 (2024-Q4版)。' },
      { date: '2024.12.20', title: '冬期装備換装', type: 'maintenance', details: 'スタッドレスタイヤへの交換 (Blizzak VRX3)。ワイパーブレード交換。' },
      { date: '2024.08.15', title: 'オイル交換・フィルタ交換', type: 'maintenance', details: '発電用エンジンのオイル交換を実施。推奨距離到達のため。' },
    ]
  },
  'gb350': {
    id: 'gb350',
    slug: 'gb350',
    name: { jp: 'GB350 (2023)', en: 'THE CLASSIC AUTHORITY' },
    role: { jp: '三重野 匠 CEO', en: 'CHIEF EXECUTIVE OFFICER' },
    description: '単気筒という名の、純粋な意志決定。空冷シングルエンジンの鼓動感と、トラディショナルなスタイリング。組織の揺るぎない基軸として、本質的な価値を体現する。',
    themeColor: 'blue',
    specs: [
      { label: 'Engine Type', value: 'Air-Cooled 4-Stroke OHC Single', progress: 40, icon: <Zap size={16} /> },
      { label: 'Displacement', value: '348cc', progress: 35, icon: <Database size={16} /> },
      { label: 'Max Power', value: '15kW (20PS) / 5,500rpm', progress: 30, icon: <Gauge size={16} /> },
      { label: 'Max Torque', value: '29N・m / 3,000rpm', progress: 40, icon: <Activity size={16} /> },
      { label: 'Weight', value: '180kg', progress: 50, icon: <Box size={16} /> },
      { label: 'Fuel Tank', value: '15L', progress: 60, icon: <ShieldCheck size={16} /> },
    ],
    docs: [
      { title: 'GB350_Owners_Manual.pdf', type: 'PDF', size: '8.5 MB', date: '2023.05.10' },
      { title: 'Parts_Catalogue_2023.pdf', type: 'PDF', size: '15.2 MB', date: '2023.05.10' },
    ],
    logs: [
      { date: '2024.11.03', title: 'チェーン清掃・注油', type: 'maintenance', details: 'DIDチェーンルブ使用。張り調整実施。' },
      { date: '2024.09.15', title: 'オイル交換 (G1)', type: 'maintenance', details: 'ホンダウルトラG1使用。ドレンワッシャー交換。' },
      { date: '2024.05.20', title: '初回点検 (1,000km)', type: 'inspection', details: 'ドリーム店にて実施。各部増し締め、異常なし。' },
    ]
  },
  'cbr400r': {
    id: 'cbr400r',
    slug: 'cbr400r',
    name: { jp: 'CBR400R (2020)', en: 'THE CORE OF OPERATIONS' },
    role: { jp: '渡辺 直人 課長 (CTO/CIO)', en: 'CHIEF TECHNOLOGY OFFICER' },
    description: '現場指揮官のための高機動二輪アセット。市街地から高速巡航までこなす並列2気筒エンジンは、あらゆる状況下での迅速な展開を可能にする。',
    themeColor: 'red',
    specs: [
      { label: 'Engine Type', value: 'Liquid-Cooled 4-Stroke DOHC Parallel Twin', progress: 70, icon: <Zap size={16} /> },
      { label: 'Displacement', value: '399cc', progress: 40, icon: <Database size={16} /> },
      { label: 'Max Power', value: '34kW (46PS) / 9,000rpm', progress: 65, icon: <Gauge size={16} /> },
      { label: 'Max Torque', value: '38N・m / 7,500rpm', progress: 55, icon: <Activity size={16} /> },
      { label: 'Weight', value: '192kg', progress: 55, icon: <Box size={16} /> },
      { label: 'Fuel Tank', value: '17L', progress: 70, icon: <ShieldCheck size={16} /> },
    ],
    docs: [
      { title: 'CBR400R_Service_Data.pdf', type: 'PDF', size: '3.2 MB', date: '2021.03.15' },
      { title: 'Custom_Parts_List.xlsx', type: 'XLSX', size: '0.5 MB', date: '2024.01.10' },
    ],
    logs: [
      { date: '2025.03.01', title: 'タイヤ交換 (前後)', type: 'maintenance', details: 'Michelin Road 6へ換装。バランス調整済み。' },
      { date: '2024.10.12', title: 'ブレーキパッド交換 (F)', type: 'maintenance', details: '純正パッド使用。フルード交換実施。' },
      { date: '2024.04.05', title: '車検整備', type: 'inspection', details: '光軸調整、排ガス検査クリア。' },
    ]
  },
  'yzf-r3': {
    id: 'yzf-r3',
    slug: 'yzf-r3',
    name: { jp: 'YZF-R3 (2025)', en: 'DEFINE THE NEXT STANDARD' },
    role: { jp: '坂井 龍之介 COO', en: 'CHIEF OPERATING OFFICER' },
    description: 'R-DNAを受け継ぐ次世代のイノベーション。高回転まで突き抜ける爽快なエンジン特性と、倒立フォークによる鋭いハンドリング。',
    themeColor: 'blue', // Yamaha Blue
    specs: [
      { label: 'Engine Type', value: 'Liquid-Cooled 4-Stroke DOHC Parallel Twin', progress: 65, icon: <Zap size={16} /> },
      { label: 'Displacement', value: '320cc', progress: 32, icon: <Database size={16} /> },
      { label: 'Max Power', value: '31kW (42PS) / 10,750rpm', progress: 60, icon: <Gauge size={16} /> },
      { label: 'Max Torque', value: '30N・m / 9,000rpm', progress: 45, icon: <Activity size={16} /> },
      { label: 'Weight', value: '169kg', progress: 45, icon: <Box size={16} /> },
      { label: 'Suspension', value: 'KYB Inverted Forks', progress: 80, icon: <ShieldCheck size={16} /> },
    ],
    docs: [
      { title: 'YZF-R3_Setup_Guide.pdf', type: 'PDF', size: '5.1 MB', date: '2025.02.01' },
    ],
    logs: [
      { date: '2025.02.15', title: '納車整備', type: 'inspection', details: 'YSPにて実施。各部チェック完了。' },
      { date: '2025.02.15', title: 'コーティング施工', type: 'maintenance', details: 'CR-1ガラスコーティング施工。' },
    ]
  },
  'cbr600rr-monkey125': {
    id: 'cbr600rr-monkey125',
    slug: 'cbr600rr-monkey125',
    name: { jp: 'CBR600RR & Monkey 125', en: 'SPEED & AGILITY / DUAL PLATFORM' },
    role: { jp: '末森 知輝 CMO', en: 'CHIEF MARKETING OFFICER' },
    description: '圧倒的な加速力を誇るスーパースポーツと、機動力を極めたマイクロ・モビリティ。相反する二つの特性を使い分け、あらゆるフィールドを制圧する。',
    themeColor: 'red',
    specs: [
      { label: 'Engine (CBR)', value: 'Liquid-Cooled 4-Stroke DOHC Inline-4', progress: 95, icon: <Zap size={16} /> },
      { label: 'Displacement (CBR)', value: '599cc', progress: 60, icon: <Database size={16} /> },
      { label: 'Max Power (CBR)', value: '89kW (121PS) / 14,000rpm', progress: 95, icon: <Gauge size={16} /> },
      { label: 'Engine (Monkey)', value: 'Air-Cooled 4-Stroke OHC Single', progress: 20, icon: <Zap size={16} /> },
      { label: 'Displacement (Monkey)', value: '124cc', progress: 12, icon: <Database size={16} /> },
      { label: 'Weight Combined', value: '194kg + 104kg', progress: 80, icon: <Box size={16} /> },
    ],
    docs: [
      { title: 'CBR600RR_Track_Manual.pdf', type: 'PDF', size: '18.4 MB', date: '2020.09.25' },
      { title: 'Monkey125_Custom_Guide.pdf', type: 'PDF', size: '6.2 MB', date: '2021.05.10' },
    ],
    logs: [
      { date: '2024.11.20', title: 'CBR: オイル交換 (G3)', type: 'maintenance', details: 'サーキット走行前メンテナンス。' },
      { date: '2024.10.05', title: 'Monkey: タイヤ交換', type: 'maintenance', details: 'ブロックタイヤへ換装。' },
      { date: '2024.06.12', title: 'CBR: 12ヶ月点検', type: 'inspection', details: 'ドリーム店にて実施。消耗品チェック。' },
    ]
  }
};

// --- Components ---

function ProgressBar({ value, color }: { value: number; color: string }) {
  // Map themeColor to actual tailwind colors for the bar
  const getColorClass = (c: string) => {
    switch(c) {
      case 'cyan': return 'bg-cyan-500';
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mt-2">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${getColorClass(color)}`}
      />
    </div>
  );
}

function SpecCard({ spec, color }: { spec: SpecItem; color: string }) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400 text-xs font-bold tracking-wider uppercase">
        {spec.icon}
        {spec.label}
      </div>
      <div className="text-lg md:text-xl font-bold text-mieno-navy dark:text-white mb-1">
        {spec.value}
      </div>
      {spec.progress !== undefined && (
        <ProgressBar value={spec.progress} color={color} />
      )}
    </div>
  );
}

function DocCard({ doc }: { doc: DocItem }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 group cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-200 dark:bg-white/10 rounded-lg text-mieno-navy dark:text-white">
          <FileText size={24} />
        </div>
        <div>
          <h4 className="font-bold text-sm md:text-base text-mieno-navy dark:text-white group-hover:underline decoration-1 underline-offset-4">
            {doc.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1 flex gap-2">
            <span>{doc.type}</span>
            <span>•</span>
            <span>{doc.size}</span>
            <span>•</span>
            <span>{doc.date}</span>
          </p>
        </div>
      </div>
      <div className="text-gray-400 group-hover:text-mieno-navy dark:group-hover:text-white transition-colors">
        <Download size={20} />
      </div>
    </div>
  );
}

function LogItemView({ log, index, isLast }: { log: LogItem; index: number; isLast: boolean }) {
  const getIcon = (type: LogItem['type']) => {
    switch(type) {
      case 'maintenance': return <Wrench size={16} />;
      case 'inspection': return <ShieldCheck size={16} />;
      case 'upgrade': return <Zap size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getColor = (type: LogItem['type']) => {
    switch(type) {
      case 'maintenance': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'inspection': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'upgrade': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="relative pl-8 md:pl-10 py-2">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-[11px] md:left-[13px] top-8 bottom-0 w-[2px] bg-gray-200 dark:bg-white/10" />
      )}

      {/* Timeline Dot */}
      <div className={`absolute left-0 top-3 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center border-2 border-white dark:border-black shadow-sm ${getColor(log.type)}`}>
        {getIcon(log.type)}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-1">
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Calendar size={12} />
            {log.date}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit ${getColor(log.type)}`}>
            {log.type}
          </span>
        </div>
        <h4 className="font-bold text-mieno-navy dark:text-white mb-1">
          {log.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {log.details}
        </p>
      </div>
    </div>
  );
}

// --- Main Page Component ---

export default function UnitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap params using React.use()
  const { slug } = use(params);
  const unit = UNITS[slug];

  if (!unit) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState<'specs' | 'docs' | 'logs'>('specs');
  const themeClasses = getThemeClasses(unit.themeColor);

  const tabs = [
    { id: 'specs', label: '機体仕様', sub: 'SPECS' },
    { id: 'docs', label: 'マニュアル・書類', sub: 'DOCUMENTS' },
    { id: 'logs', label: '整備・運用履歴', sub: 'MAINTENANCE LOG' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">

      {/* --- Header Section --- */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden bg-mieno-navy">
        {/* Placeholder Gradient/Image */}
        <div className={`absolute inset-0 bg-gradient-to-br from-mieno-navy via-black ${themeClasses.gradientTo} opacity-80`} />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 pb-16 container mx-auto">
          <Link
            href="/units"
            className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors w-fit mb-6"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium tracking-wider">機動戦力一覧へ戻る</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${themeClasses.badgeBg} ${themeClasses.badgeText} border ${themeClasses.badgeBorder} text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-md`}>
              <ShieldCheck size={14} />
              {unit.role.en}
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2">
              {unit.name.jp}
            </h1>
            <p className="text-white/60 text-lg md:text-xl font-light tracking-widest font-mono uppercase">
              {unit.name.en}
            </p>
          </motion.div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-10">

        {/* Unit Description Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-[#0a0a0a] p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Unit Overview</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {unit.description}
              </p>
            </div>
            <div className="w-full md:w-auto flex flex-row md:flex-col gap-4">
               <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase">Operator</span>
                  <span className="font-medium text-mieno-navy dark:text-white">{unit.role.jp}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase">Status</span>
                  <span className="font-medium text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    OPERATIONAL
                  </span>
               </div>
            </div>
          </div>
        </motion.div>

        {/* --- Tabs Navigation --- */}
        <div className="flex overflow-x-auto pb-2 mb-6 gap-2 no-scrollbar border-b border-gray-200 dark:border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3 min-w-fit rounded-t-lg transition-colors flex flex-col items-center ${
                activeTab === tab.id
                  ? 'text-mieno-navy dark:text-white'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <span className="font-bold text-sm md:text-base whitespace-nowrap">{tab.label}</span>
              <span className="text-[10px] font-mono tracking-wider uppercase opacity-70">{tab.sub}</span>

              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${themeClasses.tabIndicator}`}
                />
              )}
            </button>
          ))}
        </div>

        {/* --- Tab Content --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unit.specs.map((spec, index) => (
                  <SpecCard key={index} spec={spec} color={unit.themeColor} />
                ))}
              </div>
            )}

            {activeTab === 'docs' && (
              <div className="space-y-3">
                {unit.docs.map((doc, index) => (
                  <DocCard key={index} doc={doc} />
                ))}
                {unit.docs.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No documents available for this unit.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-white/10">
                {unit.logs.map((log, index) => (
                  <LogItemView
                    key={index}
                    log={log}
                    index={index}
                    isLast={index === unit.logs.length - 1}
                  />
                ))}
                {unit.logs.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No maintenance logs recorded.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
