'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { m, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Circle, BarChart3, ArrowRight, Zap, Gauge, Activity, Box, Fuel, Cpu } from 'lucide-react';
import ClientMotionWrapper from '@/components/ClientMotionWrapper';
import { COMPARE_UNITS, THEME_COLORS, type CompareUnit } from '@/lib/units-data';

const SPEC_ICONS = [<Cpu size={13} />, <Box size={13} />, <Zap size={13} />, <Activity size={13} />, <Gauge size={13} />, <Fuel size={13} />];

const MAX_SELECT = 4;

// ── レーダーチャート（SVG）──
function RadarChart({ unit, size = 160 }: { unit: CompareUnit; size?: number }) {
  const specs = unit.specs.filter(s => s.numericValue !== undefined);
  const n = specs.length;
  if (n === 0) return null;

  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const color = THEME_COLORS[unit.themeColor];

  const angleOf = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, val: number) => ({
    x: cx + r * (val / 100) * Math.cos(angleOf(i)),
    y: cy + r * (val / 100) * Math.sin(angleOf(i)),
  });

  const outerPts = Array.from({ length: n }, (_, i) => pt(i, 100));
  const dataPath = specs.map((s, i) => pt(i, s.numericValue!));
  const toPath = (pts: {x:number;y:number}[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* グリッド */}
      {[0.25, 0.5, 0.75, 1].map(frac => (
        <polygon key={frac}
          points={outerPts.map(p => `${(cx + (p.x - cx) * frac).toFixed(1)},${(cy + (p.y - cy) * frac).toFixed(1)}`).join(' ')}
          fill="none" stroke="#E5E7EB" strokeWidth="1"
        />
      ))}
      {/* 軸線 */}
      {outerPts.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#E5E7EB" strokeWidth="1" />
      ))}
      {/* データ面 */}
      <path d={toPath(dataPath)} fill={`url(#grad-${unit.slug})`} fillOpacity="0.25" stroke="none" />
      <path d={toPath(dataPath)} fill="none" stroke={color.bg.replace('bg-','').includes('cyan') ? '#06B6D4' : color.bg.includes('red') ? '#EF4444' : '#3B82F6'} strokeWidth="2" strokeLinejoin="round" />
      {/* データポイント */}
      {dataPath.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="white"
          stroke={color.bg.includes('cyan') ? '#06B6D4' : color.bg.includes('red') ? '#EF4444' : '#3B82F6'}
          strokeWidth="2" />
      ))}
      {/* ラベル */}
      {specs.map((s, i) => {
        const lp = pt(i, 125);
        return <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
          fontSize="7" fill="#9CA3AF" fontWeight="600">{s.label.split(' ')[0]}</text>;
      })}
      <defs>
        <linearGradient id={`grad-${unit.slug}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color.bg.includes('cyan') ? '#06B6D4' : color.bg.includes('red') ? '#EF4444' : '#3B82F6'} />
          <stop offset="100%" stopColor={color.bg.includes('cyan') ? '#0891B2' : color.bg.includes('red') ? '#DC2626' : '#2563EB'} />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── 比較バー ──
function CompareBar({ values, maxVal }: { values: { unit: CompareUnit; val: number }[]; maxVal: number }) {
  const best = Math.max(...values.map(v => v.val));
  return (
    <div className="flex flex-col gap-2 mt-1">
      {values.map(({ unit, val }) => {
        const isBest = val === best;
        const color = THEME_COLORS[unit.themeColor];
        const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
        return (
          <div key={unit.slug} className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 w-20 truncate shrink-0">{unit.name}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <m.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className={`h-full rounded-full ${color.bg} ${isBest ? 'opacity-100' : 'opacity-50'}`}
              />
            </div>
            {isBest && <span className="text-[9px] font-bold text-amber-500 shrink-0">BEST</span>}
          </div>
        );
      })}
    </div>
  );
}

// ── メインコンポーネント ──
export default function UnitCompareClient() {
  const [selected, setSelected] = useState<string[]>(['cbr600rr', 'yzf-r3']);

  const toggle = (slug: string) => {
    setSelected(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : prev.length < MAX_SELECT ? [...prev, slug] : prev
    );
  };

  const selectedUnits = useMemo(
    () => COMPARE_UNITS.filter(u => selected.includes(u.slug)),
    [selected]
  );

  // 比較用スペックのキー（全選択ユニットで共通）
  const specLabels = ['Displacement', 'Max Power', 'Max Torque', 'Weight', 'Fuel Tank'];

  return (
    <ClientMotionWrapper>
      <div className="min-h-screen bg-[#F5F5F7]">

        {/* ── ヘッダー ── */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-30 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/units" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group text-sm font-medium">
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                機動戦力一覧
              </Link>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-gray-400" />
                <span className="font-bold text-gray-900 text-sm">性能比較</span>
              </div>
            </div>
            <span className="text-xs text-gray-400 font-medium">{selected.length} / {MAX_SELECT} 選択中</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">

          {/* ── 車両選択エリア ── */}
          <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">比較する車両を選択（最大{MAX_SELECT}台）</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {COMPARE_UNITS.map(unit => {
                const isSelected = selected.includes(unit.slug);
                const color = THEME_COLORS[unit.themeColor];
                const canAdd = selected.length < MAX_SELECT || isSelected;
                return (
                  <button
                    key={unit.slug}
                    onClick={() => canAdd && toggle(unit.slug)}
                    disabled={!canAdd}
                    className={`relative p-3 rounded-2xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? `${color.light} ${color.border} shadow-sm`
                        : canAdd
                          ? 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                          : 'bg-gray-50 border-gray-100 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      {isSelected
                        ? <CheckCircle2 size={16} className={color.text} />
                        : <Circle size={16} className="text-gray-300" />
                      }
                    </div>
                    <p className="font-bold text-xs text-gray-900 leading-tight">{unit.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{unit.displacement}</p>
                  </button>
                );
              })}
            </div>
          </m.div>

          {/* ── 比較コンテンツ ── */}
          <AnimatePresence mode="wait">
            {selectedUnits.length < 2 ? (
              <m.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white rounded-3xl border border-gray-100 p-16 text-center"
              >
                <BarChart3 size={40} className="mx-auto mb-4 text-gray-200" />
                <p className="text-gray-400 font-medium">2台以上選択すると比較が表示されます</p>
              </m.div>
            ) : (
              <m.div key="compare" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                {/* ── レーダーチャート ── */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Performance Radar</h3>
                  <div className={`grid gap-6 justify-items-center ${
                    selectedUnits.length === 2 ? 'grid-cols-2'
                    : selectedUnits.length === 3 ? 'grid-cols-3'
                    : 'grid-cols-2 md:grid-cols-4'
                  }`}>
                    {selectedUnits.map(unit => {
                      const color = THEME_COLORS[unit.themeColor];
                      return (
                        <div key={unit.slug} className="flex flex-col items-center gap-3">
                          <RadarChart unit={unit} size={150} />
                          <div className="text-center">
                            <p className="font-black text-sm text-gray-900">{unit.name}</p>
                            <p className="text-[10px] text-gray-400 font-mono uppercase">{unit.nameEn}</p>
                            <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${color.badge}`}>
                              {unit.role}
                            </span>
                          </div>
                          <Link href={`/units/${unit.slug}`}
                            className="text-xs font-semibold text-gray-400 hover:text-gray-900 flex items-center gap-1 transition-colors">
                            詳細を見る <ArrowRight size={11} />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── スペック比較バー ── */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Spec Comparison</h3>
                  <div className="space-y-6">
                    {specLabels.map((label, si) => {
                      const values = selectedUnits.map(unit => ({
                        unit,
                        val: unit.specs.find(s => s.label === label)?.numericValue ?? 0,
                        display: unit.specs.find(s => s.label === label)?.value ?? '—',
                      }));
                      const maxVal = Math.max(...values.map(v => v.val));
                      return (
                        <div key={label} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-gray-400">{SPEC_ICONS[si + 1]}</span>
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{label}</span>
                          </div>
                          {/* 各車両の値 */}
                          <div className={`grid gap-2 mb-3 ${
                            selectedUnits.length <= 2 ? 'grid-cols-2'
                            : selectedUnits.length === 3 ? 'grid-cols-3'
                            : 'grid-cols-2 md:grid-cols-4'
                          }`}>
                            {values.map(({ unit, val, display }) => {
                              const isBest = val === maxVal && val > 0;
                              const color = THEME_COLORS[unit.themeColor];
                              return (
                                <div key={unit.slug} className={`p-3 rounded-2xl ${isBest ? color.light + ' ' + color.border + ' border' : 'bg-gray-50'}`}>
                                  <p className="text-[10px] font-bold text-gray-400 mb-0.5">{unit.name}</p>
                                  <p className={`text-sm font-bold ${isBest ? color.text : 'text-gray-700'}`}>{display}</p>
                                  {isBest && <p className="text-[9px] font-bold text-amber-500 mt-0.5">★ BEST</p>}
                                </div>
                              );
                            })}
                          </div>
                          <CompareBar values={values.map(v => ({ unit: v.unit, val: v.val }))} maxVal={maxVal} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── 総合スコアカード ── */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Overall Score</h3>
                  <div className={`grid gap-4 ${
                    selectedUnits.length <= 2 ? 'grid-cols-2'
                    : selectedUnits.length === 3 ? 'grid-cols-3'
                    : 'grid-cols-2 md:grid-cols-4'
                  }`}>
                    {selectedUnits.map(unit => {
                      const color = THEME_COLORS[unit.themeColor];
                      const score = Math.round(
                        unit.specs
                          .filter(s => s.numericValue !== undefined)
                          .reduce((acc, s) => acc + (s.numericValue ?? 0), 0) /
                        unit.specs.filter(s => s.numericValue !== undefined).length
                      );
                      return (
                        <m.div
                          key={unit.slug}
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`p-5 rounded-2xl ${color.light} border ${color.border} text-center`}
                        >
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{unit.name}</p>
                          <div className="relative w-20 h-20 mx-auto mb-3">
                            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                              <circle cx="40" cy="40" r="32" fill="none" stroke="#E5E7EB" strokeWidth="6" />
                              <m.circle cx="40" cy="40" r="32" fill="none"
                                stroke={unit.themeColor === 'cyan' ? '#06B6D4' : unit.themeColor === 'red' ? '#EF4444' : '#3B82F6'}
                                strokeWidth="6" strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 32}`}
                                initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - score / 100) }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-2xl font-black ${color.text}`}>{score}</span>
                            </div>
                          </div>
                          <p className={`text-xs font-bold ${color.text}`}>
                            {score >= 70 ? 'HIGH SPEC' : score >= 40 ? 'BALANCED' : 'NIMBLE'}
                          </p>
                        </m.div>
                      );
                    })}
                  </div>
                </div>

              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ClientMotionWrapper>
  );
}
