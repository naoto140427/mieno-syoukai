'use client';

import { m } from 'framer-motion';
import { Wrench, Map, Database, Zap, Shield, Cpu, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ClientMotionWrapper from '@/components/ClientMotionWrapper';

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 'fleet',
    title: '次世代モビリティ運用',
    sub: 'FLEET MANAGEMENT',
    body: 'GB350からSERENA LUXIONまで。高度な機体管理と保守で、長距離作戦の成功率を最大化する。',
    icon: Wrench,
  },
  {
    id: 'logistics',
    title: '戦略的ロジスティクス',
    sub: 'STRATEGIC LOGISTICS',
    body: 'GPXログを解析して全国の走破ルートをデータベース化。次作戦への兵站計画を最適化する。',
    icon: Map,
  },
  {
    id: 'security',
    title: 'セキュリティ & 保全',
    sub: 'ASSET PROTECTION',
    body: '整備記録・保険管理・緊急対応プロトコルを一元管理し、資産を守る多層防衛体制。',
    icon: Shield,
  },
  {
    id: 'integration',
    title: 'デジタル基盤開発',
    sub: 'SYSTEM INTEGRATION',
    body: '独自開発のERPとガレージ管理システム。リアルタイムな在庫・工具・人員管理を実現する。',
    icon: Database,
  },
  {
    id: 'ai',
    title: 'AI 作戦支援',
    sub: 'AI-ASSISTED OPERATIONS',
    body: 'Gemini API統合による作戦報告書の自動生成とルート最適化提案。知性を武器にする。',
    icon: Cpu,
  },
  {
    id: 'ev',
    title: '電動化トランジション',
    sub: 'EV TRANSITION',
    body: 'e-POWER・ProPILOT 2.0の実運用データを蓄積し、次世代モビリティへの移行を計画する。',
    icon: Zap,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function MienoEcosystem() {
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
            MIENO CORP. — Ecosystem
          </m.p>
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl font-black tracking-tight text-[#1D1D1F] leading-[1.04] mb-6"
          >
            ハードウェアと<br />
            ソフトウェアの<br />
            <span className="text-black/40">完璧な融合。</span>
          </m.h1>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-black/50 max-w-md leading-relaxed"
          >
            モビリティ × デジタルの力で、作戦領域を限界まで拡大する。
          </m.p>
        </section>

        {/* ── Divider ───────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="h-px bg-black/10" />
        </div>

        {/* ── Service Grid ──────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 rounded-3xl overflow-hidden border border-black/10">
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <m.div
                  key={svc.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeUp}
                  className="bg-[#F5F5F7] hover:bg-white transition-colors duration-300 p-8 flex flex-col gap-5 group"
                >
                  <Icon className="w-6 h-6 text-[#001A4D]" strokeWidth={1.5} />
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.25em] text-black/40 uppercase mb-2">
                      {svc.sub}
                    </p>
                    <h2 className="text-lg font-bold text-[#1D1D1F] mb-3 leading-snug">
                      {svc.title}
                    </h2>
                    <p className="text-sm text-black/50 leading-relaxed">
                      {svc.body}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-black/20 group-hover:text-[#001A4D] group-hover:translate-x-1 transition-all duration-300 mt-auto" />
                </m.div>
              );
            })}
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 lg:px-8 pb-32">
          <div className="h-px bg-black/10 mb-12" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-2xl font-bold text-[#1D1D1F] mb-1">
                作戦に参加したい？
              </p>
              <p className="text-sm text-black/40">
                ご連絡はこちらから。
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#001A4D] text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-[#001A4D]/90 transition-colors"
            >
              Contact
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </ClientMotionWrapper>
  );
}
