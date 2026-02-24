'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowRight, Plus, Edit2, X, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { News as NewsType } from '@/types/database';
import { addNews, updateNews, deleteNews } from '@/app/actions/news';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<NewsType>>({
      title: '',
      date: new Date().toISOString().split('T')[0],
      category: 'UPDATE',
      content: '',
      image_url: ''
  });

  const openModal = (item?: NewsType) => {
      if (item) {
          setCurrentNews(item);
          setFormData({
              title: item.title,
              date: item.date,
              category: item.category,
              content: item.content,
              image_url: item.image_url || ''
          });
      } else {
          setCurrentNews(null);
          setFormData({
              title: '',
              date: new Date().toISOString().split('T')[0],
              category: 'UPDATE',
              content: '',
              image_url: ''
          });
      }
      setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          if (currentNews) {
              await updateNews(currentNews.id, formData);
          } else {
              if (!formData.title || !formData.date || !formData.category || !formData.content) {
                  setIsSubmitting(false);
                  return;
              }
              // Cast to required type since we validated key fields
              await addNews(formData as Omit<NewsType, 'id' | 'created_at'>);
          }
          setIsModalOpen(false);
      } catch (error) {
          console.error("Failed to save news", error);
          // In a real app, show a toast here
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleDelete = async () => {
      if (!currentNews || !confirm("Are you sure you want to delete this item?")) return;
      setIsSubmitting(true);
      try {
          await deleteNews(currentNews.id);
          setIsModalOpen(false);
      } catch (error) {
          console.error("Failed to delete news", error);
      } finally {
          setIsSubmitting(false);
      }
  };

  return (
    <section id="news" className="bg-black py-24 text-white border-t border-white/10 relative">
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
        {news.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No updates available.</div>
        ) : (
            news.map((item) => (
                <motion.div
                key={item.id}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:bg-white/10 transition-colors duration-300"
                >
                <Link href={getLinkForCategory(item.category)} className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
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
                                e.stopPropagation();
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
      <AnimatePresence>
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsModalOpen(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-lg overflow-hidden text-white"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">{currentNews ? 'Edit News' : 'New Entry'}</h3>
                        <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-600"
                                placeholder="Enter title..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value as NewsType['category']})}
                                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white"
                                >
                                    <option value="UPDATE">UPDATE</option>
                                    <option value="PRESS">PRESS</option>
                                    <option value="REPORT">REPORT</option>
                                    <option value="OTHER">OTHER</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Image URL (Optional)</label>
                            <input
                                type="text"
                                value={formData.image_url || ''}
                                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-600"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Content</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.content}
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-600"
                                placeholder="Details..."
                            />
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            {currentNews ? (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isSubmitting}
                                    className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            ) : (
                                <div />
                            )}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-400 font-medium hover:text-white transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-500 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {currentNews ? 'Update' : 'Publish'}
                                </button>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function getLinkForCategory(category: string) {
    switch (category) {
        case 'PRESS': return '/services';
        case 'UPDATE': return '/units';
        case 'REPORT': return '/logistics';
        default: return '/logistics';
    }
}
