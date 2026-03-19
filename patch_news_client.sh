#!/bin/bash
cat << 'INNER_EOF' > components/NewsDetailClient.tsx.patch
--- components/NewsDetailClient.tsx	2023-10-27 10:00:00.000000000 +0000
+++ components/NewsDetailClient.tsx	2023-10-27 10:00:00.000000000 +0000
@@ -1,13 +1,16 @@
 'use client';

-import { motion } from 'framer-motion';
-import { ArrowLeft, Share2, Printer, MapPin, Calendar, ClipboardCheck } from 'lucide-react';
+import { motion, AnimatePresence } from 'framer-motion';
+import { ArrowLeft, Share2, Printer, MapPin, Calendar, ClipboardCheck, Send, CheckCircle2 } from 'lucide-react';
 import Link from 'next/link';
 import Image from 'next/image';
 import { News as NewsType } from '@/types/database';
 import ReactMarkdown from 'react-markdown';
+import { useState } from 'react';
+import { submitSurvey } from '@/app/actions/survey';

 interface NewsDetailClientProps {
     news: NewsType;
 }

 export default function NewsDetailClient({ news }: NewsDetailClientProps) {
+    const [rsvpStatus, setRsvpStatus] = useState<'JOIN' | 'PENDING' | 'DECLINE' | null>(null);
+    const [agentName, setAgentName] = useState('');
+    const [vehicleInfo, setVehicleInfo] = useState('');
+    const [notes, setNotes] = useState('');
+    const [isSubmitting, setIsSubmitting] = useState(false);
+    const [isSubmitted, setIsSubmitted] = useState(false);
+
     const handlePrint = () => {
         window.print();
     };
@@ -34,6 +44,27 @@
         }
     };

+    const handleSurveySubmit = async (e: React.FormEvent) => {
+        e.preventDefault();
+        if (!rsvpStatus || !agentName.trim()) return;
+
+        setIsSubmitting(true);
+        try {
+            await submitSurvey({
+                news_id: news.id,
+                agent_name: agentName,
+                attendance_status: rsvpStatus,
+                vehicle_info: vehicleInfo,
+                message: notes,
+            });
+            setIsSubmitted(true);
+        } catch (error) {
+            console.error('Failed to submit RSVP:', error);
+            alert('通信エラーが発生しました。再度お試しください。');
+        } finally {
+            setIsSubmitting(false);
+        }
+    };
+
     return (
         <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
             <motion.div
@@ -176,6 +207,118 @@
                     </motion.div>
                 )}

