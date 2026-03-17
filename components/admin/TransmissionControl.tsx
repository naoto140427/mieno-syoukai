'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Send, Mail, User, Clock, ShieldAlert } from 'lucide-react';
import { generateAiReplyDraft, sendReplyAndUpdateInquiry } from '@/app/actions/admin';
import type { Inquiry } from '@/types/database';

interface TransmissionControlProps {
  isOpen: boolean;
  onClose: () => void;
  inquiries: Inquiry[];
  aiStrictness?: number;
}

export default function TransmissionControl({ isOpen, onClose, inquiries, aiStrictness = 50 }: TransmissionControlProps) {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [draftHtml, setDraftHtml] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const unreadInquiries = inquiries.filter(i => i.status === 'unread');

  const handleSelect = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setDraftHtml('');
  };

  const handleGenerateAI = async () => {
    if (!selectedInquiry) return;
    setIsGenerating(true);
    const result = await generateAiReplyDraft(selectedInquiry.name, selectedInquiry.message, aiStrictness);
    if (result.success && result.html) {
      setDraftHtml(result.html);
    } else {
      alert('AI Draft generation failed.');
    }
    setIsGenerating(false);
  };

  const handleSend = async () => {
    if (!selectedInquiry || !draftHtml) return;
    setIsSending(true);
    const result = await sendReplyAndUpdateInquiry(selectedInquiry.id, selectedInquiry.email, draftHtml);
    if (result.success) {
      setSelectedInquiry(null);
      setDraftHtml('');
    } else {
      alert('Failed to send reply.');
    }
    setIsSending(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-[#F5F5F7] shadow-2xl z-50 overflow-hidden flex flex-col border-l border-white/50"
          >
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Mail size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Transmission Control</h2>
                  <p className="text-[10px] text-gray-500 font-mono">Unread Intercepts: {unreadInquiries.length}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {!selectedInquiry ? (
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Pending Comms</h3>
                  {unreadInquiries.length === 0 ? (
                    <div className="text-center py-12">
                      <ShieldAlert size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 text-sm">No unread transmissions.</p>
                    </div>
                  ) : (
                    unreadInquiries.map((inq) => (
                      <motion.div
                        key={inq.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => handleSelect(inq)}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-transparent hover:border-blue-200 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          <span className="text-xs font-bold text-gray-900 truncate">{inq.subject}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><User size={12} /> {inq.name}</span>
                          <span className="flex items-center gap-1 font-mono"><Clock size={12} /> {new Date(inq.created_at).toLocaleDateString()}</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    ← Back to List
                  </button>

                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">
                      Subject: {selectedInquiry.subject}
                    </h3>
                    <div className="space-y-2 mb-6 text-sm">
                      <p className="text-gray-500 flex justify-between">
                        <span>From:</span> <span className="text-gray-900 font-medium">{selectedInquiry.name} ({selectedInquiry.email})</span>
                      </p>
                      <p className="text-gray-500 flex justify-between">
                        <span>Received:</span> <span className="text-gray-900 font-mono">{new Date(selectedInquiry.created_at).toLocaleString()}</span>
                      </p>
                    </div>
                    <div className="bg-[#F5F5F7] p-4 rounded-2xl text-sm text-gray-700 whitespace-pre-wrap font-sans">
                      {selectedInquiry.message}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleGenerateAI}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl font-bold text-sm hover:from-gray-800 hover:to-gray-700 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
                    >
                      {isGenerating ? (
                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                           <Bot size={18} />
                           🤖 AIで返信案を作成
                        </>
                      )}
                    </button>

                    {draftHtml && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                           <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Draft HTML (Editable)</label>
                           <textarea
                             value={draftHtml}
                             onChange={(e) => setDraftHtml(e.target.value)}
                             rows={8}
                             className="w-full p-4 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
                           />
                        </div>

                        {/* Preview */}
                        <div className="space-y-2">
                           <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Preview</label>
                           <div className="bg-white p-6 rounded-2xl border border-gray-200 overflow-hidden shadow-inner">
                             <div dangerouslySetInnerHTML={{ __html: draftHtml }} />
                           </div>
                        </div>

                        <button
                          onClick={handleSend}
                          disabled={isSending}
                          className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md active:scale-[0.98]"
                        >
                          {isSending ? (
                             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <>
                               <Send size={18} />
                               送信して完了
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
