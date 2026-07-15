'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
  X, Save, Pin, FileText, CheckCircle2, Loader2, AlertTriangle,
  Calendar, MapPin, ChevronRight, Radio, Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { addNews, updateNews } from '@/app/actions/news';
import { uploadImage } from '@/app/actions/upload';
import type { News } from '@/types/database';

type Category = 'UPDATE' | 'PRESS' | 'REPORT' | 'TOURING';

interface LiveEditorProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: News | null;
}

const CATEGORY_META: Record<Category, { label: string; color: string; bg: string }> = {
  UPDATE:  { label: 'UPDATE',  color: 'text-mieno-navy', bg: 'bg-mieno-navy/8' },
  PRESS:   { label: 'PRESS',   color: 'text-violet-700', bg: 'bg-violet-50' },
  REPORT:  { label: 'REPORT',  color: 'text-amber-700',  bg: 'bg-amber-50'  },
  TOURING: { label: 'TOURING', color: 'text-sky-700',    bg: 'bg-sky-50'    },
};

export default function LiveEditor({ isOpen, onClose, initialData }: LiveEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [title,     setTitle]     = useState(initialData?.title || '');
  const [content,   setContent]   = useState(initialData?.content || '');
  const [isPinned,  setIsPinned]  = useState(initialData?.is_pinned || false);
  const [category,  setCategory]  = useState<Category>((initialData?.category as Category) || 'UPDATE');
  const [eventDate, setEventDate] = useState(initialData?.event_date || '');
  const [location,  setLocation]  = useState(initialData?.location || '');
  const [imageUrl,  setImageUrl]  = useState(initialData?.image_url || '');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg,  setErrorMsg]  = useState<string | null>(null);
  const [deployed,  setDeployed]  = useState<{ title: string; category: Category; date: string; status: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update state when initialData changes
  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setContent(initialData?.content || '');
      setIsPinned(initialData?.is_pinned || false);
      setCategory((initialData?.category as Category) || 'UPDATE');
      setEventDate(initialData?.event_date || '');
      setLocation(initialData?.location || '');
      setImageUrl(initialData?.image_url || '');
      setErrorMsg(null);
      setDeployed(null);
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setTitle(''); setContent(''); setIsPinned(false);
    setCategory('UPDATE'); setEventDate(''); setLocation(''); setImageUrl('');
    setErrorMsg(null); setDeployed(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const url = await uploadImage(formData);
      setImageUrl(url);
    } catch (err) {
      console.error(err);
      setErrorMsg('画像のアップロードに失敗しました');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeploy = (targetStatus: 'PUBLISHED' | 'DRAFT') => {
    if (!title.trim())   { setErrorMsg('タイトルを入力してください'); return; }
    if (!content.trim()) { setErrorMsg('本文を入力してください');     return; }
    setErrorMsg(null);

    startTransition(async () => {
      try {
        const payload = {
          title:      title.trim(),
          content:    content.trim(),
          category,
          status:     targetStatus,
          date:       initialData?.date || new Date().toISOString().split('T')[0],
          is_pinned:  isPinned,
          event_date: eventDate  || undefined,
          location:   location   || undefined,
          image_url:  imageUrl   || undefined,
          requirements: initialData?.requirements || undefined,
        };

        if (initialData?.id) {
          await updateNews(initialData.id, payload);
        } else {
          await addNews(payload);
        }
        
        setDeployed({ title: title.trim(), category, date: new Date().toLocaleDateString('ja-JP'), status: targetStatus });
      } catch {
        setErrorMsg('保存に失敗しました。再度お試しください。');
      }
    });
  };

  const handleClose = () => { resetForm(); onClose(); };

  const meta = CATEGORY_META[category];

  return (
    <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <m.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Editor Shell — full-screen sheet */}
            <m.div
              key="editor"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 32, stiffness: 280 }}
              className="fixed inset-0 md:inset-4 md:rounded-3xl bg-mieno-gray z-50 flex flex-col overflow-hidden shadow-2xl border border-white/60"
            >
              {/* ── Header ─────────────────────────────────────── */}
              <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClose}
                    className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="閉じる"
                  >
                    <X size={18} />
                  </button>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Strategic Live Editor</p>
                    <h2 className="text-sm font-bold text-mieno-navy leading-none mt-0.5">{initialData ? '通達の編集' : '新規通達'}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Category pills */}
                  <div className="hidden sm:flex bg-gray-100 p-1 rounded-2xl gap-0.5">
                    {(Object.keys(CATEGORY_META) as Category[]).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`relative px-3 py-1.5 text-[10px] font-bold tracking-wider rounded-xl transition-all ${
                          category === cat
                            ? 'text-mieno-navy'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {category === cat && (
                          <m.span
                            layoutId="cat-pill"
                            className="absolute inset-0 bg-white rounded-xl shadow-sm"
                            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                          />
                        )}
                        <span className="relative">{cat}</span>
                      </button>
                    ))}
                  </div>

                  {/* Pin */}
                  <button
                    onClick={() => setIsPinned(!isPinned)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isPinned ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                    aria-pressed={isPinned}
                    aria-label={isPinned ? 'ピン留め解除' : 'ピン留め'}
                  >
                    <Pin size={13} className={isPinned ? 'fill-current' : ''} />
                    <span className="hidden sm:inline">PIN</span>
                  </button>

                  {/* Save Draft */}
                  <button
                    onClick={() => handleDeploy('DRAFT')}
                    disabled={isPending}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                  >
                    <FileText size={13} />
                    <span className="hidden sm:inline">DRAFT</span>
                  </button>

                  {/* Deploy */}
                  <button
                    onClick={() => handleDeploy('PUBLISHED')}
                    disabled={isPending}
                    className="flex items-center gap-2 px-5 py-2.5 bg-mieno-navy text-white rounded-xl text-xs font-bold hover:bg-mieno-navy/90 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                  >
                    {isPending
                      ? <Loader2 size={13} className="animate-spin" />
                      : <Save size={13} />
                    }
                    {isPending ? 'DEPLOYING...' : 'DEPLOY'}
                  </button>
                </div>
              </header>

              {/* ── TOURING extra fields ──────────────────────── */}
              <AnimatePresence>
                {category === 'TOURING' && (
                  <m.div
                    key="touring-bar"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-sky-50 border-b border-sky-100 shrink-0"
                  >
                    <div className="flex flex-wrap items-center gap-4 px-6 py-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-sky-500" />
                        <label className="text-[10px] font-bold text-sky-600 tracking-widest uppercase">開催日</label>
                        <input
                          type="date"
                          id="live-editor-event-date"
                          value={eventDate}
                          onChange={e => setEventDate(e.target.value)}
                          className="bg-white border border-sky-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-300"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-sky-500" />
                        <label className="text-[10px] font-bold text-sky-600 tracking-widest uppercase">集合場所</label>
                        <input
                          type="text"
                          id="live-editor-location"
                          value={location}
                          onChange={e => setLocation(e.target.value)}
                          placeholder="例: 道の駅○○"
                          className="bg-white border border-sky-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <Radio size={11} className="text-sky-400 animate-pulse" />
                        <span className="text-[10px] text-sky-500 font-mono">TOURING発令時 → LINE自動配信</span>
                      </div>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>

              {/* Mobile category bar */}
              <div className="sm:hidden flex bg-white border-b border-gray-100 px-4 py-2 gap-1 overflow-x-auto no-scrollbar shrink-0">
                {(Object.keys(CATEGORY_META) as Category[]).map((cat) => (
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

              {/* ── Error Banner ───────────────────────────────── */}
              <AnimatePresence>
                {errorMsg && (
                  <m.div
                    key="error"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden shrink-0"
                  >
                    <div className="flex items-center gap-2 px-6 py-3 bg-rose-50 border-b border-rose-100 text-xs font-bold text-rose-600">
                      <AlertTriangle size={13} /> {errorMsg}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>

              {/* ── Split View ─────────────────────────────────── */}
              <div className="flex-1 flex overflow-hidden">

                {/* Left: Editor Panel */}
                <div className="w-full md:w-1/2 flex flex-col bg-white border-r border-gray-100">
                  {/* Image Upload */}
                  <div className="px-6 md:px-8 pt-5 pb-2">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">Cover Image</p>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading || isPending}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
                      >
                        {isUploading ? 'UPLOADING...' : 'UPLOAD IMAGE'}
                      </button>
                      {imageUrl && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 group">
                          <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => setImageUrl('')}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <X size={14} className="text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title input */}
                  <div className="px-6 md:px-8 pt-3 pb-3 border-b border-gray-50">
                    <input
                      id="live-editor-title"
                      type="text"
                      placeholder="タイトルを入力..."
                      value={title}
                      onChange={e => { setTitle(e.target.value); setErrorMsg(null); }}
                      className="w-full text-2xl font-bold text-mieno-navy placeholder:text-gray-200 border-none focus:outline-none focus:ring-0 bg-transparent"
                    />
                  </div>

                  {/* Markdown editor */}
                  <div className="relative flex-1 overflow-hidden">
                    <textarea
                      id="live-editor-content"
                      value={content}
                      onChange={e => { setContent(e.target.value); setErrorMsg(null); }}
                      placeholder={'Markdownで内容を入力...\n\n## 見出し\n\n本文テキスト\n\n- リスト 1\n- リスト 2'}
                      className="absolute inset-0 w-full h-full px-6 md:px-8 py-4 text-sm text-gray-700 font-mono placeholder:text-gray-200 border-none focus:outline-none focus:ring-0 resize-none bg-transparent leading-relaxed"
                    />
                  </div>

                  {/* Footer hint */}
                  <div className="flex items-center gap-2 px-6 md:px-8 py-3 border-t border-gray-50">
                    <Sparkles size={11} className="text-gray-300" />
                    <span className="text-[10px] text-gray-300 font-mono tracking-wide">Markdown supported · GFM</span>
                    <span className="ml-auto text-[10px] text-gray-300 font-mono">{content.length} chars</span>
                  </div>
                </div>

                {/* Right: Live Preview Panel (desktop only) */}
                <div className="hidden md:flex w-1/2 overflow-y-auto bg-mieno-gray p-8 items-start justify-center">
                  <div className="w-full max-w-[560px]">
                    {/* Preview card */}
                    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/80">
                      {/* Meta row */}
                      <div className="flex items-center gap-2 mb-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase ${meta.bg} ${meta.color}`}>
                          {meta.label}
                        </span>
                        {isPinned && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase bg-amber-50 text-amber-600">
                            <Pin size={9} className="mr-1 fill-current" /> PINNED
                          </span>
                        )}
                        <span className="ml-auto text-[10px] text-gray-400 font-mono">
                          {new Date().toLocaleDateString('ja-JP')}
                        </span>
                      </div>

                      {/* Image Preview */}
                      {imageUrl && (
                        <div className="mb-4 rounded-xl overflow-hidden shadow-sm">
                          <img src={imageUrl} alt="Cover Preview" className="w-full h-auto object-cover aspect-video" />
                        </div>
                      )}

                      {/* Title */}
                      <h1 className="text-xl font-bold text-mieno-navy mb-4 leading-tight min-h-[28px]">
                        {title || <span className="text-gray-200">タイトル未入力</span>}
                      </h1>

                      {/* TOURING details */}
                      {(eventDate || location) && (
                        <div className="flex items-center gap-4 mb-4 text-xs text-sky-600 font-mono bg-sky-50 px-4 py-2.5 rounded-2xl">
                          {eventDate && <span className="flex items-center gap-1.5"><Calendar size={12} />{eventDate}</span>}
                          {location  && <span className="flex items-center gap-1.5"><MapPin size={12} />{location}</span>}
                        </div>
                      )}

                      {/* Content preview */}
                      <div className="prose prose-gray prose-sm max-w-none text-gray-700 min-h-[80px]">
                        {content
                          ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                          : <p className="text-gray-200 text-sm">本文がここに表示されます...</p>
                        }
                      </div>
                    </div>

                    {/* Preview label */}
                    <p className="text-center text-[10px] text-gray-400 font-mono tracking-widest uppercase mt-4">
                      — Live Preview —
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Deployment Receipt Overlay ─────────────────── */}
              <AnimatePresence>
                {deployed && (
                  <m.div
                    key="receipt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10 flex items-center justify-center p-6"
                  >
                    <m.div
                      initial={{ y: 40, opacity: 0, scale: 0.96 }}
                      animate={{ y: 0,  opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', damping: 26, stiffness: 260, delay: 0.08 }}
                      className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-gray-100"
                    >
                      {/* Success icon */}
                      <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center">
                          <CheckCircle2 size={28} className="text-emerald-500" />
                        </div>
                      </div>

                      {/* Receipt lines */}
                      <div className="border-t border-dashed border-gray-200 pt-5 space-y-3">
                        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase text-center mb-4">
                          Transmission Deployed
                        </p>
                        {[
                          { label: 'TITLE',    value: deployed.title },
                          { label: 'CATEGORY', value: deployed.category },
                          { label: 'DATE',     value: deployed.date },
                          { label: 'STATUS',   value: deployed.status === 'PUBLISHED' ? '配信済み' : '下書き保存' },
                        ].map((row) => (
                          <m.div
                            key={row.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                            className="flex items-center justify-between"
                          >
                            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{row.label}</span>
                            <span className="text-xs font-bold text-mieno-navy truncate max-w-[60%] text-right">{row.value}</span>
                          </m.div>
                        ))}
                      </div>

                      <div className="border-t border-dashed border-gray-200 mt-5 pt-5">
                        <button
                          onClick={handleClose}
                          className="w-full flex items-center justify-center gap-2 py-3.5 bg-mieno-navy text-white rounded-2xl text-xs font-bold hover:bg-mieno-navy/90 transition-all active:scale-95"
                        >
                          完了 <ChevronRight size={14} />
                        </button>
                      </div>
                    </m.div>
                  </m.div>
                )}
              </AnimatePresence>

            </m.div>
          </>
        )}
      </AnimatePresence>
  );
}
