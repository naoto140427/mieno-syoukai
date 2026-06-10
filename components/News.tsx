'use client';

import { useState, useEffect } from 'react';
import { m, Variants } from 'framer-motion';
import { ArrowRight, Plus, Edit2, Trash2, Calendar, MapPin, Pin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { News as NewsType } from '@/types/database';
import { deleteNews } from '@/app/actions/news';
import NewsModal from './NewsModal';
import ClientMotionWrapper from '@/components/ClientMotionWrapper';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

const CATEGORY_STYLE: Record<string, { bg: string; text: string }> = {
  TOURING: { bg: 'bg-blue-50',   text: 'text-blue-700'  },
  UPDATE:  { bg: 'bg-gray-100',  text: 'text-gray-600'  },
  PRESS:   { bg: 'bg-purple-50', text: 'text-purple-700' },
  REPORT:  { bg: 'bg-green-50',  text: 'text-green-700' },
  OTHER:   { bg: 'bg-gray-100',  text: 'text-gray-500'  },
};

interface NewsProps {
  news?: NewsType[];
  isAdmin?: boolean;
}

export default function News({ news = [], isAdmin = false }: NewsProps) {
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [currentNews, setCurrentNews]   = useState<NewsType | null>(null);
  const [deletingId, setDeletingId]     = useState<number | null>(null);
  const [mounted, setMounted]           = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isUpcoming = (dateStr?: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    d.setHours(23, 59, 59, 999);
    return d >= new Date();
  };

  const openModal = (item?: NewsType) => {
    setCurrentNews(item ?? null);
    setIsModalOpen(true);
  };

  const handleSave = async (formData: Omit<NewsType, 'id' | 'created_at'>) => {
    const { addNews, updateNews } = await import('@/app/actions/news');
    if (currentNews) {
      await updateNews(currentNews.id, formData);
    } else {
      await addNews(formData);
    }
  };

  const handleDelete = async () => {
    if (!currentNews) return;
    await deleteNews(currentNews.id);
  };

  const handleQuickDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteNews(id);
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ClientMotionWrapper>
      <section id="news" className="bg-[#F5F5F7] py-20 border-t border-gray-100 relative z-10">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">

          {/* Section header */}
          <div className="flex items-end justify-between mb-10">
            <m.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[10px] font-black text-gray-400 tracking-[0.25em] uppercase mb-1">MIENO CORP.</p>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">最新通達</h2>
              <p className="text-xs text-gray-400 mt-1 font-medium">Latest Updates</p>
            </m.div>

            <m.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              {isAdmin && mounted && (
                <button
                  onClick={() => openModal()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-mieno-navy text-white text-[11px] font-bold rounded-full tracking-widest hover:bg-mieno-blue transition-all shadow-sm active:scale-95"
                >
                  <Plus size={13} /> 新規通達
                </button>
              )}
              <Link
                href="/news"
                className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-mieno-navy transition-colors tracking-widest"
              >
                すべて見る <ArrowRight size={13} />
              </Link>
            </m.div>
          </div>

          {/* News cards */}
          {news.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-12 bg-white rounded-2xl border border-gray-100">
              通達はありません
            </div>
          ) : (
            <m.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="space-y-3"
            >
              {news.map((item) => {
                const catStyle = CATEGORY_STYLE[item.category] ?? CATEGORY_STYLE.OTHER;
                return (
                  <m.div
                    key={item.id}
                    variants={itemVariants}
                    className={`group relative bg-white rounded-2xl border transition-all overflow-hidden ${
                      item.is_pinned
                        ? 'border-rose-100 shadow-sm'
                        : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <Link href={`/news/${item.id}`} prefetch={false} className="absolute inset-0 z-10" />

                    <div className="flex items-center gap-4 p-5 relative">
                      {/* Thumbnail */}
                      {item.image_url && (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100 z-10 pointer-events-none">
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            sizes="80px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0 z-10 pointer-events-none">
                        {/* Badges row */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full tracking-widest ${catStyle.bg} ${catStyle.text}`}>
                            {item.category}
                          </span>
                          {item.is_pinned && (
                            <span className="text-[9px] font-bold text-rose-500 flex items-center gap-0.5">
                              <Pin size={9} className="fill-current" /> PINNED
                            </span>
                          )}
                          {item.category === 'TOURING' && item.event_date && (
                            <span className={`text-[9px] font-bold tracking-widest flex items-center gap-1 ${
                              isUpcoming(item.event_date) ? 'text-emerald-600' : 'text-gray-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isUpcoming(item.event_date) ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                              {isUpcoming(item.event_date) ? 'UPCOMING' : 'COMPLETED'}
                            </span>
                          )}
                          <time className="text-[9px] font-mono text-gray-400 ml-auto">
                            {item.date.replace(/-/g, '.')}
                          </time>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-mieno-blue transition-colors">
                          {item.title}
                        </h3>

                        {/* TOURING meta */}
                        {item.category === 'TOURING' && (item.event_date || item.location) && (
                          <div className="flex flex-wrap gap-3 mt-1.5">
                            {item.event_date && (
                              <span className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                                <Calendar size={10} /> {item.event_date.replace(/-/g, '.')}
                              </span>
                            )}
                            {item.location && (
                              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                <MapPin size={10} /> {item.location}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Admin actions */}
                      {isAdmin && mounted && (
                        <div className="hidden sm:flex items-center gap-2 z-20 shrink-0">
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); openModal(item); }}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={(e) => handleQuickDelete(e, item.id)}
                            disabled={deletingId === item.id}
                            className="p-2 rounded-full hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-colors disabled:opacity-40"
                          >
                            {deletingId === item.id
                              ? <div className="w-3.5 h-3.5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                              : <Trash2 size={14} />
                            }
                          </button>
                        </div>
                      )}

                      {/* Arrow */}
                      <ArrowRight size={16} className="text-gray-300 group-hover:text-mieno-blue group-hover:translate-x-0.5 transition-all z-10 pointer-events-none shrink-0" />
                    </div>
                  </m.div>
                );
              })}
            </m.div>
          )}
        </div>
      </section>

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
    </ClientMotionWrapper>
  );
}
