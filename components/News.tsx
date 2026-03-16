'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { News as NewsType } from '@/types/database';
import { addNews, updateNews, deleteNews } from '@/app/actions/news';
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

  const isUpcoming = (dateStr?: string) => {
      if (!dateStr) return false;
      const eventDate = new Date(dateStr);
      eventDate.setHours(23, 59, 59, 999);
      return eventDate >= new Date();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const openModal = (item?: NewsType) => {
      if (item) {
          setCurrentNews(item);
      } else {
          setCurrentNews(null);
      }
      setIsModalOpen(true);
  };

  const handleSave = async (formData: Omit<NewsType, 'id' | 'created_at'>) => {
      try {
          if (currentNews) {
              await updateNews(currentNews.id, formData);
          } else {
              await addNews(formData);
          }
      } catch (error) {
          console.error("Failed to save news", error);
          throw error; // Re-throw to be handled by modal
      }
  };

  const handleDelete = async () => {
      if (!currentNews) return;
      try {
          await deleteNews(currentNews.id);
      } catch (error) {
          console.error("Failed to delete news", error);
          throw error;
      }
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
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Latest Updates
              </h2>
              {isAdmin && mounted && (
                <motion.button
                  onClick={() => openModal()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-lg shadow-blue-900/20 w-fit"
                >
                  <Plus className="w-4 h-4" />
                  <span>＋ NEW UPDATE (新規通達を発令)</span>
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
                <div className="text-gray-500 text-center py-8 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">No updates available.</div>
        ) : (
            news.map((item) => (
                <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className={`group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-md border p-6 hover:bg-white/10 transition-colors duration-300 ${item.is_pinned ? "border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-white/10"}`}
                >
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 relative">
                        {/* Interactive Area Link */}
                        <Link href={`/news/${item.id}`} className="absolute inset-0 z-0"></Link>

                        {item.image_url && (
                            <div className="w-full md:w-48 h-32 md:h-28 flex-shrink-0 relative overflow-hidden rounded-lg border border-white/10 bg-white/5 z-10 pointer-events-none">
                                <Image
                                    src={item.image_url}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 192px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        )}
                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 flex-1 z-10 pointer-events-none">
                            <div className="flex items-center gap-4 min-w-fit flex-wrap">
                            <time className="font-mono text-sm text-gray-400">{item.date.replace(/-/g, '.')}</time>
                            <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-1 text-xs font-bold text-gray-300 ring-1 ring-inset ring-white/20 tracking-widest">
                                {item.category}
                            </span>
                            {item.is_pinned && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs font-bold text-red-400 ring-1 ring-inset ring-red-500/20 tracking-widest">
                                    📌 IMPORTANT
                                </span>
                            )}
                            {item.category === 'TOURING' && item.event_date && (
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-bold tracking-widest ring-1 ring-inset ${
                                    isUpcoming(item.event_date)
                                        ? 'bg-green-500/10 text-green-400 ring-green-500/20'
                                        : 'bg-gray-500/10 text-gray-400 ring-gray-500/20'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isUpcoming(item.event_date) ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
                                    {isUpcoming(item.event_date) ? '🟢 作戦待機 (Upcoming)' : '⚪️ 作戦完了 (Completed)'}
                                </span>
                            )}
                            </div>
                            <h3 className="text-lg font-medium leading-6 text-white group-hover:text-blue-400 transition-colors flex-1">
                            {item.title}
                            </h3>
                        </div>
                        <div className="hidden md:flex items-center gap-4 z-20">
                            {isAdmin && mounted && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            openModal(item);
                                        }}
                                        className="p-2 bg-white/10 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (confirm("Are you sure you want to delete this news item?")) {
                                                try {
                                                    await deleteNews(item.id);
                                                } catch (err) {
                                                    console.error(err);
                                                }
                                            }
                                        }}
                                        className="p-2 bg-white/10 rounded-full hover:bg-red-600 hover:text-white transition-colors text-red-400"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </motion.div>
            ))
        )}
        </motion.div>
      </div>

      {/* Admin Modal */}
      {mounted && (
          <NewsModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSave}
              onDelete={currentNews ? handleDelete : undefined}
              initialData={currentNews}
          />
      )}
    </section>
  );
}
