'use client';

import { useRef, useEffect, useState } from 'react';
import { m, useInView, animate } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ClientMotionWrapper from '@/components/ClientMotionWrapper';

// ─── Data ─────────────────────────────────────────────────────────────────────

const KPI = [
  {
    id: 'distance',
    value: 45000,
    unit: 'km',
    label: '総走破距離',
    sub: 'Total Mileage',
    fmt: (v: number) => Math.round(v).toLocaleString('ja-JP'),
  },
  {
    id: 'softcream',
    value: 120,
    unit: '',
    label: 'ソフトクリーム消費',
    sub: 'Regional Investment',
    fmt: (v: number) => Math.round(v).toString(),
  },
  {
    id: 'yae',
    value: 92.5,
    unit: '%',
    label: 'ヤエー返答率',
    sub: 'Engagement Rate',
    fmt: (v: number) => v.toFixed(1),
  },
  {
    id: 'tires',
    value: 8,
    unit: 'sets',
    label: 'タイヤ更新回数',
    sub: 'Asset Investment',
    fmt: (v: number) => Math.round(v).toString(),
  },
];

// Annual mileage
const YEARLY = [
  { year: '2019', km: 3200 },
  { year: '2020', km: 1800 },
  { year: '2021', km: 8400 },
  { year: '2022', km: 9600 },
  { year: '2023', km: 11200 },
  { year: '2024', km: 7400 },
  { year: '2025', km: 3400 },
];

// ─── Animated Number ──────────────────────────────────────────────────────────

function AnimatedNum({ value, fmt }: { value: number; fmt: (v: number) => string }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(fmt(v)),
    });
    return () => ctrl.stop();
  }, [inView, value, fmt]);

  return <span ref={ref}>{display}</span>;
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function BarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const maxKm = Math.max(...YEARLY.map((d) => d.km));

  return (
    <div ref={ref} className="w-full">
      <div className="flex items-end gap-3 h-28">
        {YEARLY.map((d, i) => {
          const pct = (d.km / maxKm) * 100;
          return (
            <div key={d.year} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full relative" style={{ height: '100px' }}>
                <m.div
                  className="absolute bottom-0 w-full bg-[#001A4D] rounded-t-sm"
                  initial={{ height: 0 }}
                  animate={inView ? { height: `${pct}%` } : { height: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span className="text-[9px] font-mono text-black/30">{d.year.slice(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PerformanceReport() {
  return (
    <ClientMotionWrapper>
      <div className="bg-[#F5F5F7] min-h-screen">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 lg:px-8 pt-32 pb-24">
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-[11px] font-bold tracking-[0.35em] text-black/40 uppercase mb-6"
          >
            MIENO CORP. — Performance Report
          </m.p>
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl font-black tracking-tight text-[#1D1D1F] leading-[1.04] mb-6"
          >
            圧倒的な<br />
            <span className="text-black/40">活動実績。</span>
          </m.h1>
        </section>

        {/* ── KPI numbers ───────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/10 border border-black/10 rounded-3xl overflow-hidden">
            {KPI.map((kpi, i) => (
              <m.div
                key={kpi.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-[#F5F5F7] hover:bg-white transition-colors duration-300 p-10 sm:p-12"
              >
                <p className="text-[10px] font-bold tracking-[0.25em] text-black/30 uppercase mb-1">
                  {kpi.sub}
                </p>
                <p className="text-sm font-medium text-black/50 mb-6">{kpi.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl sm:text-7xl font-black text-[#1D1D1F] tracking-tighter leading-none tabular-nums">
                    <AnimatedNum value={kpi.value} fmt={kpi.fmt} />
                  </span>
                  {kpi.unit && (
                    <span className="text-xl font-bold text-black/30">{kpi.unit}</span>
                  )}
                </div>
              </m.div>
            ))}
          </div>
        </section>

        {/* ── Bar chart ─────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 lg:px-8 pb-24">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-10 sm:p-12 border border-black/[0.06]"
          >
            <p className="text-[10px] font-bold tracking-[0.25em] text-black/30 uppercase mb-1">
              Annual Mileage Trend
            </p>
            <p className="text-lg font-bold text-[#1D1D1F] mb-10">年間走破距離推移</p>
            <BarChart />
            <div className="flex justify-between text-[10px] font-mono text-black/25 mt-3">
              <span>0 km</span>
              <span>11,200 km</span>
            </div>
          </m.div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 lg:px-8 pb-32">
          <div className="h-px bg-black/10 mb-12" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-2xl font-bold text-[#1D1D1F] mb-1">
                詳細レポートが必要？
              </p>
              <p className="text-sm text-black/40">
                お問い合わせください。
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#001A4D] text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-[#001A4D]/90 transition-colors"
            >
              Request Report
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </ClientMotionWrapper>
  );
}
