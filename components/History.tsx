'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface HistoryEvent {
  year: string;
  title: string;
  description: string;
}

const historyData: HistoryEvent[] = [
  {
    year: '2020年以前',
    title: 'インキュベーション（潜伏期）',
    description: '「機動的プロトタイプの運用開始」: 現CMO 末森知輝により、マイクロ・モビリティ『Monkey 125』を用いた地域偵察業務が開始。\n「フラッグシップ・アセットへの一目惚れ」: 末森、究極の機能美『CBR600RR (2020)』を電撃調達。組織の高機動路線の礎を築く。',
  },
  {
    year: '2021年',
    title: '人的資本の拡充とナレッジ共有',
    description: '「専門知見の集積」: 末森と渡辺直人（現・課長）、専門教育機関にて合流。\n「初期資産のデプロイ」: 渡辺、国家資格を取得し即座に『CBR400R (2020)』を調達。共同フィールドワーク（非公式ツーリング）が常態化。',
  },
  {
    year: '2023年',
    title: 'マーケットの拡大',
    description: '「新規ステークホルダーの関心」: 圧倒的な実績（楽しさ）を目の当たりにし、三重野匠（現・CEO）が二輪事業への関心を示す。',
  },
  {
    year: '2024年',
    title: '組織化とブランド誕生',
    description: '「伝統的資産の導入と同好会設立」: 三重野、ヘリテージ・アセット『GB350』を調達。「三重野バイク同好会」設立。\n「戦略的合併と有限会社化」: 渡辺の重要パートナー、坂井龍之介が『YZF-R3 (2025)』を携え電撃参画。「有限会社三重野商会」へと組織体制を刷新。',
  },
  {
    year: '2026年2月',
    title: 'DX推進と「株式会社」へ',
    description: '「次世代ポータルサイト公開」: CTO/CIO 渡辺課長指揮のもと、公式Webサイトが完成。\n「株式会社への商号変更」: さらなるグローバル展開（広域ツーリング）を見据え、「株式会社三重野商会」へと進化。',
  },
];

export default function History() {
  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="mx-auto max-w-2xl text-center mb-24">
          <h2 className="text-3xl font-bold tracking-tight text-mieno-navy sm:text-4xl">
            Our History
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

        <div className="space-y-16 md:space-y-24 mb-16">
          {historyData.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Content Side */}
              <div className="flex-1 md:w-1/2 pl-12 md:pl-0 md:px-12">
                <div className={`${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-mieno-navy to-blue-600 mb-2">
                    {event.year}
                  </h3>
                  <h4 className="text-xl font-semibold text-mieno-navy mb-4">
                    {event.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-white border-4 border-mieno-navy rounded-full transform -translate-x-1/2 mt-2 md:mt-0 z-10 shadow-lg" />

              {/* Empty Side for Desktop Balance */}
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center relative z-10">
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
