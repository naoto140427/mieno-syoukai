'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Printer, MapPin, Calendar, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import { News as NewsType } from '@/types/database';
import ReactMarkdown from 'react-markdown';

interface NewsDetailClientProps {
    news: NewsType;
}

export default function NewsDetailClient({ news }: NewsDetailClientProps) {
    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${news.title} | MIENO CORP.`,
                    text: news.content.substring(0, 100),
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('URL copied to clipboard.');
        }
    };

    return (
        <article className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mb-12 flex items-center justify-between border-b border-white/10 pb-6 print:hidden"
            >
                <Link
                    href="/#news"
                    className="group flex items-center gap-2 text-sm font-bold tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    BACK TO BASE
                </Link>
                <div className="flex gap-4">
                    <button
                        onClick={handleShare}
                        className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Share Document"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handlePrint}
                        className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Print Document"
                    >
                        <Printer className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>

            <motion.header
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mb-16 text-center"
            >
                <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 ring-1 ring-inset ring-blue-500/20 tracking-widest">
                        {news.category}
                    </span>
                    <time className="font-mono text-sm text-gray-500 tracking-wider">
                        {news.date.replace(/-/g, '.')}
                    </time>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-8 leading-tight">
                    {news.title}
                </h1>

                {news.image_url && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 mt-12 bg-white/5"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={news.image_url}
                            alt={news.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </motion.div>
                )}
            </motion.header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl mx-auto"
            >
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-[2.2] tracking-wide prose-p:mb-6 prose-p:font-medium prose-p:text-lg prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline">
                    <ReactMarkdown>{news.content}</ReactMarkdown>
                </div>

                {news.category === 'TOURING' && (news.event_date || news.location || news.requirements) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-8"
                    >
                        <h2 className="text-xl font-bold tracking-widest text-white mb-8 flex items-center gap-3 uppercase">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            Operation Details
                            <span className="text-xs text-gray-500 font-mono tracking-widest ml-2 hidden sm:inline">作戦詳細</span>
                        </h2>

                        <div className="space-y-6">
                            {news.event_date && (
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 shrink-0">
                                        <Calendar className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-1">Date</h3>
                                        <p className="text-lg text-white font-mono">{news.event_date}</p>
                                    </div>
                                </div>
                            )}

                            {news.location && (
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 shrink-0">
                                        <MapPin className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-1">Rendezvous Point</h3>
                                        <p className="text-lg text-white">{news.location}</p>
                                    </div>
                                </div>
                            )}

                            {news.requirements && (
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 shrink-0">
                                        <ClipboardCheck className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-1">Requirements</h3>
                                        <p className="text-lg text-white">{news.requirements}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}


                <div className="mt-24 pt-8 border-t border-white/10 text-center flex flex-col items-center">
                    <div className="w-12 h-1 bg-blue-600 rounded-full mb-8 opacity-50"></div>
                    <p className="font-mono text-xs text-gray-600 tracking-[0.3em] uppercase">END OF TRANSMISSION</p>
                    <p className="font-bold text-sm text-gray-500 mt-2 tracking-widest">MIENO CORP. STRATEGIC INTELLIGENCE</p>
                </div>
            </motion.div>
        </article>
    );
}
