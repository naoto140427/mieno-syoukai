'use client';

import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ClientMotionWrapper from '@/components/ClientMotionWrapper';

// ─── Data ─────────────────────────────────────────────────────────────────────

const HISTORY = [
  {
    year: '2019',
    phase: 'Phase 01',
    title: '組織結成',
    body: 'CMO末森によるCBR600RRの調達を皮切りに、渡辺(CTO)、三重野(CEO)が次々と戦略機体を投入。「三重野バイク同好会」として活動開始。',
  },
  {
    year: '2021',
    phase: 'Phase 02',
    title: 'ロジスティクス拡大',
    body: '四国・九州を含む広域遠征を成功させ、野営地での作戦遂行能力を実証。チームの連携と耐久性が飛躍的に向上した。',
  },
  {
    year: '2023',
    phase: 'Phase 03',
    title: 'SERENA LUXION 導入',
    body: 'NISSAN SERENA e-POWER（ProPILOT 2.0）を戦略機体として採用。長距離自律移動能力が向上し、作戦領域が全国規模へ拡大。',
  },
  {
    year: '2026',
    phase: 'Phase 04',
    title: 'DX 完全移行',
    body: '自社開発のERPシステムと本コーポレートサイトが稼働。作戦記録・整備ログ・在庫管理のデジタル一元化が実現された。',
  },
];

// ─── Scroll-driven line ───────────────────────────────────────────────────────

function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 30%'],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={ref}
      className="absolute left-0 top-0 bottom-0 w-px bg-black/8 origin-top"
    >
      <m.div className="w-full h-full bg-[#001A4D] origin-top" style={{ scaleY }} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function History() {
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
            MIENO CORP. — History
          </m.p>
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl font-black tracking-tight text-[#1D1D1F] leading-[1.04] mb-6"
          >
            進化の軌跡。
          </m.h1>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-black/50 max-w-md leading-relaxed"
          >
            2019年の結成から現在まで。すべての作戦が、次の作戦への礎となった。
          </m.p>
        </section>

        {/* ── Timeline ──────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 lg:px-8 pb-24">
          <div className="relative pl-8 sm:pl-12">
            {/* Scroll-driven vertical line */}
            <TimelineLine />

            <div className="space-y-0">
              {HISTORY.map((ev) => (
                <m.div
                  key={ev.year}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex gap-8 sm:gap-16 py-12 border-b border-black/8 last:border-0 group"
                >
                  {/* Dot */}
                  <div className="absolute -left-[0.3125rem] top-[3.25rem] w-2.5 h-2.5 rounded-full bg-[#F5F5F7] border-2 border-[#001A4D] group-hover:bg-[#001A4D] transition-colors duration-300" />

                  {/* Year */}
                  <div className="w-16 sm:w-24 flex-shrink-0 pt-1">
                    <p className="text-xs font-bold font-mono text-black/30 tracking-widest">
                      {ev.year}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold tracking-[0.25em] text-black/30 uppercase mb-2">
                      {ev.phase}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1F] mb-3 tracking-tight">
                      {ev.title}
                    </h2>
                    <p className="text-sm sm:text-base text-black/50 leading-relaxed max-w-lg">
                      {ev.body}
                    </p>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 lg:px-8 pb-32">
          <div className="h-px bg-black/10 mb-12" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-2xl font-bold text-[#1D1D1F] mb-1">
                レガシーに加わる。
              </p>
              <p className="text-sm text-black/40">
                まず、話し合いから。
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#001A4D] text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-[#001A4D]/90 transition-colors"
            >
              Join
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </ClientMotionWrapper>
  );
}
