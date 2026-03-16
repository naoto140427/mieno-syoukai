'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Plus, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { News as NewsType } from '@/types/database';
import NewsModal from './NewsModal';

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

interface NewsProps {
  news?: NewsType[];
  isAdmin?: boolean;
}

export default function News({ news = [], isAdmin = false }: NewsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState<NewsType | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openModal = (item?: NewsType) => {
      setCurrentNews(item || null);
      setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setCurrentNews(null);
  };

  return (
    <section id="news" className="bg-black py-24 text-white border-t border-white/10 relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Latest Updates
              </h2>
              {isAdmin && (
                <motion.button
                  onClick={() => openModal()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow-lg shadow-blue-900/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>NEW ENTRY</span>
                </motion.button>
              )}
            </div>
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
             <Link href="/news" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white flex items-center gap-1">
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
        {news.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No updates available.</div>
        ) : (
            news.map((item) => (
                <motion.div
                key={item.id}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:bg-white/10 transition-colors duration-300"
                >
                <Link href={getLinkForCategory(item.id)} className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    {item.image_url && (
                        <div className="w-full md:w-48 h-32 md:h-28 flex-shrink-0 relative overflow-hidden rounded-lg border border-white/10 bg-white/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 flex-1">
                        <div className="flex items-center gap-4 min-w-fit">
                        <time className="font-mono text-sm text-gray-400">{item.date.replace(/-/g, '.')}</time>
                        <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-white/20">
                            {item.category}
                        </span>
                        </div>
                        <h3 className="text-lg font-medium leading-6 text-white group-hover:text-blue-400 transition-colors flex-1">
                        {item.title}
                        </h3>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        {isAdmin && (
                            <button
                            onClick={(e) => {
                                e.preventDefault();
                                openModal(item);
                            }}
                            className="p-2 bg-white/10 rounded-full hover:bg-blue-600 hover:text-white transition-colors z-20"
                            >
                            <Edit2 className="w-4 h-4" />
                            </button>
                        )}
                        <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
                    </div>
                </Link>
                </motion.div>
            ))
        )}
        </motion.div>
      </div>

      {/* Admin Modal */}
      {mounted && createPortal(
        <NewsModal isOpen={isModalOpen} onClose={closeModal} currentNews={currentNews} />,
        document.body
      )}
    </section>
  );
}

function getLinkForCategory(id: number) {
    return `/news/${id}`;
}
