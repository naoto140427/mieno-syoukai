'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { News } from "@/types/database";

export default function NewsPageClient({ initialNews }: { initialNews: News[] }) {
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const tabs = ['ALL', 'UPDATE', 'NOTICE', 'TOURING'];

    const filteredNews = initialNews.filter(item => {
        // Tab filter
        let tabMatch = false;
        if (activeTab === 'ALL') tabMatch = true;
        else if (activeTab === 'NOTICE') tabMatch = ['PRESS', 'REPORT', 'OTHER'].includes(item.category);
        else tabMatch = item.category === activeTab;

        if (!tabMatch) return false;

        // Search filter
        if (!searchQuery) return true;

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
                        ALL UPDATES & OPERATIONS
                    </h1>
                    <p className="text-gray-400 text-lg">
                        全通達および作戦行動一覧
                    </p>
                </div>

                {/* Tabs & Search */}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex flex-wrap gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full text-sm font-bold tracking-widest transition-all ${
                                    activeTab === tab
                                        ? 'bg-white text-black'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64 shrink-0">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all backdrop-blur-sm"
                        />
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
                                No updates available for this category.
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
                                            <div className="w-full md:w-56 h-40 md:h-32 flex-shrink-0 relative overflow-hidden rounded-xl bg-white/5 border border-white/10">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                                                        {isUpcoming(item.event_date) ? 'UPCOMING (作戦待機)' : 'COMPLETED (作戦完了)'}
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
