'use client';

import { useState, useTransition } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Save, Pin, FileText, CheckCircle2, Loader2, AlertTriangle, Calendar, MapPin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ClientMotionWrapper from '@/components/ClientMotionWrapper';
import { addNews } from '@/app/actions/news';

type Category = 'UPDATE' | 'PRESS' | 'REPORT' | 'TOURING';

interface LiveEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveEditor({ isOpen, onClose }: LiveEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [content, setContent]   = useState('# 新規通達\n\nここにマークダウンで内容を入力します。\n\n- リスト1\n- リスト2');
  const [title, setTitle]       = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [category, setCategory] = useState<Category>('UPDATE');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation]   = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDeploy = () => {
    if (!title.trim()) {
      showToast('error', 'タイトルを入力してください');
      return;
    }
    if (!content.trim()) {
      showToast('error', '本文を入力してください');
      return;
    }

    startTransition(async () => {
      try {
        await addNews({
          title:      title.trim(),
          content:    content.trim(),
          category,
          date:       new Date().toISOString().split('T')[0],
          is_pinned:  isPinned,
          event_date: eventDate || undefined,
          location:   location  || undefined,
        });

        showToast('success', '通達を発令しました');
        // Reset form
        setTimeout(() => {
          setTitle('');
          setContent('# 新規通達\n\nここにマークダウンで内容を入力します。');
          setIsPinned(false);
          setCategory('UPDATE');
          setEventDate('');
          setLocation('');
          onClose();
        }, 1200);
      } catch (err) {
        console.error(err);
        showToast('error', '保存に失敗しました。再度お試しください。');
      }
    });
  };

  return (
    <ClientMotionWrapper>
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-[#F5F5F7] z-50 flex flex-col overflow-hidden"
        >
          {/* ── Header ─────────────────────────────── */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-400" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Strategic Live Editor</h2>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Category Toggles */}
              <div className="hidden sm:flex bg-gray-100 p-1 rounded-xl">
                {(['UPDATE', 'PRESS', 'REPORT', 'TOURING'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1 text-[10px] font-bold tracking-wider rounded-lg transition-all ${
                      category === cat ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Pin Toggle */}
              <button
                onClick={() => setIsPinned(!isPinned)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isPinned ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <Pin size={14} className={isPinned ? 'fill-current' : ''} />
                <span className="hidden sm:inline">PIN</span>
              </button>

              {/* Deploy Button */}
              <button
                onClick={handleDeploy}
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-2 bg-mieno-navy text-white rounded-xl text-xs font-bold hover:bg-mieno-blue disabled:opacity-50 transition-all shadow-sm active:scale-95"
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {isPending ? 'DEPLOYING...' : 'DEPLOY'}
              </button>
            </div>
          </header>

          {/* ── TOURING extra fields ─────────────────── */}
          <AnimatePresence>
            {category === 'TOURING' && (
              <m.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-blue-50 border-b border-blue-100"
              >
                <div className="flex flex-wrap items-center gap-4 px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" />
                    <label className="text-[11px] font-bold text-blue-600 tracking-widest uppercase">開催日</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={e => setEventDate(e.target.value)}
                      className="bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-blue-500" />
                    <label className="text-[11px] font-bold text-blue-600 tracking-widest uppercase">集合場所</label>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="例: 道の駅○○"
                      className="bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <span className="text-[10px] text-blue-400 font-mono">※ TOURING発令時はLINE通知が自動送信されます</span>
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {/* Mobile category selector */}
          <div className="sm:hidden flex bg-white border-b border-gray-100 px-4 py-2 gap-1 overflow-x-auto">
            {(['UPDATE', 'PRESS', 'REPORT', 'TOURING'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-[10px] font-bold tracking-wider rounded-lg transition-all whitespace-nowrap ${
                  category === cat ? 'bg-mieno-navy text-white' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── Split View ──────────────────────────── */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Editor */}
            <div className="w-full md:w-1/2 border-r border-gray-200 flex flex-col bg-white">
              <input
                type="text"
                placeholder="タイトルを入力..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-8 pt-8 pb-4 text-2xl font-bold text-gray-900 placeholder:text-gray-300 border-none focus:outline-none focus:ring-0"
              />
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Markdownで内容を入力..."
                className="flex-1 w-full px-8 py-4 text-sm text-gray-700 font-mono placeholder:text-gray-300 border-none focus:outline-none focus:ring-0 resize-none bg-transparent leading-relaxed"
              />
            </div>

            {/* Right: Preview (hidden on mobile) */}
            <div className="hidden md:block w-1/2 bg-[#F5F5F7] overflow-y-auto p-10 flex justify-center">
              <div className="w-full max-w-[600px] bg-white rounded-3xl p-10 shadow-sm border border-gray-100 mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold tracking-widest uppercase">
                    {category}
                  </span>
                  {isPinned && <Pin size={14} className="text-amber-500 fill-current" />}
                  <span className="text-[11px] text-gray-400 font-mono ml-auto">
                    {new Date().toLocaleDateString('ja-JP')}
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
                  {title || 'Untitled'}
                </h1>

                {eventDate && (
                  <div className="flex items-center gap-2 mb-2 text-xs text-blue-600 font-mono">
                    <Calendar size={12} /> {eventDate}
                    {location && <><MapPin size={12} className="ml-2" /> {location}</>}
                  </div>
                )}

                <div className="prose prose-gray prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* ── Toast ───────────────────────────────── */}
          <AnimatePresence>
            {toast && (
              <m.div
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0,  scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3.5 rounded-2xl shadow-lg text-sm font-bold z-[60] ${
                  toast.type === 'success'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {toast.type === 'success'
                  ? <CheckCircle2 size={16} />
                  : <AlertTriangle size={16} />
                }
                {toast.msg}
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      )}
    </AnimatePresence>
  </ClientMotionWrapper>
  );
}
