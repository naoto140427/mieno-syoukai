"use client"

import { useState, useActionState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react'
import { signInWithEmail } from '@/app/actions/auth'

const initialState = {
  success: false,
  message: '',
}

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, initialState)
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-200/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gray-300/30 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6"
          >
            <ShieldCheck className="w-8 h-8 text-[#1D1D1F]" strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F] mb-2">
            Agent Authentication
          </h1>
          <p className="text-[#86868B] text-sm">
            MIENO CORP. セキュア・アクセス・ポータル
          </p>
        </div>

        {/* Bento Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <AnimatePresence mode="wait">
            {state.success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-medium text-[#1D1D1F] mb-2">
                  リンクを送信しました
                </h3>
                <p className="text-[#86868B] text-sm leading-relaxed mb-6">
                  {email} 宛に認証用リンクを送信しました。<br />
                  メール内のリンクをクリックして<br />システムにアクセスしてください。
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  別のアカウントでログイン
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                action={formAction}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-medium text-[#86868B] uppercase tracking-wider">
                    Agent Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-[#86868B]" strokeWidth={1.5} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="agent@mieno-shokai.com"
                      required
                      className="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-black/[0.08] rounded-2xl text-[#1D1D1F] placeholder-[#86868B] focus:ring-2 focus:ring-black/5 focus:border-black/20 outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {state.message && !state.success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100"
                  >
                    {state.message}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isPending || !email}
                  className="w-full flex items-center justify-center gap-2 bg-[#1D1D1F] hover:bg-black text-white py-3.5 px-4 rounded-2xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>送信中...</span>
                    </>
                  ) : (
                    <>
                      <span>認証リンクを送信</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[#86868B] mt-4">
                  ※ 許可されたエージェント（役員・メンバー）のみアクセス可能です。<br/>
                  Passkeys（生体認証）サポートは現在準備中です。
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
