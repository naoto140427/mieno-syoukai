'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Plus, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { News as NewsType } from '@/types/database';

const supabase = createClient();

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
  isAdmin?: boolean;
}

export default function News({ isAdmin = false }: NewsProps) {
  const [newsItems, setNewsItems] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        setNewsItems(data || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

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
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Latest Updates
              </h2>
              {isAdmin && (
                <motion.button
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

        {loading ? (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-white/5 border border-white/10 p-6 rounded-xl h-24"></div>
                ))}
            </div>
        ) : (
            <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-4"
            >
            {newsItems.length === 0 ? (
                 <div className="text-gray-500 text-center py-8">No updates available.</div>
            ) : (
                newsItems.map((item) => (
                    <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:bg-white/10 transition-colors duration-300"
                    >
                    <Link href={getLinkForCategory(item.category)} className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                        <div className="flex items-center gap-4 min-w-fit">
                        <time className="font-mono text-sm text-gray-400">{item.date.replace(/-/g, '.')}</time>
                        <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-inset ring-white/20">
                            {item.category}
                        </span>
                        </div>
                        <h3 className="text-lg font-medium leading-6 text-white group-hover:text-blue-400 transition-colors flex-1">
                        {item.title}
                        </h3>
                        <div className="hidden md:flex items-center gap-4">
                            {isAdmin && (
                              <button
                                onClick={(e) => { e.preventDefault(); /* Edit logic */ }}
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
        )}
      </div>
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
