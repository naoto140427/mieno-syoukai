'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const newsItems = [
  {
    id: 1,
    date: '2026.02.15',
    category: 'Fieldwork',
    title: '第1四半期 山梨・長野エリア先行偵察（ゆるキャン巡礼）の作戦要領を公開',
    href: '/logistics', // Linking to logistics as it's relevant
  },
  {
    id: 2,
    date: '2026.01.10',
    category: 'Asset',
    title: '新規機材（SERENA LUXION 2025）導入によるロジスティクス効率化の検証',
    href: '/units', // Linking to units
  },
  {
    id: 3,
    date: '2025.12.20',
    category: 'Corporate',
    title: '冬季休暇中の兵站（ロードサービス）維持体制について',
    href: '/services', // Linking to services
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function News() {
  return (
    <section id="news" className="bg-black py-24 text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Latest Updates
            </h2>
            <p className="mt-2 text-gray-400">
              組織からの最新通達事項
            </p>
          </motion.div>
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
          >
             <Link href="/logistics" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white flex items-center gap-1">
               View All <ArrowRight className="h-4 w-4" />
             </Link>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-4"
        >
          {newsItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:bg-white/10 transition-colors duration-300"
            >
              <Link href={item.href} className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="flex items-center gap-4 min-w-fit">
                  <time className="font-mono text-sm text-gray-400">{item.date}</time>
                  <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-white/20">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-lg font-medium leading-6 text-white group-hover:text-blue-400 transition-colors flex-1">
                  {item.title}
                </h3>
                <div className="hidden md:block">
                    <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
