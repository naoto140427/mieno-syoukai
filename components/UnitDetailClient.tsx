'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { m, AnimatePresence } from 'framer-motion';
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
  Edit2,
  Save,
  X,
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
  Link2,
} from 'lucide-react';
import { Unit } from '@/types/database';
import { updateUnit, addMaintenanceLog, deleteMaintenanceLog } from '@/app/actions/units';
import { notFound } from 'next/navigation';
import ClientMotionWrapper from '@/components/ClientMotionWrapper';

// --- Types ---

type SpecItem = {
  label: string;
  value: string;
  progress?: number;
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
  cost?: number;
  id?: number;
};

type UnitData = {
  id: string | number;
  slug: string;
  name: { jp: string; en: string };
  role: { jp: string; en: string };
  description: string;
  themeColor: string;
  specs: SpecItem[];
  docs: DocItem[];
  logs: LogItem[];
};

type ToastState = { show: boolean; message: string; type: 'success' | 'error' };

// --- Toast Component ---

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <m.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 bg-white/95 backdrop-blur-xl shadow-2xl rounded-full border border-gray-100 max-w-[90vw]"
    >
      <div className={`p-1 rounded-full ${type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      </div>
      <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">{message}</span>
    </m.div>
  );
}

// --- Confirm Modal ---

function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isPending,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm"
          onClick={onCancel}
        >
          <m.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-5">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-7">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={onConfirm}
                disabled={isPending}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                削除する
              </button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

// --- Helpers ---

const getAccentColor = (color: string) => {
  const map: Record<string, { dot: string; badge: string; badgeText: string; bar: string; tab: string }> = {
    cyan:  { dot: 'bg-cyan-400',  badge: 'bg-cyan-50 border-cyan-200',  badgeText: 'text-cyan-700',  bar: 'bg-cyan-500',  tab: 'bg-cyan-500' },
    blue:  { dot: 'bg-blue-400',  badge: 'bg-blue-50 border-blue-200',  badgeText: 'text-blue-700',  bar: 'bg-blue-500',  tab: 'bg-blue-500' },
    red:   { dot: 'bg-red-400',   badge: 'bg-red-50 border-red-200',    badgeText: 'text-red-700',   bar: 'bg-red-500',   tab: 'bg-red-500'  },
  };
  return map[color] ?? map.blue;
};

// --- Mock Data ---

const UNITS: Record<string, UnitData> = {
  'serena-luxion': {
    id: 'serena-luxion', slug: 'serena-luxion',
    name: { jp: 'SERENA LUXION (C28)', en: 'MOBILE COMMAND CENTER' },
    role: { jp: '渡辺 直人 課長 (CTO/CIO)', en: 'CHIEF TECHNOLOGY OFFICER' },
    description: '組織全体を支える移動司令基地。ProPILOT 2.0によるハンズオフ運転と、e-POWERによる静粛かつ強力な電力供給能力を備え、あらゆる場所での指揮統制を可能にする。',
    themeColor: 'cyan',
    specs: [
      { label: 'Power Unit',    value: 'e-POWER (HR14DDe-EM57)',      progress: 90, icon: <Zap size={15} /> },
      { label: 'Displacement',  value: '1,433cc + Motor',             progress: 60, icon: <Database size={15} /> },
      { label: 'Max Power',     value: '120kW (163PS)',               progress: 80, icon: <Gauge size={15} /> },
      { label: 'Max Torque',    value: '315N・m',                     progress: 85, icon: <Activity size={15} /> },
      { label: 'Drive System',  value: 'FWD',                         progress: 50, icon: <Box size={15} /> },
      { label: 'Tech Stack',    value: 'ProPILOT 2.0 / NissanConnect',progress: 95, icon: <Cpu size={15} /> },
    ],
    docs: [
      { title: 'C28_Service_Manual_v2.4.pdf',         type: 'PDF',  size: '12.4 MB', date: '2025.01.15' },
      { title: 'ProPILOT_2.0_Operation_Guide.pdf',    type: 'PDF',  size: '4.8 MB',  date: '2024.11.20' },
      { title: 'Vehicle_Inspection_Certificate.pdf',  type: 'PDF',  size: '1.2 MB',  date: '2024.04.01' },
    ],
    logs: [
      { date: '2025.02.10', title: '定期法定点検 (12ヶ月)', type: 'inspection', details: '日産プリンスにて実施。ProPILOTセンサー校正完了。異常なし。' },
      { date: '2025.01.05', title: 'システム・アップデート',   type: 'upgrade',    details: 'NissanConnect ナビゲーション地図データ更新 (2024-Q4版)。' },
      { date: '2024.12.20', title: '冬期装備換装',           type: 'maintenance', details: 'スタッドレスタイヤへの交換 (Blizzak VRX3)。ワイパーブレード交換。' },
      { date: '2024.08.15', title: 'オイル交換・フィルタ交換', type: 'maintenance', details: '発電用エンジンのオイル交換を実施。推奨距離到達のため。' },
    ]
  },
  'gb350': {
    id: 'gb350', slug: 'gb350',
    name: { jp: 'GB350 (2023)', en: 'THE CLASSIC AUTHORITY' },
    role: { jp: '三重野 匠 CEO', en: 'CHIEF EXECUTIVE OFFICER' },
    description: '単気筒という名の、純粋な意志決定。空冷シングルエンジンの鼓動感と、トラディショナルなスタイリング。組織の揺るぎない基軸として、本質的な価値を体現する。',
    themeColor: 'blue',
    specs: [
      { label: 'Engine Type',  value: 'Air-Cooled 4-Stroke OHC Single',  progress: 40, icon: <Zap size={15} /> },
      { label: 'Displacement', value: '348cc',                           progress: 35, icon: <Database size={15} /> },
      { label: 'Max Power',    value: '15kW (20PS) / 5,500rpm',          progress: 30, icon: <Gauge size={15} /> },
      { label: 'Max Torque',   value: '29N・m / 3,000rpm',               progress: 40, icon: <Activity size={15} /> },
      { label: 'Weight',       value: '180kg',                           progress: 50, icon: <Box size={15} /> },
      { label: 'Fuel Tank',    value: '15L',                             progress: 60, icon: <ShieldCheck size={15} /> },
    ],
    docs: [
      { title: 'GB350_Owners_Manual.pdf',   type: 'PDF', size: '8.5 MB',  date: '2023.05.10' },
      { title: 'Parts_Catalogue_2023.pdf',  type: 'PDF', size: '15.2 MB', date: '2023.05.10' },
    ],
    logs: [
      { date: '2024.11.03', title: 'チェーン清掃・注油',      type: 'maintenance', details: 'DIDチェーンルブ使用。張り調整実施。' },
      { date: '2024.09.15', title: 'オイル交換 (G1)',         type: 'maintenance', details: 'ホンダウルトラG1使用。ドレンワッシャー交換。' },
      { date: '2024.05.20', title: '初回点検 (1,000km)',      type: 'inspection',  details: 'ドリーム店にて実施。各部増し締め、異常なし。' },
    ]
  },
  'cbr400r': {
    id: 'cbr400r', slug: 'cbr400r',
    name: { jp: 'CBR400R (2020)', en: 'THE CORE OF OPERATIONS' },
    role: { jp: '渡辺 直人 課長 (CTO/CIO)', en: 'CHIEF TECHNOLOGY OFFICER' },
    description: '現場指揮官のための高機動二輪アセット。市街地から高速巡航までこなす並列2気筒エンジンは、あらゆる状況下での迅速な展開を可能にする。',
    themeColor: 'red',
    specs: [
      { label: 'Engine Type',  value: 'Liquid-Cooled 4-Stroke DOHC Parallel Twin', progress: 70, icon: <Zap size={15} /> },
      { label: 'Displacement', value: '399cc',                                      progress: 40, icon: <Database size={15} /> },
      { label: 'Max Power',    value: '34kW (46PS) / 9,000rpm',                    progress: 65, icon: <Gauge size={15} /> },
      { label: 'Max Torque',   value: '38N・m / 7,500rpm',                          progress: 55, icon: <Activity size={15} /> },
      { label: 'Weight',       value: '192kg',                                      progress: 55, icon: <Box size={15} /> },
      { label: 'Fuel Tank',    value: '17L',                                        progress: 70, icon: <ShieldCheck size={15} /> },
    ],
    docs: [
      { title: 'CBR400R_Service_Data.pdf',   type: 'PDF',  size: '3.2 MB', date: '2021.03.15' },
      { title: 'Custom_Parts_List.xlsx',     type: 'XLSX', size: '0.5 MB', date: '2024.01.10' },
    ],
    logs: [
      { date: '2025.03.01', title: 'タイヤ交換 (前後)',        type: 'maintenance', details: 'Michelin Road 6へ換装。バランス調整済み。' },
      { date: '2024.10.12', title: 'ブレーキパッド交換 (F)',   type: 'maintenance', details: '純正パッド使用。フルード交換実施。' },
      { date: '2024.04.05', title: '車検整備',                 type: 'inspection',  details: '光軸調整、排ガス検査クリア。' },
    ]
  },
  'yzf-r3': {
    id: 'yzf-r3', slug: 'yzf-r3',
    name: { jp: 'YZF-R3 (2025)', en: 'DEFINE THE NEXT STANDARD' },
    role: { jp: '坂井 龍之介 COO', en: 'CHIEF OPERATING OFFICER' },
    description: 'R-DNAを受け継ぐ次世代のイノベーション。高回転まで突き抜ける爽快なエンジン特性と、倒立フォークによる鋭いハンドリング。',
    themeColor: 'blue',
    specs: [
      { label: 'Engine Type',  value: 'Liquid-Cooled 4-Stroke DOHC Parallel Twin', progress: 65, icon: <Zap size={15} /> },
      { label: 'Displacement', value: '320cc',                                      progress: 32, icon: <Database size={15} /> },
      { label: 'Max Power',    value: '31kW (42PS) / 10,750rpm',                   progress: 60, icon: <Gauge size={15} /> },
      { label: 'Max Torque',   value: '30N・m / 9,000rpm',                          progress: 45, icon: <Activity size={15} /> },
      { label: 'Weight',       value: '169kg',                                      progress: 45, icon: <Box size={15} /> },
      { label: 'Suspension',   value: 'KYB Inverted Forks',                        progress: 80, icon: <ShieldCheck size={15} /> },
    ],
    docs: [{ title: 'YZF-R3_Setup_Guide.pdf', type: 'PDF', size: '5.1 MB', date: '2025.02.01' }],
    logs: [
      { date: '2025.02.15', title: '納車整備',        type: 'inspection',  details: 'YSPにて実施。各部チェック完了。' },
      { date: '2025.02.15', title: 'コーティング施工', type: 'maintenance', details: 'CR-1ガラスコーティング施工。' },
    ]
  },
  'cbr600rr': {
    id: 'cbr600rr', slug: 'cbr600rr',
    name: { jp: 'CBR600RR (2020)', en: 'SPEED & AGILITY' },
    role: { jp: '末森 知輝 CMO', en: 'CHIEF MARKETING OFFICER' },
    description: '600ccの高回転型バリュー・エンジン。圧倒的なポテンシャルを誇るメイン機体。サーキットからワインディングまで、あらゆるフィールドを制圧する。',
    themeColor: 'red',
    specs: [
      { label: 'Engine Type',  value: 'Liquid-Cooled 4-Stroke DOHC Inline-4', progress: 95, icon: <Zap size={15} /> },
      { label: 'Displacement', value: '599cc',                                  progress: 60, icon: <Database size={15} /> },
      { label: 'Max Power',    value: '89kW (121PS) / 14,000rpm',              progress: 95, icon: <Gauge size={15} /> },
      { label: 'Max Torque',   value: '64N・m / 11,500rpm',                    progress: 70, icon: <Activity size={15} /> },
      { label: 'Weight',       value: '194kg',                                  progress: 60, icon: <Box size={15} /> },
      { label: 'Fuel Tank',    value: '18L',                                    progress: 70, icon: <ShieldCheck size={15} /> },
    ],
    docs: [
      { title: 'CBR600RR_Track_Manual.pdf', type: 'PDF', size: '18.4 MB', date: '2020.09.25' },
      { title: 'HRC_Kit_Parts_List.pdf',    type: 'PDF', size: '2.4 MB',  date: '2021.02.10' },
    ],
    logs: [
      { date: '2024.11.20', id: 1, title: 'オイル交換 (G3)',  type: 'maintenance', details: 'サーキット走行前メンテナンス。Honda Ultra G3使用。' },
      { date: '2024.06.12',        title: '12ヶ月点検',        type: 'inspection',  details: 'ドリーム店にて実施。消耗品チェック。' },
    ]
  },
  'monkey125': {
    id: 'monkey125', slug: 'monkey125',
    name: { jp: 'Monkey 125', en: 'THE LAST MILE PIONEER' },
    role: { jp: '末森 知輝 CMO', en: 'CHIEF MARKETING OFFICER' },
    description: '局地的な機動力を提供するマイクロ・モビリティ。Dual-Platform戦略の要として、大型機では到達不可能なエリアへのアクセスを可能にする。',
    themeColor: 'red',
    specs: [
      { label: 'Engine Type',  value: 'Air-Cooled 4-Stroke OHC Single',   progress: 20, icon: <Zap size={15} /> },
      { label: 'Displacement', value: '124cc',                             progress: 12, icon: <Database size={15} /> },
      { label: 'Max Power',    value: '6.9kW (9.4PS) / 6,750rpm',        progress: 15, icon: <Gauge size={15} /> },
      { label: 'Max Torque',   value: '11N・m / 5,500rpm',                progress: 20, icon: <Activity size={15} /> },
      { label: 'Weight',       value: '104kg',                             progress: 10, icon: <Box size={15} /> },
      { label: 'Fuel Tank',    value: '5.6L',                             progress: 20, icon: <ShieldCheck size={15} /> },
    ],
    docs: [{ title: 'Monkey125_Custom_Guide.pdf', type: 'PDF', size: '6.2 MB', date: '2021.05.10' }],
    logs: [
      { date: '2024.10.05', title: 'タイヤ交換',  type: 'maintenance', details: 'オフロード走行を想定し、ブロックタイヤへ換装。' },
      { date: '2024.05.15', title: 'キャリア増設', type: 'upgrade',     details: '積載量増加のため、リアキャリアおよびサイドバッグサポートを装着。' },
    ]
  },
  'cbr600rr-monkey125': {
    id: 'cbr600rr-monkey125', slug: 'cbr600rr-monkey125',
    name: { jp: 'CBR600RR & Monkey 125', en: 'SPEED & AGILITY / DUAL PLATFORM' },
    role: { jp: '末森 知輝 CMO', en: 'CHIEF MARKETING OFFICER' },
    description: '圧倒的な加速力を誇るスーパースポーツと、機動力を極めたマイクロ・モビリティ。相反する二つの特性を使い分け、あらゆるフィールドを制圧する。',
    themeColor: 'red',
    specs: [
      { label: 'Engine (CBR)',       value: 'Liquid-Cooled 4-Stroke DOHC Inline-4', progress: 95, icon: <Zap size={15} /> },
      { label: 'Displacement (CBR)', value: '599cc',                                 progress: 60, icon: <Database size={15} /> },
      { label: 'Max Power (CBR)',    value: '89kW (121PS) / 14,000rpm',             progress: 95, icon: <Gauge size={15} /> },
      { label: 'Engine (Monkey)',    value: 'Air-Cooled 4-Stroke OHC Single',        progress: 20, icon: <Zap size={15} /> },
      { label: 'Displacement (M)',   value: '124cc',                                 progress: 12, icon: <Database size={15} /> },
      { label: 'Weight Combined',    value: '194kg + 104kg',                         progress: 80, icon: <Box size={15} /> },
    ],
    docs: [
      { title: 'CBR600RR_Track_Manual.pdf',  type: 'PDF', size: '18.4 MB', date: '2020.09.25' },
      { title: 'Monkey125_Custom_Guide.pdf', type: 'PDF', size: '6.2 MB',  date: '2021.05.10' },
    ],
    logs: [
      { date: '2024.11.20', title: 'CBR: オイル交換 (G3)', type: 'maintenance', details: 'サーキット走行前メンテナンス。' },
      { date: '2024.10.05', title: 'Monkey: タイヤ交換',   type: 'maintenance', details: 'ブロックタイヤへ換装。' },
      { date: '2024.06.12', title: 'CBR: 12ヶ月点検',      type: 'inspection',  details: 'ドリーム店にて実施。消耗品チェック。' },
    ]
  }
};

// --- Sub-components ---

function ProgressBar({ value, color }: { value: number; color: string }) {
  const barColor = color === 'cyan' ? 'bg-cyan-500' : color === 'red' ? 'bg-red-500' : 'bg-blue-500';
  return (
    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden mt-2">
      <m.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={`h-full ${barColor} rounded-full`}
      />
    </div>
  );
}

function SpecCard({ spec, color }: { spec: SpecItem; color: string }) {
  return (
    <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center gap-2 mb-2 text-gray-400 text-[10px] font-bold tracking-widest uppercase">
        {spec.icon}
        {spec.label}
      </div>
      <div className="text-lg font-bold text-gray-900">{spec.value}</div>
      {spec.progress !== undefined && <ProgressBar value={spec.progress} color={color} />}
    </div>
  );
}

function DocCard({ doc }: { doc: DocItem }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm group cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-50 rounded-xl text-gray-500 group-hover:bg-gray-100 transition-colors">
          <FileText size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-900 group-hover:text-black">{doc.title}</h4>
          <p className="text-xs text-gray-400 mt-0.5 flex gap-2">
            <span>{doc.type}</span><span>·</span><span>{doc.size}</span><span>·</span><span>{doc.date}</span>
          </p>
        </div>
      </div>
      <div className="text-gray-300 group-hover:text-gray-600 transition-colors mr-1">
        <Download size={18} />
      </div>
    </div>
  );
}

function LogItemView({ log, isLast, isAdmin, onDelete }: {
  log: LogItem; isLast: boolean; isAdmin: boolean; onDelete: (log: LogItem) => void;
}) {
  const getIcon = (type: LogItem['type']) => {
    switch (type) {
      case 'maintenance': return <Wrench size={14} />;
      case 'inspection':  return <ShieldCheck size={14} />;
      case 'upgrade':     return <Zap size={14} />;
      default:            return <Activity size={14} />;
    }
  };
  const getColor = (type: LogItem['type']) => {
    switch (type) {
      case 'maintenance': return { dot: 'bg-blue-100 text-blue-600',   badge: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'inspection':  return { dot: 'bg-green-100 text-green-600', badge: 'bg-green-50 text-green-600 border-green-100' };
      case 'upgrade':     return { dot: 'bg-purple-100 text-purple-600', badge: 'bg-purple-50 text-purple-600 border-purple-100' };
      default:            return { dot: 'bg-gray-100 text-gray-500',   badge: 'bg-gray-50 text-gray-500 border-gray-100' };
    }
  };
  const colors = getColor(log.type);

  return (
    <div className="relative pl-9 py-2 group">
      {!isLast && <div className="absolute left-[13px] top-8 bottom-0 w-px bg-gray-100" />}
      <div className={`absolute left-0 top-3 w-7 h-7 rounded-full flex items-center justify-center ${colors.dot}`}>
        {getIcon(log.type)}
      </div>
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative">
        {isAdmin && log.id && (
          <button
            onClick={() => onDelete(log)}
            className="absolute top-4 right-4 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete Log"
          >
            <Trash2 size={15} />
          </button>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1 pr-6">
          <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
            <Calendar size={11} />{log.date}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border w-fit ${colors.badge}`}>
            {log.type}
          </span>
        </div>
        <h4 className="font-semibold text-gray-900 mb-1 text-sm">{log.title}</h4>
        <p className="text-sm text-gray-500 leading-relaxed">{log.details}</p>
        {log.cost !== undefined && log.cost > 0 && (
          <div className="mt-2 text-xs font-mono text-gray-400 border-t border-gray-50 pt-2">
            COST: ¥{Number(log.cost).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main Component ---

interface UnitDetailClientProps {
  slug: string;
  initialUnit: Unit | null;
  isAdmin: boolean;
}

export default function UnitDetailClient({ slug, initialUnit, isAdmin }: UnitDetailClientProps) {
  const mockUnit = UNITS[slug];

  const unit: UnitData | null = mockUnit || initialUnit ? {
    ...mockUnit,
    ...initialUnit,
    // specs: DBに有効なデータがあればDB優先、なければmockにフォールバック
    specs: (Array.isArray(initialUnit?.specs) && (initialUnit.specs as SpecItem[]).length > 0
      ? initialUnit.specs
      : mockUnit?.specs ?? []) as SpecItem[],
    // docs/logs: DBになければmockを使用
    docs: (initialUnit?.docs?.length ? initialUnit.docs : mockUnit?.docs ?? []) as DocItem[],
    logs: (initialUnit?.logs?.length ? initialUnit.logs : mockUnit?.logs ?? []) as LogItem[],
    description: initialUnit?.description || mockUnit?.description || '',
    id: initialUnit?.id ?? mockUnit?.id,
  } : null;

  if (!unit) { notFound(); return null; }

  const safeSpecs = Array.isArray(unit.specs) ? unit.specs : [];
  const accent = getAccentColor(unit.themeColor);

  const [activeTab, setActiveTab]     = useState<'specs' | 'docs' | 'logs'>('specs');
  const [isEditing, setIsEditing]     = useState(false);
  const [description, setDescription] = useState(unit.description);
  const [isFormOpen, setIsFormOpen]   = useState(false);
  const [isPending, startTransition]  = useTransition();
  const [toast, setToast]             = useState<ToastState>({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; log: LogItem | null }>({ open: false, log: null });
  const [imageUrl, setImageUrl]       = useState<string>(initialUnit?.image_url ?? '');
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageInputVal, setImageInputVal]   = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'maintenance', description: '', cost: ''
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  }, []);

  const tabs = [
    { id: 'specs', label: '機体仕様',      sub: 'SPECS' },
    { id: 'docs',  label: 'マニュアル・書類', sub: 'DOCUMENTS' },
    { id: 'logs',  label: '整備・運用履歴',  sub: 'MAINTENANCE LOG' },
  ] as const;

  const handleSave = async () => {
    if (typeof unit.id === 'number') {
      try {
        await updateUnit(unit.id, { description });
        setIsEditing(false);
        showToast('概要を保存しました', 'success');
      } catch {
        showToast('保存に失敗しました', 'error');
      }
    } else {
      showToast('DBに登録されていないユニットは編集できません', 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unit.id || typeof unit.id !== 'number') return;
    startTransition(async () => {
      try {
        await addMaintenanceLog(unit.id as number, {
          date: formData.date, type: formData.type,
          description: formData.description, cost: Number(formData.cost) || 0
        });
        setIsFormOpen(false);
        setFormData({ date: new Date().toISOString().split('T')[0], type: 'maintenance', description: '', cost: '' });
        showToast('記録を追加しました', 'success');
      } catch {
        showToast('記録の追加に失敗しました', 'error');
      }
    });
  };

  const handleDeleteLog = (log: LogItem) => {
    if (!log.id || !isAdmin) return;
    setConfirmModal({ open: true, log });
  };

  const confirmDelete = () => {
    const log = confirmModal.log;
    if (!log?.id) return;
    startTransition(async () => {
      try {
        await deleteMaintenanceLog(log.id as number);
        setConfirmModal({ open: false, log: null });
        showToast('記録を削除しました', 'success');
      } catch {
        setConfirmModal({ open: false, log: null });
        showToast('削除に失敗しました', 'error');
      }
    });
  };

  const handleImageSave = async () => {
    if (typeof unit.id !== 'number') { showToast('DBに登録されていないユニットは編集できません', 'error'); return; }
    try {
      await updateUnit(unit.id, { image_url: imageInputVal });
      setImageUrl(imageInputVal);
      setIsEditingImage(false);
      showToast('画像URLを保存しました', 'success');
    } catch {
      showToast('画像URLの保存に失敗しました', 'error');
    }
  };

  return (
    <ClientMotionWrapper>
      <div className="min-h-screen bg-[#F5F5F7] pb-20">

        {/* ── ヘッダー (Cupertino Minimal: 白背景 + ガラスモーフィズム) ── */}
        <div className="relative w-full overflow-hidden bg-white">

          {/* 車両画像エリア */}
          <div className="relative w-full h-[45vh] md:h-[55vh] bg-gray-100 overflow-hidden">
            {imageUrl ? (
              <Image src={imageUrl} alt={unit.name.jp} fill className="object-cover" priority sizes="100vw" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                <ImageIcon size={48} className="mb-3" />
                <p className="text-sm font-medium">No image</p>
              </div>
            )}
            {/* グラデーションオーバーレイ */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />

            {/* Admin: 画像編集ボタン */}
            {isAdmin && (
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => { setIsEditingImage(true); setImageInputVal(imageUrl); }}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:bg-white transition-all"
                >
                  <ImageIcon size={13} />画像を変更
                </button>
              </div>
            )}

            {/* 戻るリンク */}
            <div className="absolute top-4 left-4 z-10">
              <Link
                href="/units"
                className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/60 text-gray-700 text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:bg-white transition-all group"
              >
                <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                機動戦力一覧
              </Link>
            </div>
          </div>

          {/* テキストエリア（画像下のホワイトゾーン） */}
          <div className="px-6 md:px-12 pt-6 pb-8">
            <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* ロールバッジ */}
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${accent.badge} ${accent.badgeText} mb-4`}>
                <ShieldCheck size={11} />
                {unit.role.en}
              </span>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-1">
                    {unit.name.jp}
                  </h1>
                  <p className="text-xs font-mono text-gray-400 tracking-[0.2em] uppercase">{unit.name.en}</p>
                </div>
                {/* ステータス */}
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600 shrink-0">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${accent.dot}`} />
                  OPERATIONAL
                </div>
              </div>
            </m.div>
          </div>

          {/* 薄いボーダー */}
          <div className="h-px bg-gray-100 mx-6 md:mx-12" />
        </div>

        {/* 画像URL編集モーダル */}
        <AnimatePresence>
          {isEditingImage && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsEditingImage(false)}
            >
              <m.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Link2 size={18} className="text-gray-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">車両画像URLを変更</h3>
                </div>
                <input
                  type="url"
                  value={imageInputVal}
                  onChange={(e) => setImageInputVal(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 mb-5"
                />
                <div className="flex gap-3">
                  <button onClick={() => setIsEditingImage(false)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    キャンセル
                  </button>
                  <button onClick={handleImageSave} className="flex-1 py-3 rounded-2xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition-colors flex items-center justify-center gap-2">
                    <Save size={14} />保存
                  </button>
                </div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>

        {/* ── メインコンテンツ ── */}
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">

          {/* 説明カード */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6 group relative"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit Overview</h3>
              {isAdmin && !isEditing && typeof unit.id === 'number' && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors opacity-0 group-hover:opacity-100 font-medium"
                >
                  <Edit2 size={13} />編集
                </button>
              )}
            </div>

            {/* Operator */}
            <div className="mb-4 text-sm text-gray-500">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mr-2">Operator</span>
              {unit.role.jp}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-28 p-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setDescription(unit.description); setIsEditing(false); }} className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                    <X size={13} />キャンセル
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-black transition-colors">
                    <Save size={13} />保存
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{unit.description}</p>
            )}
          </m.div>

          {/* タブナビゲーション */}
          <div className="flex overflow-x-auto no-scrollbar gap-1 mb-6 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 min-w-fit px-5 py-2.5 rounded-xl transition-all flex flex-col items-center ${
                  activeTab === tab.id ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="font-bold text-sm whitespace-nowrap">{tab.label}</span>
                <span className={`text-[9px] font-mono tracking-widest uppercase mt-0.5 ${activeTab === tab.id ? 'text-white/60' : 'text-gray-400'}`}>{tab.sub}</span>
              </button>
            ))}
          </div>

          {/* タブコンテンツ */}
          <AnimatePresence mode="wait">
            <m.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* SPECS */}
              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {safeSpecs.map((spec, i) => <SpecCard key={i} spec={spec} color={unit.themeColor} />)}
                </div>
              )}

              {/* DOCS */}
              {activeTab === 'docs' && (
                <div className="space-y-2">
                  {unit.docs.map((doc, i) => <DocCard key={i} doc={doc} />)}
                  {unit.docs.length === 0 && (
                    <div className="text-center py-16 text-gray-300">
                      <FileText size={40} className="mx-auto mb-3" />
                      <p className="text-sm">書類がありません</p>
                    </div>
                  )}
                </div>
              )}

              {/* LOGS */}
              {activeTab === 'logs' && (
                <>
                  {isAdmin && (
                    <div className="mb-5">
                      <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-colors shadow-sm"
                      >
                        <Plus size={15} />記録を追加
                        {isFormOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      <AnimatePresence>
                        {isFormOpen && (
                          <m.form
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onSubmit={handleSubmit}
                            className="overflow-hidden mt-3 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">日付</label>
                                <input type="date" required value={formData.date}
                                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                  className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">タイプ</label>
                                <select required value={formData.type}
                                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                  className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200">
                                  <option value="maintenance">Maintenance</option>
                                  <option value="inspection">Inspection</option>
                                  <option value="upgrade">Upgrade</option>
                                  <option value="incident">Incident</option>
                                </select>
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">内容</label>
                                <input type="text" required value={formData.description} placeholder="作業の詳細..."
                                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                  className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">費用 (¥)</label>
                                <input type="number" min="0" value={formData.cost} placeholder="0"
                                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                  className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <button type="submit" disabled={isPending}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-colors disabled:opacity-50">
                                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                保存する
                              </button>
                            </div>
                          </m.form>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                    {unit.logs.map((log, i) => (
                      <LogItemView key={i} log={log} isLast={i === unit.logs.length - 1} isAdmin={isAdmin} onDelete={handleDeleteLog} />
                    ))}
                    {unit.logs.length === 0 && (
                      <div className="text-center py-16 text-gray-300">
                        <Calendar size={40} className="mx-auto mb-3" />
                        <p className="text-sm">整備記録がありません</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </m.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 削除確認モーダル */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title="記録を削除しますか？"
        message="この整備記録を削除すると元に戻せません。本当に削除しますか？"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ open: false, log: null })}
        isPending={isPending}
      />

      {/* トースト */}
      <AnimatePresence>
        {toast.show && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
        )}
      </AnimatePresence>
    </ClientMotionWrapper>
  );
}
