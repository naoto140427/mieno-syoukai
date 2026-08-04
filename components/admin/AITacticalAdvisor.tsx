'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat, Message } from 'ai/react';
import { m, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, AlertCircle, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AITacticalAdvisor({ unitId, unitName }: { unitId: string | number; unitName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/admin/chat',
    body: { unitId },
    onError: (e: Error) => console.error(e),
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <m.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center text-white hover:bg-black transition-all hover:scale-105 active:scale-95 group"
          >
            <Sparkles size={24} className="group-hover:text-cyan-400 transition-colors" />
          </m.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[100] w-[380px] h-[600px] max-h-[85vh] bg-[#1a1a1e]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Bot size={18} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">AI Tactical Advisor</h3>
                  <p className="text-[10px] text-gray-400 font-mono uppercase truncate max-w-[200px]">
                    {unitName} - SYS.ONLINE
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <Bot size={40} className="text-gray-600 mb-4" />
                  <p className="text-sm text-gray-400 font-mono leading-relaxed">
                    Tactical Advisor for {unitName} is ready.<br />
                    マニュアルやパーツリストの解析が可能です。
                  </p>
                </div>
              )}

              {messages.map((m: Message) => (
                <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-3 ${
                      m.role === 'user'
                        ? 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white rounded-2xl rounded-tr-sm shadow-md'
                        : 'bg-white/10 backdrop-blur-md text-gray-100 rounded-2xl rounded-tl-sm border border-white/5'
                    }`}
                  >
                    {m.role === 'user' ? (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-a:text-cyan-400">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl rounded-tl-sm border border-white/5 flex items-center gap-1.5 h-11">
                    <m.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <m.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <m.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  </div>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs mt-2 justify-center bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                  <AlertCircle size={14} />
                  <span>通信エラーが発生しました。</span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/60 border-t border-white/10">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="質問を入力..."
                  className="w-full bg-white/5 border border-white/10 text-white rounded-full pl-5 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-gray-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 w-9 h-9 rounded-full bg-cyan-500 text-white flex items-center justify-center hover:bg-cyan-400 disabled:opacity-50 disabled:bg-gray-700 transition-colors"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </form>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
