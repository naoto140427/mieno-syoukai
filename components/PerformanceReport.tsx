'use client';

import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface KPI {
  id: string;
  label: string;
  value: number; // 数値型に変更
  format: (val: number) => string; // フォーマット関数
  unit?: string;
  annotation: string;
  target: number; // For animation purposes (percentage or relative value)
}

const kpiData: KPI[] = [
  {
    id: 'mileage',
    label: '総インフラ踏破距離 (Total Mileage)',
    value: 45000,
    format: (val) => val.toLocaleString(),
    unit: 'km+',
    annotation: '地球1周分に迫る、圧倒的な広域モビリティ実績。',
    target: 100,
  },
  {
    id: 'softcream',
    label: '地域経済への直接投資 (Soft Cream Consumption)',
    value: 120,
    format: (val) => Math.round(val).toString(),
    unit: 'Units',
    annotation: '各拠点の道の駅におけるソフトクリーム消費を通じた、持続可能な地域貢献。',
    target: 80,
  },
  {
    id: 'engagement',
    label: 'ステークホルダー・エンゲージメント (Yae Response Rate)',
    value: 92.5,
    format: (val) => val.toFixed(1),
    unit: '%',
    annotation: 'すれ違うライダーからのヤエー（挨拶）返答率。強固なコミュニティ形成の証。',
    target: 92.5,
  },
  {
    id: 'investment',
    label: '戦略的アセット投資 (Tire Replacement)',
    value: 8,
    format: (val) => Math.round(val).toString(),
    unit: 'Sets',
    annotation: '路面との対話を止めないための、惜しみない機材更新。',
    target: 60,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

function AnimatedNumber({ value, format }: { value: number; format: (val: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const displayValue = useTransform(spring, (current) => format(current));

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
}

export default function PerformanceReport() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-mieno-navy relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10" ref={ref}>
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            IR Information
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-300">
            圧倒的な活動実績。
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {kpiData.map((kpi) => (
            <motion.div
              key={kpi.id}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl hover:bg-white/10 transition-colors duration-500"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
                    {kpi.label}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl sm:text-7xl font-bold text-white tracking-tight flex">
                      <AnimatedNumber value={kpi.value} format={kpi.format} />
                    </span>
                    {kpi.unit && (
                      <span className="text-2xl sm:text-3xl font-semibold text-gray-400">
                        {kpi.unit}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar Animation */}
                  <div className="w-full h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${kpi.target}%` } : { width: 0 }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                  </div>

                  <p className="text-base leading-relaxed text-gray-300">
                    {kpi.annotation}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
