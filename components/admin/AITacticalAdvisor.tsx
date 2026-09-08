'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useChat, Message } from 'ai/react';
import { m, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, AlertCircle, Sparkles, Maximize2, Minimize2, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AITacticalAdvisor({ unitId, unitName }: { unitId: string | number; unitName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/admin/chat',
    body: { unitId },
    onError: (e: Error) => console.error(e),
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // スマホでは開いた時にfullscreenにする
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isOpen && isMobile) {
      setIsFullscreen(true);
    } else if (!isOpen) {
      setIsFullscreen(false);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        handleSubmit(e as any);
      }
    }
  }, [handleSubmit, isLoading, input]);

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-[200] flex flex-col'
    : 'fixed bottom-6 right-6 z-[100] w-[390px] h-[620px] max-h-[85vh] flex flex-col rounded-[2rem] overflow-hidden';

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <m.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-[#0a84ff] shadow-[0_4px_24px_rgba(10,132,255,0.5)] flex items-center justify-center text-white hover:bg-[#0070e0] transition-all hover:scale-105 active:scale-95"
            aria-label="AIアドバイザーを開く"
          >
            <Sparkles size={22} />
          </m.button>
        )}
      </AnimatePresence>

      {/* Fullscreen backdrop for non-fullscreen on desktop */}
      <AnimatePresence>
        {isOpen && isFullscreen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[190] bg-black/60 backdrop-blur-sm"
            onClick={() => { setIsOpen(false); setIsFullscreen(false); }}
          />
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            key="chat-window"
            initial={isFullscreen
              ? { opacity: 0, y: '100%' }
              : { opacity: 0, y: 20, scale: 0.97 }
            }
            animate={isFullscreen
              ? { opacity: 1, y: 0 }
              : { opacity: 1, y: 0, scale: 1 }
            }
            exit={isFullscreen
              ? { opacity: 0, y: '100%' }
              : { opacity: 0, y: 20, scale: 0.97 }
            }
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`${containerClass} bg-[#1c1c1e] shadow-2xl`}
          >

            {/* ─── iMessage-style Header ─── */}
            <div className={`relative flex flex-col items-center pt-3 pb-2 border-b border-white/10 bg-[#2c2c2e]/80 backdrop-blur-xl ${isFullscreen ? 'pt-safe-top pt-10' : ''}`}>
              {/* Drag pill (fullscreen) */}
              {isFullscreen && (
                <div className="absolute top-2 w-10 h-1 rounded-full bg-white/20 mx-auto" />
              )}

              {/* Close & Fullscreen controls */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={() => { setIsOpen(false); setIsFullscreen(false); }}
                  className="w-8 h-8 rounded-full bg-[#ff453a]/90 flex items-center justify-center text-white/80 hover:bg-[#ff453a] transition-colors"
                  aria-label="閉じる"
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              </div>

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={() => setIsFullscreen(f => !f)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
                  aria-label={isFullscreen ? '縮小' : '全画面'}
                >
                  {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
              </div>

              {/* Avatar + Name */}
              <div className="w-10 h-10 rounded-full bg-[#0a84ff]/30 border-2 border-[#0a84ff]/60 flex items-center justify-center mb-1">
                <Bot size={18} className="text-[#0a84ff]" />
              </div>
              <p className="text-sm font-semibold text-white tracking-tight">AI Tactical Advisor</p>
              <p className="text-[11px] text-[#8e8e93] mt-0.5">{unitName}</p>
            </div>

            {/* ─── Messages ─── */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto overscroll-y-contain px-4 py-4 space-y-1 bg-[#1c1c1e]"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* Empty state */}
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-6 gap-3">
                  <div className="w-16 h-16 rounded-full bg-[#0a84ff]/10 border border-[#0a84ff]/20 flex items-center justify-center">
                    <Bot size={30} className="text-[#0a84ff]/60" />
                  </div>
                  <p className="text-sm text-[#8e8e93] leading-relaxed">
                    <span className="text-white font-medium">{unitName}</span> のマニュアルやパーツリストを<br />
                    解析できます。気軽に質問してください。
                  </p>
                </div>
              )}

              {/* Date divider - only show at start if messages exist */}
              {messages.length > 0 && (
                <div className="flex justify-center mb-3">
                  <span className="text-[11px] text-[#8e8e93] bg-[#2c2c2e] px-3 py-1 rounded-full">
                    {new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
                  </span>
                </div>
              )}

              {/* Messages */}
              {messages.map((msg: Message, idx: number) => {
                const isUser = msg.role === 'user';
                const prevMsg = messages[idx - 1];
                const isSameRole = prevMsg?.role === msg.role;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${isSameRole ? 'mt-0.5' : 'mt-3'}`}
                  >
                    {/* AI avatar - show only on first in a sequence */}
                    {!isUser && !isSameRole && (
                      <div className="w-6 h-6 rounded-full bg-[#0a84ff]/20 border border-[#0a84ff]/40 flex items-center justify-center mr-1 mt-auto mb-0.5 flex-shrink-0">
                        <Bot size={10} className="text-[#0a84ff]" />
                      </div>
                    )}
                    {!isUser && isSameRole && <div className="w-7 flex-shrink-0" />}

                    <div
                      className={`
                        max-w-[78%] px-4 py-2.5 text-[15px] leading-relaxed
                        ${isUser
                          ? 'bg-[#0a84ff] text-white rounded-[20px] rounded-tr-[5px]'
                          : 'bg-[#2c2c2e] text-white rounded-[20px] rounded-tl-[5px]'
                        }
                        ${isUser && isSameRole ? 'rounded-tr-[20px] rounded-br-[5px]' : ''}
                        ${!isUser && isSameRole ? 'rounded-tl-[20px] rounded-bl-[5px]' : ''}
                      `}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-p:leading-relaxed prose-ul:my-1 prose-li:my-0.5 prose-strong:text-white prose-pre:bg-black/50 prose-pre:text-xs prose-a:text-[#0a84ff]">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator - iMessage style */}
              {isLoading && (
                <div className="flex justify-start mt-3">
                  <div className="w-6 h-6 rounded-full bg-[#0a84ff]/20 border border-[#0a84ff]/40 flex items-center justify-center mr-1 mt-auto mb-0.5 flex-shrink-0">
                    <Bot size={10} className="text-[#0a84ff]" />
                  </div>
                  <div className="bg-[#2c2c2e] px-4 py-3 rounded-[20px] rounded-tl-[5px] flex items-center gap-1.5">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <m.div
                        key={i}
                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay }}
                        className="w-2 h-2 bg-[#8e8e93] rounded-full"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 mt-3 bg-[#ff453a]/10 border border-[#ff453a]/20 rounded-2xl p-3">
                  <AlertCircle size={14} className="text-[#ff453a] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#ff453a]">通信エラーが発生しました</p>
                    <p className="text-[10px] text-[#ff453a]/70 mt-0.5 break-all">{error.message}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ─── Input Area - iMessage style ─── */}
            <div className={`px-3 py-3 bg-[#1c1c1e] border-t border-white/10 ${isFullscreen ? 'pb-safe-bottom pb-6' : ''}`}>
              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <div className="flex-1 bg-[#2c2c2e] rounded-[22px] border border-white/10 px-4 py-2.5 min-h-[44px] flex items-center">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="メッセージを入力..."
                    className="w-full bg-transparent text-white text-[15px] focus:outline-none placeholder:text-[#636366]"
                    disabled={isLoading}
                    autoComplete="off"
                    autoCorrect="off"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                    input.trim() && !isLoading
                      ? 'bg-[#0a84ff] text-white shadow-[0_2px_12px_rgba(10,132,255,0.4)] hover:bg-[#0070e0] active:scale-95'
                      : 'bg-[#2c2c2e] text-[#636366] cursor-not-allowed'
                  }`}
                  aria-label="送信"
                >
                  <Send size={15} className={input.trim() ? 'ml-0.5' : ''} />
                </button>
              </form>
            </div>

          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
