'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { News } from "@/types/database";
import { semanticSearch } from "@/app/actions/news-ai";

export default function NewsPageClient({ initialNews }: { initialNews: News[] }) {
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [aiMatchedIds, setAiMatchedIds] = useState<number[] | null>(null);
    const tabs = ['ALL', 'UPDATE', 'NOTICE', 'TOURING'];

    useEffect(() => {
        const performSearch = async () => {
            if (!searchQuery.trim()) {
                setAiMatchedIds(null);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            try {
                const ids = await semanticSearch(searchQuery, initialNews);
                setAiMatchedIds(ids);
            } catch (error) {
                console.error("AI Search failed", error);
                setAiMatchedIds(null); // Fallback to local search
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(performSearch, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [searchQuery, initialNews]);

    const filteredNews = initialNews.filter(item => {
        // Tab filter
        let tabMatch = false;
        if (activeTab === 'ALL') tabMatch = true;
        else if (activeTab === 'NOTICE') tabMatch = ['PRESS', 'REPORT', 'OTHER'].includes(item.category);
        else tabMatch = item.category === activeTab;

        if (!tabMatch) return false;

        // Search filter
        if (!searchQuery) return true;

        if (aiMatchedIds !== null && aiMatchedIds.length > 0) {
            return aiMatchedIds.includes(item.id);
        }

        // Fallback or empty AI results local search
        const query = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(query) ||
               item.content.toLowerCase().includes(query);
    });

    const isUpcoming = (dateStr?: string) => {
        if (!dateStr) return false;
        const eventDate = new Date(dateStr);
        eventDate.setHours(23, 59, 59, 999);
        return eventDate >= new Date();
    };

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-24">
            <div className="mx-auto max-w-5xl px-6 lg:px-8">
                <div className="mb-12 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-sf-pro-display), sans-serif" }}>
                        最新通達および作戦記録
                    </h1>
                    <p className="text-gray-400 text-lg uppercase tracking-widest font-mono">
                        ALL UPDATES & OPERATIONS
                    </p>
                </div>

                {/* Tabs & Search */}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 md:pb-0 md:flex-wrap">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full text-sm font-bold tracking-widest transition-all whitespace-nowrap ${
                                    activeTab === tab
                                        ? 'bg-white text-black'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-72 shrink-0 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                            {isSearching ? (
                                <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                            ) : (
                                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                            )}
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="AI Search..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-10 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all backdrop-blur-sm"
                        />
                         <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                             <Sparkles className="h-4 w-4 text-blue-500/50" />
                        </div>
                    </div>
                </div>


                <motion.div layout className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {filteredNews.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-gray-500 text-center py-16 border border-white/10 rounded-2xl bg-white/5"
                            >
                                No updates available for this category or search query.
                            </motion.div>
                        ) : (
                            filteredNews.map((item) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4 }}
                                    key={item.id}
                                    className={`group relative overflow-hidden rounded-2xl bg-white/5 border p-6 hover:bg-white/10 transition-colors duration-300 ${item.is_pinned ? "border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-white/10"}`}
                                >
                                    <Link href={`/news/${item.id}`} className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 relative z-10">
                                        {item.image_url && (
                                            <div className="w-full md:w-56 h-48 md:h-32 flex-shrink-0 relative overflow-hidden rounded-xl bg-white/5 border border-white/10">
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 224px"
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-3 flex-1">
                                            <div className="flex items-center gap-4 flex-wrap">
                                                <time className="font-mono text-sm text-gray-400">{item.date.replace(/-/g, '.')}</time>
                                                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-gray-300 ring-1 ring-inset ring-white/20 tracking-widest">
                                                    {item.category}
                                                </span>
                                                {item.is_pinned && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400 ring-1 ring-inset ring-red-500/20 tracking-widest">
                                                        📌 IMPORTANT
                                                    </span>
                                                )}
                                                {item.category === 'TOURING' && item.event_date && (
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-widest ring-1 ring-inset ${
                                                        isUpcoming(item.event_date)
                                                            ? 'bg-green-500/10 text-green-400 ring-green-500/20'
                                                            : 'bg-gray-500/10 text-gray-400 ring-gray-500/20'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${isUpcoming(item.event_date) ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
                                                        {isUpcoming(item.event_date) ? '🟢 作戦待機 (Upcoming)' : '⚪️ 作戦完了 (Completed)'}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold leading-7 text-white group-hover:text-blue-400 transition-colors">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <div className="hidden md:flex items-center">
                                            <ArrowRight className="h-6 w-6 text-gray-500 group-hover:text-blue-400 transition-colors transform group-hover:translate-x-1" />
                                        </div>
                                    </Link>
                                    <Link href={`/news/${item.id}`} className="absolute inset-0 z-0"></Link>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
