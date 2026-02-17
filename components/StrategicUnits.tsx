'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface UnitData {
  id: string;
  name: string;
  role: string;
  copy: string;
  description: string;
  imageLabel: string;
  slug: string;
  isSpecial?: boolean; // For Watanabe's & Suemori's toggle
  specialContent?: {
    secondaryName: string;
    secondaryCopy: string;
    secondaryDescription: string;
    secondaryImageLabel: string;
    secondarySlug: string;
  };
  toggleLabels?: {
    primary: string;
    secondary: string;
  };
}

const units: UnitData[] = [
  {
    id: 'ceo',
    name: 'GB350 (2023)',
    role: '三重野 匠 CEO',
    copy: '本質は、飾らない。The Classic Authority.',
    description: '単気筒という名の、純粋な意志決定。伝統的な造形美と現代のテクノロジーが融合した、組織の揺るぎない基軸。',
    imageLabel: 'GB350 IMAGE',
    slug: 'gb350',
  },
  {
    id: 'cmo',
    name: 'CBR600RR (2020)',
    role: '末森 知輝 CMO',
    copy: '加速する情熱、緻密な機動力。',
    description: '600ccの高回転型バリュー・エンジン。圧倒的なポテンシャルを誇るメイン機体。',
    imageLabel: 'CBR600RR',
    slug: 'cbr600rr',
    isSpecial: true,
    toggleLabels: {
      primary: 'メイン機体',
      secondary: '局地用モビリティ'
    },
    specialContent: {
      secondaryName: 'Monkey 125',
      secondaryCopy: 'ラストワンマイルを開拓する。',
      secondaryDescription: '局地的な機動力を提供するマイクロ・モビリティ。Dual-Platform戦略の要。',
      secondaryImageLabel: 'MONKEY 125',
      secondarySlug: 'monkey125',
    },
  },
  {
    id: 'coo',
    name: 'YZF-R3 (2025)',
    role: '坂井 龍之介 COO',
    copy: '未来を、追い越していく。Define the Next Standard.',
    description: '最新のR-DNAがもたらす、次世代のイノベーション。変化の激しい市場環境における、最も効率的な回答。',
    imageLabel: 'YZF-R3 IMAGE',
    slug: 'yzf-r3',
  },
  {
    id: 'cto',
    name: 'CBR400R (2020)',
    role: '渡辺 直人 課長 (CTO/CIO)',
    copy: 'すべての道を、統治する。The Core of Operations.',
    description: '現場指揮官のための高機動二輪アセット。ロジスティクスの完全なる掌握。',
    imageLabel: 'CBR400R IMAGE',
    slug: 'cbr400r',
    isSpecial: true,
    toggleLabels: {
      primary: '二輪モード',
      secondary: '移動司令基地'
    },
    specialContent: {
      secondaryName: 'SERENA LUXION (2025)',
      secondaryCopy: 'すべての道を、統治する。The Core of Operations.',
      secondaryDescription: '組織全体を支える移動司令基地（ProPILOT 2.0搭載）。ロジスティクスの完全なる掌握。',
      secondaryImageLabel: 'SERENA LUXION IMAGE',
      secondarySlug: 'serena-luxion',
    },
  },
];

const UnitSection = ({ unit, index }: { unit: UnitData; index: number }) => {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // State for toggle
  const [mode, setMode] = useState<'primary' | 'secondary'>('primary');

  const currentName = mode === 'primary' ? unit.name : unit.specialContent?.secondaryName;
  const currentCopy = mode === 'primary' ? unit.copy : unit.specialContent?.secondaryCopy;
  const currentDesc = mode === 'primary' ? unit.description : unit.specialContent?.secondaryDescription;
  const currentImageLabel = mode === 'primary' ? unit.imageLabel : unit.specialContent?.secondaryImageLabel;
  const currentSlug = mode === 'primary' ? unit.slug : unit.specialContent?.secondarySlug;

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center py-24 overflow-hidden"
    >
      <div className={`container mx-auto px-6 flex flex-col md:flex-row items-center gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}>

        {/* Image Side */}
        <div className="w-full md:w-1/2 relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-2xl group">
           {/* Parallax Background Simulation */}
           <motion.div
             style={{ y }}
             className="absolute inset-0 w-full h-[120%] -top-[10%] bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-2xl tracking-widest transition-colors duration-500 group-hover:bg-gray-300 dark:group-hover:bg-gray-700"
           >
             <AnimatePresence mode='wait'>
                <motion.span
                    key={currentImageLabel}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    className="block text-center px-4"
                >
                    {currentImageLabel}
                </motion.span>
             </AnimatePresence>
           </motion.div>
        </div>

        {/* Text Side */}
        <motion.div
          style={{ opacity }}
          className="w-full md:w-1/2 space-y-8"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-mieno-navy text-xl font-medium tracking-wide border-l-4 border-mieno-navy pl-3">{unit.role}</h3>

                {unit.isSpecial && unit.toggleLabels && (
                    <div className="flex items-center bg-gray-100 rounded-full p-1 relative">
                        {/* Animated Background Pill */}
                        <motion.div
                            className="absolute top-1 bottom-1 bg-mieno-navy rounded-full shadow-sm z-0"
                            initial={false}
                            animate={{
                                left: mode === 'primary' ? '4px' : '50%',
                                right: mode === 'primary' ? '50%' : '4px',
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />

                        <button
                            onClick={() => setMode('primary')}
                            className={`relative z-10 px-4 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 w-1/2 text-center whitespace-nowrap ${mode === 'primary' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {unit.toggleLabels.primary}
                        </button>
                        <button
                            onClick={() => setMode('secondary')}
                            className={`relative z-10 px-4 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 w-1/2 text-center whitespace-nowrap ${mode === 'secondary' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {unit.toggleLabels.secondary}
                        </button>
                    </div>
                )}
            </div>

            <div className="min-h-[120px] flex flex-col justify-center">
                <AnimatePresence mode='wait'>
                    <motion.h2
                        key={currentName}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-mieno-text leading-tight"
                    >
                        {currentName}
                    </motion.h2>
                </AnimatePresence>
            </div>
          </div>

          <div className="min-h-[160px]">
              <AnimatePresence mode='wait'>
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="space-y-6"
                >
                    <p className="text-xl md:text-2xl font-light leading-snug text-gray-800 border-l-2 border-gray-200 pl-4">
                        {currentCopy}
                    </p>
                    <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                        {currentDesc}
                    </p>
                </motion.div>
              </AnimatePresence>
          </div>

          <Link
            href={`/units/${currentSlug}`}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-mieno-navy text-white rounded-full font-bold text-sm tracking-wide hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            詳細を見る
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default function StrategicUnits() {
  return (
    <div className="bg-white text-mieno-text">
      {/* Title Section */}
      <section className="py-24 text-center bg-gray-50">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4"
        >
            <h2 className="text-sm font-bold tracking-[0.3em] text-mieno-navy uppercase mb-4 bg-gray-200 w-fit mx-auto px-4 py-1 rounded-full">
                STRATEGIC UNITS
            </h2>
            <p className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-mieno-text">
                機動戦力
            </p>
            <p className="text-gray-500 text-lg font-light tracking-widest uppercase">
                Power / Precision / Prestige
            </p>
        </motion.div>
      </section>

      {/* Units */}
      {units.map((unit, index) => (
        <UnitSection key={unit.id} unit={unit} index={index} />
      ))}
    </div>
  );
}
