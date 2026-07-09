'use client';

import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Lock, User, Send, Mail, CheckCircle2, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import EasterEggModal from '../../components/EasterEggModal';
import ClientMotionWrapper from '@/components/ClientMotionWrapper';
import { useRouter } from 'next/navigation';

const supabase = createClient();

const IS_DEV_BUILD = process.env.NODE_ENV === 'development';

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <m.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 bg-white/90 backdrop-blur-md shadow-2xl rounded-full border border-gray-100 max-w-[90vw]"
    >
      <div className={`p-1 rounded-full ${type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      </div>
      <span className="font-bold text-gray-800 text-sm whitespace-nowrap">{message}</span>
    </m.div>
  );
};

export default function AdminLoginClient() {
  const router = useRouter();
  const [loginId, setLoginId] = useState('naoto150127@gmail.com');
  const [password, setPassword] = useState('0304a0127A');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isWaitingSession, setIsWaitingSession] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const [isDevOrPreview, setIsDevOrPreview] = useState(IS_DEV_BUILD);

  useEffect(() => {
    // Enable password login on localhost or preview domains
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (
        hostname.includes('localhost') ||
        hostname.includes('preview') ||
        hostname.includes('vercel.app')
      ) {
        setIsDevOrPreview(true);
      }
    }
  }, []);

  // 別タブでmagic linkがクリックされた瞬間にここも検知してリダイレクト
  useEffect(() => {
    if (!magicLinkSent) return;

    setIsWaitingSession(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/admin');
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [magicLinkSent, router]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  };

  // 開発環境: パスワードログイン
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId || !password) return;

    setIsLoggingIn(true);
    setErrorDetail(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginId,
        password,
      });

      if (error) throw error;

      showToast('ログイン成功！リダイレクト中...', 'success');
      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      console.error('Password login error:', err);
      const message = err instanceof Error ? err.message : `Error: ${JSON.stringify(err)}`;
      setErrorDetail(message);
      showToast(message, 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 本番環境: マジックリンクログイン
  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId) return;

    setIsLoggingIn(true);
    setErrorDetail(null);
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=/admin`;
      console.log('Sending magic link to:', loginId, 'redirectTo:', redirectTo);

      const { error } = await supabase.auth.signInWithOtp({
        email: loginId,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) throw error;

      setMagicLinkSent(true);
      showToast('認証メールを送信しました。メールを確認してください。', 'success');

    } catch (err: unknown) {
      console.error('Magic link error:', err);
      const message = err instanceof Error
        ? `${err.message}`
        : `Error: ${JSON.stringify(err)}`;
      setErrorDetail(message);
      showToast(message, 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <ClientMotionWrapper>
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 text-gray-900 font-sans">
      <EasterEggModal isOpen={showEasterEgg} onClose={() => setShowEasterEgg(false)} />

      <m.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white/80 backdrop-blur-xl border border-white/40 rounded-[2rem] p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight select-none">
            MIENO CORP.
          </h1>
          <p className="text-gray-400 text-xs font-bold tracking-[0.2em] mt-2 uppercase">Member Dashboard</p>
        </div>

        {/* ======== DEV / PREVIEW: パスワードログインフォーム ======== */}
        {isDevOrPreview ? (
          <form onSubmit={handlePasswordLogin} className="space-y-5">
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2 mb-2">
              <KeyRound className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-[11px] font-bold text-amber-600 tracking-wide">TEST MODE — Password Login</p>
            </div>

            <div className="space-y-1">
              <label className="ml-4 flex items-baseline gap-2">
                <span className="text-sm font-bold text-gray-700">メールアドレス</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">EMAIL</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-medium"
                  placeholder="email@mieno.dev"
                  autoCapitalize="none"
                  disabled={isLoggingIn}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="ml-4 flex items-baseline gap-2">
                <span className="text-sm font-bold text-gray-700">パスワード</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">PASSWORD</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-medium"
                  placeholder="••••••••"
                  disabled={isLoggingIn}
                />
              </div>
            </div>

            {/* Error detail */}
            {errorDetail && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-left">
                <p className="text-xs font-bold text-red-600 mb-1">エラー詳細:</p>
                <p className="text-xs text-red-500 font-mono break-all">{errorDetail}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || !loginId || !password}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-black transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-base">ログイン</span>
                    <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">Sign In with Password</span>
                  </div>
                </>
              )}
            </button>
          </form>
        ) : (
        /* ======== PROD: マジックリンクフォーム ======== */
        <form onSubmit={handleMagicLinkLogin} className="space-y-5">
          {magicLinkSent ? (
              <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">メールを確認してください</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                      認証用のリンクを送信しました。<br />
                      メール内のリンクをクリックして<br />ログインを完了してください。
                  </p>

                  {/* 別タブでのログイン待機インジケーター */}
                  {isWaitingSession && (
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-mono">
                      <Loader2 size={12} className="animate-spin" />
                      <span>ログイン待機中...</span>
                    </div>
                  )}

                  <button
                      type="button"
                      onClick={() => { setMagicLinkSent(false); setIsWaitingSession(false); }}
                      className="mt-4 text-sm text-blue-500 font-bold hover:underline"
                  >
                      メールアドレスを再入力する
                  </button>
              </div>
          ) : (
              <>
                  <div className="space-y-1">
                      <label className="ml-4 flex items-baseline gap-2">
                      <span className="text-sm font-bold text-gray-700">メールアドレス</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">EMAIL</span>
                      </label>
                      <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                              type="text"
                              value={loginId}
                              onChange={(e) => setLoginId(e.target.value)}
                              className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-medium"
                              placeholder="email@mieno.dev"
                              autoCapitalize='none'
                              disabled={isLoggingIn}
                          />
                      </div>
                  </div>

                  {/* Error detail */}
                  {errorDetail && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-left">
                      <p className="text-xs font-bold text-red-600 mb-1">エラー詳細:</p>
                      <p className="text-xs text-red-500 font-mono break-all">{errorDetail}</p>
                    </div>
                  )}

                  <button
                      type="submit"
                      disabled={isLoggingIn || !loginId}
                      className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-black transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                  {isLoggingIn ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                      <>
                      <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                          <Send className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col items-start leading-none">
                          <span className="text-base">マジックリンクを送信</span>
                          <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">Send Magic Link</span>
                      </div>
                      </>
                  )}
                  </button>
              </>
          )}
        </form>
        )}

        <p className="text-center mt-8 font-medium text-gray-400">
           <span className="block text-sm font-bold text-gray-500">※関係者以外アクセス禁止</span>
           <span className="text-[10px] tracking-[0.2em] uppercase">Authorized Personnel Only</span>
        </p>

        <div className="mt-8 flex justify-center">
          <m.button
            onClick={() => setShowEasterEgg(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs text-gray-400 hover:text-gray-900 font-mono tracking-widest border-b border-transparent hover:border-gray-900 transition-colors"
          >
            [ ROOT ACCESS ]
          </m.button>
        </div>
      </m.div>

      <AnimatePresence>
          {toast.show && (
              <Toast
                  message={toast.message}
                  type={toast.type}
                  onClose={() => setToast({ ...toast, show: false })}
              />
          )}
      </AnimatePresence>
    </div>
  </ClientMotionWrapper>
  );
}
