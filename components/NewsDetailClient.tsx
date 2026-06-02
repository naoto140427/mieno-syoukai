'use client';

import { m, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Share2, Calendar, MapPin,
  ClipboardCheck, Send, CheckCircle2, Link2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { submitSurvey } from '@/app/actions/survey';
import Link from 'next/link';
import Image from 'next/image';
import { News as NewsType } from '@/types/database';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ClientMotionWrapper from '@/components/ClientMotionWrapper';

interface NewsDetailClientProps {
  news: NewsType;
  hideLegacySurvey?: boolean;
}

const CATEGORY_STYLE: Record<string, { bg: string; text: string }> = {
  TOURING: { bg: 'bg-blue-50',   text: 'text-blue-700'  },
  UPDATE:  { bg: 'bg-gray-100',  text: 'text-gray-600'  },
  PRESS:   { bg: 'bg-purple-50', text: 'text-purple-700' },
  REPORT:  { bg: 'bg-green-50',  text: 'text-green-700' },
  OTHER:   { bg: 'bg-gray-100',  text: 'text-gray-500'  },
};

export default function NewsDetailClient({ news, hideLegacySurvey }: NewsDetailClientProps) {
  const [rsvpStatus, setRsvpStatus]   = useState<'JOIN' | 'PENDING' | 'DECLINE' | null>(null);
  const [agentName, setAgentName]     = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [notes, setNotes]             = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted]   = useState(false);
  const [hasSentPreviously, setHasSentPreviously] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copied, setCopied]           = useState(false);

  useEffect(() => {
    if (localStorage.getItem(`rsvp_sent_${news.id}`)) {
      setHasSentPreviously(true);
    }
  }, [news.id]);

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpStatus || !agentName.trim()) return;
    setIsSubmitting(true);
    setSubmitError(null);
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
      setSubmitError('送信に失敗しました。再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${news.title} | MIENO CORP.`, url: window.location.href });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const catStyle = CATEGORY_STYLE[news.category] ?? CATEGORY_STYLE.OTHER;

  return (
    <ClientMotionWrapper>
      <div className="min-h-screen bg-[#F5F5F7]">

        {/* ── Sticky top bar ───────────────────────── */}
        <div className="sticky top-14 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 print:hidden">
          <div className="max-w-4xl mx-auto px-6 h-12 flex items-center justify-between">
            <Link
              href="/news"
              className="group flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-mieno-navy transition-colors tracking-widest uppercase"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              通達一覧
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-gray-500 hover:text-mieno-navy hover:bg-gray-100 transition-all border border-gray-200"
            >
              {copied ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Link2 size={13} />}
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>

        {/* ── Article ──────────────────────────────── */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-14">

          {/* Header */}
          <m.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10"
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full tracking-widest ${catStyle.bg} ${catStyle.text}`}>
                {news.category}
              </span>
              <time className="text-[11px] font-mono text-gray-400">{news.date.replace(/-/g, '.')}</time>
              {news.is_pinned && (
                <span className="text-[10px] font-bold text-rose-500 tracking-widest">📌 PINNED</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-6">
              {news.title}
            </h1>

            {/* TOURING meta */}
            {news.category === 'TOURING' && (news.event_date || news.location) && (
              <div className="flex flex-wrap gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl mb-6">
                {news.event_date && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                    <Calendar size={13} /> {news.event_date.replace(/-/g, '.')}
                  </span>
                )}
                {news.location && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                    <MapPin size={13} /> {news.location}
                  </span>
                )}
                {news.event_date && (
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(news.title)}&dates=${news.event_date.replace(/-/g, '')}T000000Z/${news.event_date.replace(/-/g, '')}T235959Z&details=${encodeURIComponent(news.content)}&location=${encodeURIComponent(news.location || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-[10px] font-bold text-blue-600 hover:underline tracking-widest uppercase"
                  >
                    📅 Add to Calendar
                  </a>
                )}
              </div>
            )}

            {/* Hero image */}
            {news.image_url && (
              <m.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-gray-50"
              >
                <Image
                  src={news.image_url}
                  alt={news.title}
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
              </m.div>
            )}
          </m.header>

          {/* Body */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 shadow-sm mb-8"
          >
            <div className="prose prose-gray prose-base max-w-none
              prose-headings:font-black prose-headings:tracking-tight
              prose-p:leading-relaxed prose-p:text-gray-700
              prose-a:text-mieno-blue prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-bold
              prose-li:text-gray-700
              prose-hr:border-gray-100"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{news.content}</ReactMarkdown>
            </div>
          </m.div>

          {/* Requirements */}
          {news.requirements && (
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8 flex items-start gap-4"
            >
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 shrink-0">
                <ClipboardCheck size={18} className="text-gray-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">参加条件</p>
                <p className="text-sm text-gray-700 leading-relaxed">{news.requirements}</p>
              </div>
            </m.div>
          )}

          {/* Legacy RSVP (non-logged-in) */}
          {news.category === 'TOURING' && !hideLegacySurvey && (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm"
            >
              <h2 className="text-sm font-black text-gray-900 tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                DEPLOYMENT RSVP
                <span className="text-[10px] text-gray-400 font-mono ml-1">参加ステータス入力</span>
              </h2>

              {hasSentPreviously || isSubmitted ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">ステータス送信完了</h3>
                  <p className="text-xs font-mono text-gray-400 tracking-widest uppercase">Transmitted to MIENO HQ</p>
                </div>
              ) : (
                <form onSubmit={handleSurveySubmit} className="space-y-6">
                  {/* Status selector */}
                  <div className="flex p-1 bg-[#F5F5F7] rounded-2xl gap-1">
                    {[
                      { value: 'JOIN',    label: 'JOIN',    sub: '参加',  color: 'text-emerald-600' },
                      { value: 'PENDING', label: 'PENDING', sub: '未定',  color: 'text-amber-600'   },
                      { value: 'DECLINE', label: 'DECLINE', sub: '不参加', color: 'text-rose-600'    },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRsvpStatus(opt.value as 'JOIN' | 'PENDING' | 'DECLINE')}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold tracking-widest transition-all ${
                          rsvpStatus === opt.value
                            ? 'bg-white shadow-sm text-gray-900'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span className={rsvpStatus === opt.value ? opt.color : ''}>{opt.label}</span>
                          <span className="text-[9px] font-medium">{opt.sub}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {rsvpStatus && (
                      <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">名前 *</label>
                          <input
                            type="text"
                            required
                            value={agentName}
                            onChange={e => setAgentName(e.target.value)}
                            className="w-full bg-[#F5F5F7] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mieno-blue/30 transition-all"
                            placeholder="例: 三重野太郎"
                          />
                        </div>

                        {(rsvpStatus === 'JOIN' || rsvpStatus === 'PENDING') && (
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">搭乗機体</label>
                            <input
                              type="text"
                              value={vehicleInfo}
                              onChange={e => setVehicleInfo(e.target.value)}
                              className="w-full bg-[#F5F5F7] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mieno-blue/30 transition-all"
                              placeholder="例: CBR600RR"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">特記事項</label>
                          <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={3}
                            className="w-full bg-[#F5F5F7] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mieno-blue/30 transition-all resize-y"
                            placeholder="合流場所の希望や遅刻・早退の予定など"
                          />
                        </div>

                        {submitError && (
                          <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                            {submitError}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting || !agentName.trim()}
                          className="w-full py-3.5 bg-mieno-navy text-white rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-mieno-blue transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSubmitting
                            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            : <><Send size={14} /> TRANSMIT STATUS</>
                          }
                        </button>
                      </m.div>
                    )}
                  </AnimatePresence>
                </form>
              )}
            </m.div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between">
            <Link
              href="/news"
              className="text-xs font-bold text-gray-400 hover:text-mieno-navy transition-colors tracking-widest uppercase flex items-center gap-1.5"
            >
              <ArrowLeft size={12} /> 通達一覧へ戻る
            </Link>
            <p className="text-[10px] font-mono text-gray-300 tracking-widest uppercase">MIENO CORP.</p>
          </div>
        </article>
      </div>
    </ClientMotionWrapper>
  );
}
