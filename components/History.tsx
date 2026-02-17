'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Flag, Activity, Globe } from 'lucide-react';

interface HistoryEvent {
  year: string;
  title: string;
  sub: string;
  description: string;
  icon: React.ReactNode;
}

const historyData: HistoryEvent[] = [
  {
    year: 'Phase 01',
    title: '組織結成',
    sub: '主力機体の導入',
    description: 'CMO末森によるCBR600RRの調達を皮切りに、渡辺(CTO)、三重野(CEO)が次々と戦略機体を投入。「三重野バイク同好会」としての活動が開始される。',
    icon: <Flag className="w-6 h-6 text-white" />,
  },
  {
    year: 'Phase 02',
    title: 'ロジスティクス網の拡大',
    sub: '長距離ツーリングの成功',
    description: '四国・九州を含む広域遠征（ロングツーリング）を成功させ、野営地での作戦遂行能力を実証。チームの連携と耐久性が飛躍的に向上。',
    icon: <Activity className="w-6 h-6 text-white" />,
  },
  {
    year: 'Phase 03',
    title: 'デジタル・トランスフォーメーション',
    sub: '現在のコーポレートサイト/ERP稼働',
    description: '組織の拡大に伴い、情報共有基盤をデジタル化。自社開発のERPシステムと本コーポレートサイトの稼働により、作戦効率が最大化された。',
    icon: <Globe className="w-6 h-6 text-white" />,
  },
];

export default function History() {
  return (
    <section className="py-24 bg-white overflow-hidden relative min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="mx-auto max-w-2xl text-center mb-24">
          <h2 className="text-3xl font-bold tracking-tight text-mieno-navy sm:text-4xl uppercase">
            組織沿革
            <span className="block text-sm font-medium tracking-widest text-gray-400 mt-2">HISTORY</span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            進化の軌跡。
          </p>
        </div>

        {/* Central Line */}
        <div className="absolute left-6 md:left-1/2 top-32 bottom-24 w-0.5 bg-gray-200 transform -translate-x-1/2">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="w-full bg-gradient-to-b from-mieno-navy via-blue-500 to-transparent"
          />
        </div>

        <div className="space-y-24 mb-16">
          {historyData.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row gap-8 md:gap-0 items-center ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Content Side */}
              <div className="flex-1 md:w-1/2 pl-12 md:pl-0 md:px-16">
                <div className={`bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 relative ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  {/* Connector Line (Mobile only, Desktop handled by absolute positioning logic if needed but simpler to keep clean) */}

                  <h3 className="text-sm font-bold tracking-widest text-blue-600 mb-1 uppercase">
                    {event.year}
                  </h3>
                  <h4 className="text-2xl font-bold text-mieno-navy mb-2">
                    {event.title}
                  </h4>
                  <p className="text-sm font-bold text-gray-400 mb-4 tracking-wide">
                    {event.sub}
                  </p>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-6 md:left-1/2 w-12 h-12 bg-mieno-navy rounded-full transform -translate-x-1/2 z-10 shadow-lg border-4 border-white flex items-center justify-center">
                 {event.icon}
              </div>

              {/* Empty Side for Desktop Balance */}
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center relative z-10 pt-12">
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-mieno-navy text-white text-lg font-bold rounded-full shadow-lg hover:bg-blue-900 transition-transform hover:-translate-y-1"
          >
            JOIN THE LEGACY
          </Link>
        </div>

      </div>
    </section>
  );
}
