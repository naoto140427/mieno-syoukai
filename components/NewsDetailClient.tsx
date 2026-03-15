'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Printer } from 'lucide-react';
import Link from 'next/link';
import { News as NewsType } from '@/types/database';

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
                <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-[2.2] tracking-wide">
                    {/* Render content preserving line breaks */}
                    {news.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-6 font-medium text-lg min-h-[1.5em]">
                            {paragraph}
                        </p>
                    ))}
                </div>

                <div className="mt-24 pt-8 border-t border-white/10 text-center flex flex-col items-center">
                    <div className="w-12 h-1 bg-blue-600 rounded-full mb-8 opacity-50"></div>
                    <p className="font-mono text-xs text-gray-600 tracking-[0.3em] uppercase">END OF TRANSMISSION</p>
                    <p className="font-bold text-sm text-gray-500 mt-2 tracking-widest">MIENO CORP. STRATEGIC INTELLIGENCE</p>
                </div>
            </motion.div>
        </article>
    );
}
