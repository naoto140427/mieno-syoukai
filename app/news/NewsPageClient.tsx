'use client';

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Sparkles, Loader2, Pin, Calendar, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { News } from "@/types/database";
import { semanticSearch } from "@/app/actions/news-ai";

const TABS = [
  { key: 'ALL',     label: '全て',    en: 'ALL' },
  { key: 'TOURING', label: 'ツーリング', en: 'TOURING' },
  { key: 'UPDATE',  label: '更新',    en: 'UPDATE' },
  { key: 'NOTICE',  label: 'その他',  en: 'OTHER' },
] as const;

type TabKey = typeof TABS[number]['key'];

const CATEGORY_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  TOURING: { bg: 'bg-blue-50',   text: 'text-blue-700',  label: 'TOURING' },
  UPDATE:  { bg: 'bg-gray-100',  text: 'text-gray-600',  label: 'UPDATE'  },
  PRESS:   { bg: 'bg-purple-50', text: 'text-purple-700', label: 'PRESS'  },
  REPORT:  { bg: 'bg-green-50',  text: 'text-green-700', label: 'REPORT'  },
  OTHER:   { bg: 'bg-gray-100',  text: 'text-gray-500',  label: 'OTHER'   },
};

const isUpcoming = (dateStr?: string) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  d.setHours(23, 59, 59, 999);
  return d >= new Date();
};

export default function NewsPageClient({ initialNews }: { initialNews: News[] }) {
  const [activeTab, setActiveTab] = useState<TabKey>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiMatchedIds, setAiMatchedIds] = useState<number[] | null>(null);

  // AI semantic search (debounced 500ms)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setAiMatchedIds(null);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const ids = await semanticSearch(searchQuery, initialNews);
        setAiMatchedIds(ids);
      } catch {
        setAiMatchedIds(null);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, initialNews]);

  const filteredNews = useMemo(() => {
    return initialNews.filter(item => {
      // Tab filter
      const tabMatch =
        activeTab === 'ALL' ? true :
        activeTab === 'TOURING' ? item.category === 'TOURING' :
        activeTab === 'UPDATE'  ? item.category === 'UPDATE'  :
        activeTab === 'NOTICE'  ? ['PRESS', 'REPORT', 'OTHER'].includes(item.category) :
        false;
      if (!tabMatch) return false;

      // Search filter
      if (!searchQuery.trim()) return true;
      if (aiMatchedIds !== null) return aiMatchedIds.includes(item.id);
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q);
    });
  }, [initialNews, activeTab, searchQuery, aiMatchedIds]);

  const pinnedItems   = filteredNews.filter(n => n.is_pinned);
  const regularItems  = filteredNews.filter(n => !n.is_pinned);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* ── Page Header ─────────────────────────────── */}
      <div className="bg-white border-b border-gray-200/60">
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-8">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-2">MIENO CORP. — 最新通達</p>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-3">
              NEWS
            </h1>
            <p className="text-gray-500 text-base">組織からの最新通達・作戦情報</p>
          </motion.div>
        </div>
      </div>

      {/* ── Sticky Filter Bar ────────────────────────── */}
      <div className="sticky top-14 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="max-w-5xl mx-auto px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tab pills */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold tracking-widest whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-mieno-navy text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {tab.en}
              </button>
            ))}
          </div>

          {/* AI Search */}
          <div className="relative shrink-0 w-full sm:w-64 group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
              {isSearching
                ? <Loader2 className="h-3.5 w-3.5 text-blue-400 animate-spin" />
                : <Search className="h-3.5 w-3.5 text-gray-400 group-focus-within:text-mieno-blue transition-colors" />
              }
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="AI Search..."
              className="w-full bg-[#F5F5F7] border border-gray-200 rounded-full py-2 pl-9 pr-9 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mieno-blue/30 focus:border-mieno-blue transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none z-10">
              <Sparkles className="h-3.5 w-3.5 text-blue-400/60" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8 lg:py-10">

        {/* Result count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-bold font-mono text-gray-400 tracking-widest">
            {filteredNews.length} RESULT{filteredNews.length !== 1 ? 'S' : ''}
            {searchQuery && <span className="text-mieno-blue ml-2">— AI SEARCH</span>}
          </p>
        </div>

        <motion.div layout className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredNews.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 text-center bg-white rounded-2xl border border-gray-100"
              >
                <Search className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-300 tracking-widest uppercase">No results found</p>
              </motion.div>
            ) : (
              <>
                {/* Pinned items */}
                {pinnedItems.map((item, i) => (
                  <NewsCard key={`pinned-${item.id}`} item={item} index={i} isPinned />
                ))}
                {/* Regular items */}
                {regularItems.map((item, i) => (
                  <NewsCard key={item.id} item={item} index={pinnedItems.length + i} />
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

// ── NewsCard ─────────────────────────────────────────────────────
function NewsCard({ item, index, isPinned = false }: { item: News; index: number; isPinned?: boolean }) {
  const catStyle = CATEGORY_STYLE[item.category] ?? CATEGORY_STYLE.OTHER;
  const upcoming = isUpcoming(item.event_date);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Link
        href={`/news/${item.id}`}
        prefetch={false}
        className={`group flex gap-5 bg-white rounded-2xl p-5 border transition-all hover:shadow-md hover:-translate-y-0.5 ${
          isPinned
            ? 'border-rose-200 shadow-[0_0_0_1px_rgba(239,68,68,0.1)] hover:border-rose-300'
            : 'border-gray-100 hover:border-gray-200'
        }`}
      >
        {/* Thumbnail */}
        {item.image_url && (
          <div className="hidden sm:block w-24 h-20 shrink-0 relative overflow-hidden rounded-xl bg-gray-50">
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              sizes="96px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={index === 0}
            />
          </div>
        )}

        {/* Body */}
        <div className="flex-1 min-w-0">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {isPinned && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 tracking-widest uppercase">
                <Pin size={10} className="fill-rose-400" />
                PINNED
              </span>
            )}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-widest ${catStyle.bg} ${catStyle.text}`}>
              {catStyle.label}
            </span>
            {item.category === 'TOURING' && item.event_date && (
              <span className={`flex items-center gap-1 text-[10px] font-bold tracking-widest ${upcoming ? 'text-emerald-600' : 'text-gray-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${upcoming ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                {upcoming ? 'UPCOMING' : 'COMPLETED'}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 group-hover:text-mieno-blue transition-colors leading-snug mb-1.5 line-clamp-2">
            {item.title}
          </h3>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 font-mono">
            <time>{item.date.replace(/-/g, '.')}</time>
            {item.event_date && (
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {item.event_date.replace(/-/g, '.')}
              </span>
            )}
            {item.location && (
              <span className="flex items-center gap-1">
                <MapPin size={10} />
                {item.location}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden sm:flex items-center self-center shrink-0">
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-mieno-blue group-hover:translate-x-0.5 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}
