/**
 * Admin Dashboard Loading UI
 *
 * app/admin/page.tsx がデータを取得している間に表示されるスケルトンUI。
 * これにより、ログイン後や画面遷移時の「フリーズ感」を解消する。
 */
export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#0A0E17] text-white font-sans">
      {/* Scan-line overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)',
        }}
      />

      {/* Header skeleton */}
      <header className="sticky top-0 z-30 bg-[#0A0E17]/80 backdrop-blur-md border-b border-white/[0.05] px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <div className="h-4 w-44 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-7 w-20 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-8 w-8 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-8 w-8 bg-white/10 rounded-lg animate-pulse" />
        </div>
      </header>

      {/* Main skeleton grid */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Clock panel */}
          <div className="md:col-span-2 bg-[#0D111A]/80 border border-white/[0.06] rounded-2xl p-8 min-h-[180px] flex flex-col justify-between">
            <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
            <div className="h-12 w-36 bg-white/10 rounded animate-pulse mt-4" />
          </div>

          {/* Stat card 1 */}
          <div className="bg-[#0D111A]/80 border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between gap-4">
            <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-10 w-12 bg-white/10 rounded animate-pulse" />
          </div>

          {/* Stat card 2 */}
          <div className="bg-[#0D111A]/80 border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between gap-4">
            <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-10 w-12 bg-white/10 rounded animate-pulse" />
          </div>

          {/* Quick launch panel */}
          <div className="md:col-span-4 bg-[#0D111A]/80 border border-white/[0.06] rounded-2xl p-5">
            <div className="h-3 w-24 bg-white/10 rounded animate-pulse mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-white/[0.03] border border-white/[0.05] rounded-xl animate-pulse" />
              ))}
            </div>
          </div>

          {/* Log stream panels */}
          <div className="md:col-span-2 bg-[#0D111A]/80 border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-4">
            <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-white/[0.03] rounded-xl animate-pulse" />
            ))}
          </div>

          <div className="md:col-span-2 bg-[#0D111A]/80 border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-4">
            <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-white/[0.03] rounded-xl animate-pulse" />
            ))}
          </div>

          {/* Footer */}
          <div className="md:col-span-4 bg-[#0D111A]/80 border border-white/[0.06] rounded-2xl px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-3 w-28 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-40 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
          </div>
        </div>

        {/* Loading indicator */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
          <p className="text-white/20 font-mono text-[10px] tracking-[0.3em] uppercase">
            Initializing Command Center...
          </p>
        </div>
      </main>
    </div>
  )
}
