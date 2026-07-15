'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

/**
 * Admin Dashboard Error Boundary
 *
 * データ取得失敗やクエリエラー発生時に表示される。
 * これにより、1つのクエリ失敗でアプリ全体がクラッシュすることを防ぐ。
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Admin Error Boundary]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0A0E17] flex flex-col items-center justify-center px-6 text-center">
      {/* Scan-line overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)',
        }}
      />

      <div className="relative z-10 max-w-md w-full">
        {/* Error header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">
              System Alert
            </span>
          </div>

          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="w-16 h-16 text-amber-400/60" />
          </div>

          <p className="text-white font-bold text-xl tracking-tight mb-2">
            Command Center Offline
          </p>
          <p className="text-white/30 font-mono text-xs tracking-widest uppercase">
            System encountered an error
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-8" />

        {/* Error message */}
        {error.message && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 mb-6 text-left">
            <p className="text-[9px] font-mono text-white/20 tracking-widest uppercase mb-1">
              Error Detail
            </p>
            <p className="text-sm font-mono text-red-400/80 break-all leading-relaxed">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-[10px] font-mono text-white/15 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Retry button */}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.06] border border-white/10 rounded-full text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all font-mono tracking-widest uppercase"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      </div>
    </div>
  )
}
