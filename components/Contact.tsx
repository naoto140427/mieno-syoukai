'use client';

import { useState, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
  Send, User, Mail, MessageSquare, List,
  CheckCircle2, Loader2, AlertCircle, ArrowRight,
  Shield, Clock, Zap
} from 'lucide-react';
import { submitInquiry } from '@/app/actions/contact';
import { processAndReplyContact } from '@/app/actions/contact-ai';
import ClientMotionWrapper from '@/components/ClientMotionWrapper';

const SUBJECTS = [
  { value: 'business',  label: '業務提携・ご依頼' },
  { value: 'units',     label: '機動戦力に関するお問い合わせ' },
  { value: 'logistics', label: 'ロジスティクス・兵站支援' },
  { value: 'other',     label: 'その他' },
];

const INFO_ITEMS = [
  { icon: <Zap size={16} />,    title: '即時自動返信',   desc: 'AIエージェントが24時間以内に自動返信します' },
  { icon: <Shield size={16} />, title: 'SSL暗号化通信', desc: '入力情報は安全に保護されます' },
  { icon: <Clock size={16} />,  title: '担当者対応',     desc: '業務時間内に担当役員が確認します' },
];

export default function Contact() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });

  const isValid = useMemo(() =>
    formData.name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.subject !== '' &&
    formData.message.trim().length > 0,
  [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setFormState('submitting');
    setErrorMessage(null);
    try {
      const result = await submitInquiry(formData);
      if (result.success) {
        setFormState('success');
        processAndReplyContact(formData.name, formData.email, formData.message).catch(console.error);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormState('idle');
        setErrorMessage(result.error || '送信に失敗しました。時間をおいて再度お試しください。');
      }
    } catch {
      setFormState('idle');
      setErrorMessage('予期せぬエラーが発生しました。');
    }
  };

  // フィールド共通スタイル
  const fieldClass = (name: string) =>
    `w-full bg-[#F5F5F7] border rounded-2xl py-3.5 pl-11 pr-4 text-gray-900 text-sm placeholder:text-gray-400 outline-none transition-all duration-200 ${
      focused === name
        ? 'border-gray-400 ring-4 ring-gray-900/5 bg-white'
        : 'border-transparent hover:border-gray-200'
    }`;

  return (
    <ClientMotionWrapper>
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-5xl">

          {/* ── ページヘッダー ── */}
          <m.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase bg-white border border-gray-200 px-4 py-1.5 rounded-full mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              SECURE CHANNEL OPEN
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-3">
              通信回線
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              株式会社三重野商会への各種お問い合わせはこちらから
            </p>
          </m.div>

          {/* ── メインカード（2カラム） ── */}
          <m.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">

              {/* ── 左パネル ── */}
              <div className="bg-gray-900 p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase mb-8">MIENO CORP.</p>
                  <h2 className="text-2xl font-black text-white leading-tight mb-4">
                    お問い合わせ・<br />作戦支援要請
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed mb-10">
                    ご質問、業務依頼、ロジスティクス支援など、お気軽にご連絡ください。担当役員が確認の上、速やかに対応いたします。
                  </p>

                  <div className="space-y-5">
                    {INFO_ITEMS.map((item, i) => (
                      <m.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white/70 shrink-0 mt-0.5">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white/90">{item.title}</p>
                          <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                        </div>
                      </m.div>
                    ))}
                  </div>
                </div>

                {/* 装飾 */}
                <div className="mt-10 pt-8 border-t border-white/10">
                  <p className="text-[10px] font-mono text-white/20 tracking-widest">
                    © MIENO CORP. ALL RIGHTS RESERVED.
                  </p>
                </div>
              </div>

              {/* ── 右パネル（フォーム） ── */}
              <div className="p-8 md:p-10">
                <AnimatePresence mode="wait">

                  {/* 送信完了 */}
                  {formState === 'success' ? (
                    <m.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16 text-center h-full"
                    >
                      <m.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 250, damping: 20, delay: 0.1 }}
                        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/20"
                      >
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      </m.div>
                      <m.h3
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-black text-gray-900 mb-2"
                      >
                        送信完了
                      </m.h3>
                      <m.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-400 text-xs font-mono tracking-widest uppercase mb-6"
                      >
                        TRANSMISSION COMPLETE
                      </m.p>
                      <m.p
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-500 text-sm leading-relaxed max-w-xs mb-8"
                      >
                        お問い合わせを受け付けました。<br />
                        AIエージェント、または担当役員より返信いたします。
                      </m.p>
                      <m.button
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        onClick={() => setFormState('idle')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-black transition-colors"
                      >
                        新しい通信を開始する <ArrowRight size={14} />
                      </m.button>
                    </m.div>

                  ) : (
                    <m.form
                      key="form"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      {/* Name */}
                      <div>
                        <label className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-gray-700">お名前</span>
                          <span className="text-[10px] font-mono text-gray-400 tracking-wider">NAME</span>
                        </label>
                        <div className="relative">
                          <User size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${focused === 'name' ? 'text-gray-700' : 'text-gray-400'}`} />
                          <input
                            type="text" id="name" name="name" required
                            value={formData.name} onChange={handleChange}
                            onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                            placeholder="例: 渡辺 直人"
                            className={fieldClass('name')}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-gray-700">メールアドレス</span>
                          <span className="text-[10px] font-mono text-gray-400 tracking-wider">EMAIL</span>
                        </label>
                        <div className="relative">
                          <Mail size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${focused === 'email' ? 'text-gray-700' : 'text-gray-400'}`} />
                          <input
                            type="email" id="email" name="email" required
                            value={formData.email} onChange={handleChange}
                            onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                            placeholder="例: info@mieno-corp.com"
                            className={fieldClass('email')}
                          />
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-gray-700">お問い合わせ種別</span>
                          <span className="text-[10px] font-mono text-gray-400 tracking-wider">SUBJECT</span>
                        </label>
                        <div className="relative">
                          <List size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${focused === 'subject' ? 'text-gray-700' : 'text-gray-400'}`} />
                          <select
                            id="subject" name="subject" required
                            value={formData.subject} onChange={handleChange}
                            onFocus={() => setFocused('subject')} onBlur={() => setFocused(null)}
                            className={fieldClass('subject') + ' appearance-none cursor-pointer'}
                          >
                            <option value="" disabled>選択してください</option>
                            {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-gray-700">メッセージ</span>
                          <span className="text-[10px] font-mono text-gray-400 tracking-wider">
                            {formData.message.length > 0 && `${formData.message.length}文字`}
                          </span>
                        </label>
                        <div className="relative">
                          <MessageSquare size={15} className={`absolute left-3.5 top-3.5 transition-colors ${focused === 'message' ? 'text-gray-700' : 'text-gray-400'}`} />
                          <textarea
                            id="message" name="message" required rows={5}
                            value={formData.message} onChange={handleChange}
                            onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                            placeholder="お問い合わせ内容をご記入ください..."
                            className={fieldClass('message') + ' resize-none pt-3.5'}
                          />
                        </div>
                      </div>

                      {/* エラー */}
                      <AnimatePresence>
                        {errorMessage && (
                          <m.div
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm"
                          >
                            <AlertCircle size={15} className="shrink-0" />
                            {errorMessage}
                          </m.div>
                        )}
                      </AnimatePresence>

                      {/* 送信ボタン */}
                      <m.button
                        type="submit"
                        disabled={!isValid || formState === 'submitting'}
                        whileHover={isValid && formState !== 'submitting' ? { scale: 1.01 } : {}}
                        whileTap={isValid && formState !== 'submitting' ? { scale: 0.99 } : {}}
                        className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 ${
                          !isValid || formState === 'submitting'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-900/10'
                        }`}
                      >
                        {formState === 'submitting' ? (
                          <><Loader2 className="animate-spin" size={16} />送信中...</>
                        ) : (
                          <><Send size={16} />送信する<span className="text-[10px] opacity-50 font-mono hidden sm:inline">SEND</span></>
                        )}
                      </m.button>

                      {/* セキュリティ表記 */}
                      <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                        <Shield size={11} />この通信はSSL/TLSにより暗号化されています
                      </p>
                    </m.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </m.div>

        </div>
      </div>
    </ClientMotionWrapper>
  );
}
