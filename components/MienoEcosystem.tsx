'use client';

import { motion } from 'framer-motion';
import { HardDrive, Brain, Radio, Eye, Lock, Wrench, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  description: string;
  copy?: string;
  icon: LucideIcon;
  className: string;
}

const services: Service[] = [
  {
    id: 'drive',
    title: 'Mieno Drive',
    copy: 'すべての記憶を、瞬時に同期。',
    description: 'Google Drive基盤を活用した写真・ログ管理システム。TAMRONの高解像度レンズが捉えた瞬間を、全役員でシームレスに共有。',
    icon: HardDrive,
    className: 'md:col-span-2 md:row-span-2 bg-white',
  },
  {
    id: 'intelligence',
    title: 'Mieno Intelligence',
    description: '気象データと路面状況のリアルタイム解析による、最適な経路の算出。',
    icon: Brain,
    className: 'md:col-span-1 md:row-span-2 bg-white',
  },
  {
    id: 'shareplay',
    title: 'Intercom SharePlay',
    description: 'Cardo Packtalk Edgeによる、ノイズを排したリアルタイム戦略共有と、BGMの完全な同期。',
    icon: Radio,
    className: 'md:col-span-2 md:row-span-1 bg-white',
  },
  {
    id: 'vision',
    title: 'Mieno Vision',
    description: '走行動画の高画質アーカイブ。',
    icon: Eye,
    className: 'md:col-span-1 md:row-span-1 bg-white',
  },
  {
    id: 'care',
    title: 'Mieno Care+',
    description: 'メンバーによる24時間体制の緊急ロードサービスおよびアセット（工具）の共有。',
    icon: Wrench,
    className: 'md:col-span-2 md:row-span-1 bg-white',
  },
  {
    id: 'private',
    title: 'Mieno Private',
    description: 'ナンバープレートの高度な秘匿化アルゴリズム。',
    icon: Lock,
    className: 'md:col-span-1 md:row-span-1 bg-white',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function MienoEcosystem() {
  return (
    <section className="py-24 bg-mieno-gray">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-mieno-navy sm:text-4xl">
            Mieno Ecosystem
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            ハードウェアとソフトウェアの完璧な融合。
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`group relative overflow-hidden rounded-3xl p-6 md:p-8 shadow-sm ring-1 ring-gray-900/5 hover:ring-gray-900/10 transition-all duration-300 ${service.className}`}
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-mieno-navy/5 p-3 group-hover:bg-mieno-navy/10 transition-colors">
                    <service.icon className="h-6 w-6 text-mieno-navy group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold leading-7 text-mieno-navy">
                    {service.title}
                  </h3>
                  {service.copy && (
                    <p className="mt-2 text-lg font-medium text-mieno-navy/90">
                      {service.copy}
                    </p>
                  )}
                  <p className="mt-2 text-base leading-7 text-gray-600">
                    {service.description}
                  </p>
                </div>

                {/* Decorative element for large cards */}
                {service.id === 'drive' && (
                  <div className="mt-8 flex justify-end opacity-50">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-blue-100 to-mieno-gray blur-2xl" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <div className="mt-16 text-center">
            <Link
                href="/contact"
                className="inline-block px-10 py-4 bg-mieno-navy text-white text-lg font-bold rounded-full shadow-lg hover:bg-blue-900 transition-colors shadow-blue-900/20"
            >
                Contact Support
            </Link>
        </div>
      </div>
    </section>
  );
}
