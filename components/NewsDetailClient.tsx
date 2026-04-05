'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Share2, Printer, MapPin, Calendar, ClipboardCheck, Send, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { submitSurvey } from '@/app/actions/survey';
import Link from 'next/link';
import Image from 'next/image';
import { News as NewsType } from '@/types/database';
import ReactMarkdown from 'react-markdown';

interface NewsDetailClientProps {
    news: NewsType;
}

export default function NewsDetailClient({ news, hideLegacySurvey }: NewsDetailClientProps & { hideLegacySurvey?: boolean }) {
    const [rsvpStatus, setRsvpStatus] = useState<'JOIN' | 'PENDING' | 'DECLINE' | null>(null);
    const [agentName, setAgentName] = useState('');
    const [vehicleInfo, setVehicleInfo] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hasSentPreviously, setHasSentPreviously] = useState(false);

    useEffect(() => {
        const sent = localStorage.getItem(`rsvp_sent_${news.id}`);
        if (sent) {
            setHasSentPreviously(true);
        }
    }, [news.id]);

    const handleSurveySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rsvpStatus || !agentName.trim()) return;

        setIsSubmitting(true);
        try {
            await submitSurvey({
                news_id: news.id,
                agent_name: agentName,
                attendance_status: rsvpStatus,
                vehicle_info: vehicleInfo,
                message: notes,
            });
            setIsSubmitted(true);
            setHasSentPreviously(true);
            localStorage.setItem(`rsvp_sent_${news.id}`, 'true');
        } catch (error) {
            console.error('Failed to submit RSVP:', error);
            alert('通信エラーが発生しました。再度お試しください。');
        } finally {
            setIsSubmitting(false);
        }
    };

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
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mb-12 flex items-center justify-between border-b border-white/10 pb-6 print:hidden"
            >
                <Link
                    href="/news"
                    className="group flex items-center gap-2 text-sm font-bold tracking-widest text-gray-400 hover:text-white transition-colors uppercase"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    ← 通達一覧へ戻る
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
                <h1 className="text-2xl md:text-5xl font-bold tracking-tight text-white mb-8 leading-tight">
                    {news.title}
                </h1>

                {news.image_url && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 mt-12 bg-white/5"
                    >
                        <Image
                            src={news.image_url}
                            alt={news.title}
                            fill
                            sizes="(max-width: 896px) 100vw, 896px"
                            className="object-cover"
                            priority
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

                {(news.category === 'TOURING' && !hideLegacySurvey) && (news.event_date || news.location || news.requirements) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8"
                    >
                        <h2 className="text-xl font-bold tracking-widest text-white mb-8 flex items-center gap-3 uppercase">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            作戦詳細
                            <span className="text-xs text-gray-500 font-mono tracking-widest ml-2 hidden sm:inline">OPERATION DETAILS</span>
                        </h2>

                        <div className="flex flex-col gap-6">
                            {news.event_date && (
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 shrink-0">
                                        <Calendar className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-1">開催日時</h3>
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
                                        <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-1">集合場所</h3>
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
                                        <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-1">参加条件</h3>
                                        <p className="text-lg text-white">{news.requirements}</p>
                                    </div>
                                </div>
                            )}

                            {news.event_date && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="pt-6 border-t border-white/10"
                                >
                                    <a
                                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(news.title)}&dates=${news.event_date.replace(/-/g, '')}T000000Z/${news.event_date.replace(/-/g, '')}T235959Z&details=${encodeURIComponent(news.content)}&location=${encodeURIComponent(news.location || '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold tracking-widest rounded-full hover:bg-gray-200 transition-colors uppercase text-sm"
                                    >
                                        📅 ADD TO CALENDAR
                                        <span className="text-xs text-gray-500 font-mono tracking-widest ml-2 hidden sm:inline">(カレンダーに追加)</span>
                                    </a>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}



                {(news.category === 'TOURING' && !hideLegacySurvey) && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mt-16 bg-[#111] border border-white/10 rounded-3xl p-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                        <h2 className="text-xl font-bold tracking-widest text-white mb-8 flex items-center gap-3 uppercase relative z-10">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            DEPLOYMENT RSVP
                            <span className="text-xs text-gray-500 font-mono tracking-widest ml-2 hidden sm:inline">参加ステータス入力</span>
                        </h2>


                        {hasSentPreviously || isSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative z-10 flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-center shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl pointer-events-none"></div>
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-white tracking-widest mb-3 uppercase">Deployment Status:<br/>Transmitted</h3>
                                <p className="text-emerald-300/80 font-mono text-xs md:text-sm tracking-widest uppercase mb-6 px-4 py-2 bg-emerald-900/30 rounded-lg border border-emerald-500/20">あなたが送信したステータスは司令部に記録されました</p>
                                <div className="w-16 h-[1px] bg-white/20 mb-6"></div>
                                <p className="text-gray-500 font-mono text-[10px] tracking-[0.2em] uppercase">Mieno Corp. Strategic HQ</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSurveySubmit} className="relative z-10 space-y-8">
                                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                                    {[
                                        { value: 'JOIN', label: '🟢 JOIN', sub: '参加' },
                                        { value: 'PENDING', label: '🟡 PENDING', sub: '未定' },
                                        { value: 'DECLINE', label: '🔴 DECLINE', sub: '不参加' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setRsvpStatus(opt.value as any)}
                                            className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold tracking-widest transition-all ${rsvpStatus === opt.value ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            <div className="flex flex-col items-center gap-1">
                                                <span>{opt.label}</span>
                                                <span className={`text-[10px] ${rsvpStatus === opt.value ? 'text-gray-600' : 'text-gray-500'}`}>{opt.sub}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <AnimatePresence>
                                    {rsvpStatus && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className="space-y-6 overflow-hidden"
                                        >
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 tracking-widest uppercase mb-2">Agent Name (名前) *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={agentName}
                                                    onChange={(e) => setAgentName(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
                                                    placeholder="e.g. Maverick"
                                                />
                                            </div>

                                            <AnimatePresence>
                                                {(rsvpStatus === 'JOIN' || rsvpStatus === 'PENDING') && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                                        className="space-y-6 overflow-hidden"
                                                    >
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-500 tracking-widest uppercase mb-2">Vehicle (搭乗機体)</label>
                                                            <input
                                                                type="text"
                                                                value={vehicleInfo}
                                                                onChange={(e) => setVehicleInfo(e.target.value)}
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
                                                                placeholder="e.g. CBR600RR"
                                                            />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 tracking-widest uppercase mb-2">Notes (特記事項)</label>
                                                <textarea
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    rows={3}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-y font-mono"
                                                    placeholder="合流場所の希望や遅刻・早退の予定など..."
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting || !agentName.trim()}
                                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5" />
                                                        TRANSMIT STATUS
                                                    </>
                                                )}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        )}
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