+                {news.category === 'TOURING' && (
+                    <motion.div
+                        initial={{ opacity: 0, y: 30 }}
+                        whileInView={{ opacity: 1, y: 0 }}
+                        viewport={{ once: true, margin: "-100px" }}
+                        transition={{ duration: 0.8, ease: "easeOut" }}
+                        className="mt-16 bg-[#111] border border-white/10 rounded-3xl p-8 relative overflow-hidden"
+                    >
+                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
+
+                        <h2 className="text-xl font-bold tracking-widest text-white mb-8 flex items-center gap-3 uppercase relative z-10">
+                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
+                            DEPLOYMENT RSVP
+                            <span className="text-xs text-gray-500 font-mono tracking-widest ml-2 hidden sm:inline">参加ステータス入力</span>
+                        </h2>
+
+                        {isSubmitted ? (
+                            <motion.div
+                                initial={{ opacity: 0, scale: 0.95 }}
+                                animate={{ opacity: 1, scale: 1 }}
+                                className="flex flex-col items-center justify-center py-12 text-center relative z-10"
+                            >
+                                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
+                                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
+                                </div>
+                                <h3 className="text-2xl font-bold text-white tracking-widest mb-2">STATUS TRANSMITTED</h3>
+                                <p className="text-gray-400 font-mono text-sm uppercase">通信完了：ご協力感謝します</p>
+                            </motion.div>
+                        ) : (
+                            <form onSubmit={handleSurveySubmit} className="relative z-10 space-y-8">
+                                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
+                                    {[
+                                        { value: 'JOIN', label: '🟢 JOIN', sub: '参加' },
+                                        { value: 'PENDING', label: '🟡 PENDING', sub: '未定' },
+                                        { value: 'DECLINE', label: '🔴 DECLINE', sub: '不参加' }
+                                    ].map((opt) => (
+                                        <button
+                                            key={opt.value}
+                                            type="button"
+                                            onClick={() => setRsvpStatus(opt.value as any)}
+                                            className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold tracking-widest transition-all ${rsvpStatus === opt.value ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
+                                        >
+                                            <div className="flex flex-col items-center gap-1">
+                                                <span>{opt.label}</span>
+                                                <span className={`text-[10px] ${rsvpStatus === opt.value ? 'text-gray-600' : 'text-gray-500'}`}>{opt.sub}</span>
+                                            </div>
+                                        </button>
+                                    ))}
+                                </div>
+
+                                <AnimatePresence>
+                                    {rsvpStatus && (
+                                        <motion.div
+                                            initial={{ opacity: 0, height: 0 }}
+                                            animate={{ opacity: 1, height: 'auto' }}
+                                            exit={{ opacity: 0, height: 0 }}
+                                            transition={{ duration: 0.4, ease: "easeOut" }}
+                                            className="space-y-6 overflow-hidden"
+                                        >
+                                            <div>
+                                                <label className="block text-xs font-bold text-gray-500 tracking-widest uppercase mb-2">Agent Name (名前) *</label>
+                                                <input
+                                                    type="text"
+                                                    required
+                                                    value={agentName}
+                                                    onChange={(e) => setAgentName(e.target.value)}
+                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
+                                                    placeholder="e.g. Maverick"
+                                                />
+                                            </div>
+
+                                            <AnimatePresence>
+                                                {(rsvpStatus === 'JOIN' || rsvpStatus === 'PENDING') && (
+                                                    <motion.div
+                                                        initial={{ opacity: 0, height: 0 }}
+                                                        animate={{ opacity: 1, height: 'auto' }}
+                                                        exit={{ opacity: 0, height: 0 }}
+                                                        transition={{ duration: 0.4, ease: "easeOut" }}
+                                                        className="space-y-6 overflow-hidden"
+                                                    >
+                                                        <div>
+                                                            <label className="block text-xs font-bold text-gray-500 tracking-widest uppercase mb-2">Vehicle (搭乗機体)</label>
+                                                            <input
+                                                                type="text"
+                                                                value={vehicleInfo}
+                                                                onChange={(e) => setVehicleInfo(e.target.value)}
+                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
+                                                                placeholder="e.g. CBR600RR"
+                                                            />
+                                                        </div>
+                                                    </motion.div>
+                                                )}
+                                            </AnimatePresence>
+
+                                            <div>
+                                                <label className="block text-xs font-bold text-gray-500 tracking-widest uppercase mb-2">Notes (特記事項)</label>
+                                                <textarea
+                                                    value={notes}
+                                                    onChange={(e) => setNotes(e.target.value)}
+                                                    rows={3}
+                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-y font-mono"
+                                                    placeholder="合流場所の希望や遅刻・早退の予定など..."
+                                                />
+                                            </div>
+
+                                            <button
+                                                type="submit"
+                                                disabled={isSubmitting || !agentName.trim()}
+                                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
+                                            >
+                                                {isSubmitting ? (
+                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
+                                                ) : (
+                                                    <>
+                                                        <Send className="w-5 h-5" />
+                                                        TRANSMIT STATUS
+                                                    </>
+                                                )}
+                                            </button>
+                                        </motion.div>
+                                    )}
+                                </AnimatePresence>
+                            </form>
+                        )}
+                    </motion.div>
+                )}
+
                 <div className="mt-24 pt-8 border-t border-white/10 text-center flex flex-col items-center">
                     <div className="w-12 h-1 bg-blue-600 rounded-full mb-8 opacity-50"></div>
INNER_EOF
patch -p0 < components/NewsDetailClient.tsx.patch
