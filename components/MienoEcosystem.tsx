'use client';

import { motion } from 'framer-motion';
import { Wrench, Map, Database, LucideIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  sub: string;
  description: string;
  icon: LucideIcon;
  className: string;
}

const services: Service[] = [
  {
    id: 'fleet',
    title: '次世代モビリティ運用',
    sub: 'FLEET MANAGEMENT',
    description: '高度な機体管理と保守。',
    icon: Wrench,
    className: 'md:col-span-1 bg-white',
  },
  {
    id: 'logistics',
    title: '戦略的ロジスティクス',
    sub: 'STRATEGIC LOGISTICS',
    description: '長距離ツーリング・野営の最適化。',
    icon: Map,
    className: 'md:col-span-1 bg-white',
  },
  {
    id: 'integration',
    title: 'デジタル基盤開発',
    sub: 'SYSTEM INTEGRATION',
    description: '独自開発のERP・ガレージシステムの構築。',
    icon: Database,
    className: 'md:col-span-1 bg-white',
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
    <section className="py-24 bg-mieno-gray min-h-screen flex flex-col justify-center">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-mieno-navy sm:text-4xl uppercase">
            事業領域
            <span className="block text-sm font-medium tracking-widest text-gray-400 mt-2">SERVICES</span>
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
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`group relative overflow-hidden rounded-3xl p-8 shadow-sm ring-1 ring-gray-900/5 hover:ring-gray-900/10 transition-all duration-300 bg-white`}
            >
              <div className="flex flex-col h-full justify-between gap-6">
                <div>
                  <div className="mb-6 inline-flex items-center justify-center rounded-xl bg-mieno-navy/5 p-4 group-hover:bg-mieno-navy/10 transition-colors">
                    <service.icon className="h-8 w-8 text-mieno-navy group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-mieno-navy mb-1">
                    {service.title}
                  </h3>
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
                    {service.sub}
                  </p>
                  <p className="text-base leading-7 text-gray-600">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <div className="mt-20 text-center">
            <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-mieno-navy text-white text-lg font-bold rounded-full shadow-lg hover:bg-blue-900 transition-all hover:pr-6"
            >
                Contact Support
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>
        </div>
      </div>
    </section>
  );
}
