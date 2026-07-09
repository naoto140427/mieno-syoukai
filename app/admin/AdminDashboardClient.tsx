'use client';

import { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
  LogOut, Activity, Archive, Megaphone, Mail, Settings,
  Users, Radio, Shield, Zap, ChevronRight, Terminal, ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import type { Inquiry, News, TouringSurvey, AuditLog } from '@/types/database';

import TransmissionControl from '@/components/admin/TransmissionControl';
import LiveEditor from '@/components/admin/LiveEditor';
import OperationBoard from '@/components/admin/OperationBoard';
import GlobalOverride from '@/components/admin/GlobalOverride';
import RSVPMonitor from '@/components/admin/RSVPMonitor';
import ClientMotionWrapper from '@/components/ClientMotionWrapper';

const supabase = createClient();

interface DashboardProps {
  user: SupabaseUser;
  role: string;
  stats: { news: number; archives: number; unreadInquiries: number };
  latestInquiries: Inquiry[];
  latestNews: News[];
  surveys?: TouringSurvey[];
  auditLogs?: AuditLog[];
}

// ─── Clock ────────────────────────────────────────────────────────────────────

function SystemClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  const ss = time.getSeconds().toString().padStart(2, '0');
  const date = time.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
  return (
    <div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-5xl font-black text-white tracking-tighter tabular-nums">{hh}</span>
        <span className="text-2xl font-black text-white/30 tabular-nums">:{ss}</span>
      </div>
      <p className="text-[10px] font-mono text-white/30 tracking-[0.25em] uppercase mt-1">{date} · JST</p>
    </div>
  );
}

// ─── Scan Line Overlay ────────────────────────────────────────────────────────

function ScanLines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)',
      }}
    />
  );
}

// ─── Glass Panel ─────────────────────────────────────────────────────────────

function GlassPanel({ children, className = '', onClick }: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`bg-[#0D111A]/80 backdrop-blur-md border border-white/[0.06] rounded-2xl transition-all duration-200 ${onClick ? 'text-left hover:border-white/15 hover:bg-[#0D111A] cursor-pointer active:scale-[0.99]' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, accent, onClick }: {
  label: string; value: number | string; icon: LucideIcon; accent: string; onClick: () => void;
}) {
  return (
    <GlassPanel onClick={onClick} className="p-6 flex flex-col justify-between gap-4 group">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase">{label}</p>
        <Icon size={14} className="text-white/20 group-hover:text-white/40 transition-colors" />
      </div>
      <div>
        <p className={`text-4xl font-black tabular-nums ${accent}`}>{value}</p>
        <div className="flex items-center gap-1.5 mt-2 text-white/20 group-hover:text-white/40 transition-colors">
          <ChevronRight size={12} />
          <span className="text-[10px] font-mono tracking-widest uppercase">Open</span>
        </div>
      </div>
    </GlassPanel>
  );
}

// ─── Activity Log Stream ──────────────────────────────────────────────────────

function LogStream({ items, onClick, type }: {
  items: (Inquiry | News)[];
  onClick: (item?: Inquiry | News) => void;
  type: 'inquiry' | 'news';
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {items.length === 0 && (
        <p className="text-[11px] font-mono text-white/20 py-2">— NO ENTRIES —</p>
      )}
      {items.map((item, i) => {
        const isInquiry = type === 'inquiry';
        const inq = item as Inquiry;
        const news = item as News;
        
        return (
          <m.div
            key={item.id ?? i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onClick(item)}
            className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.07] hover:border-white/10 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              {isInquiry && inq.status === 'unread' && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 animate-pulse" />
              )}
              <span className="text-[11px] text-white/60 font-medium truncate group-hover:text-white/80 transition-colors">
                {isInquiry ? inq.subject : news.title}
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/25 flex-shrink-0">
              {new Date(isInquiry ? inq.created_at : news.date).toLocaleDateString('ja-JP')}
            </span>
          </m.div>
        );
      })}
    </div>
  );
}

// ─── Keyboard shortcut hook ───────────────────────────────────────────────────

function useHotkey(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === key) {
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback]);
}

// ─── Command Bar ─────────────────────────────────────────────────────────────

function CommandBar({ role, onTransmission, onLiveEditor, onOperationBoard, onRSVP, onGlobalOverride }: {
  role: string;
  onTransmission: () => void;
  onLiveEditor: () => void;
  onOperationBoard: () => void;
  onRSVP: () => void;
  onGlobalOverride: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const normalizedRole = role.toLowerCase();
  const canAccessSettings = normalizedRole === 'admin' || normalizedRole === 'cto' || normalizedRole === 'ceo';
  const canAccessOpBoard = normalizedRole !== 'cmo'; 
  const canAccessTransmission = normalizedRole !== 'cmo';

  const COMMANDS = [
    ...(canAccessTransmission ? [{ label: '通信管制 Transmission Control', shortcut: 'T', action: onTransmission, icon: Radio }] : []),
    { label: 'ライブエディタ Live Editor',     shortcut: 'E', action: onLiveEditor,   icon: Megaphone },
    ...(canAccessOpBoard ? [{ label: '作戦ボード Operation Board',     shortcut: 'O', action: onOperationBoard,icon: Archive }] : []),
    { label: 'RSVP モニター',                  shortcut: 'R', action: onRSVP,         icon: Users },
    ...(canAccessSettings ? [{ label: 'グローバル設定 Override',         shortcut: 'G', action: onGlobalOverride,icon: Settings }] : []),
  ];

  const filtered = COMMANDS.filter((c) =>
    query === '' || c.label.toLowerCase().includes(query.toLowerCase())
  );

  useHotkey('k', () => setOpen((v) => !v));
  useHotkey('t', onTransmission);
  useHotkey('e', onLiveEditor);
  useHotkey('o', onOperationBoard);
  useHotkey('r', onRSVP);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/10 transition-all text-[11px] font-mono"
      >
        <Terminal size={12} />
        <span>⌘K</span>
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh] px-6 bg-black/60 backdrop-blur-sm"
            onClick={() => { setOpen(false); setQuery(''); }}
          >
            <m.div
              initial={{ scale: 0.96, opacity: 0, y: -8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#0D111A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                <Terminal size={14} className="text-white/30" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="コマンドを検索..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none font-mono"
                />
                <kbd className="text-[10px] font-mono text-white/20 bg-white/5 px-2 py-0.5 rounded">ESC</kbd>
              </div>
              <div className="p-2">
                {filtered.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.shortcut}
                      onClick={() => { cmd.action(); setOpen(false); setQuery(''); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/[0.06] transition-colors group"
                    >
                      <Icon size={14} className="text-white/30 group-hover:text-white/60 transition-colors" />
                      <span className="flex-1 text-sm text-white/60 group-hover:text-white/90 transition-colors font-medium">{cmd.label}</span>
                      <kbd className="text-[10px] font-mono text-white/20 bg-white/5 px-2 py-0.5 rounded">⌘{cmd.shortcut}</kbd>
                    </button>
                  );
                })}
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardClient({ user, role, stats, latestInquiries, latestNews, surveys = [], auditLogs = [] }: DashboardProps) {
  const router = useRouter();
  const [isTransmissionOpen, setTransmissionOpen] = useState(false);
  const [isLiveEditorOpen, setLiveEditorOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isOperationBoardOpen, setOperationBoardOpen] = useState(false);
  const [isGlobalOverrideOpen, setGlobalOverrideOpen] = useState(false);
  const [isRSVPOpen, setRSVPOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  const rsvpActive = surveys.filter((s: { attendance_status: string; }) => s.attendance_status === 'PENDING').length;

  const handleOpenLiveEditor = (news?: News) => {
    setEditingNews(news || null);
    setLiveEditorOpen(true);
  };

  const drafts = latestNews.filter(n => n.status === 'DRAFT');
  const publishedNews = latestNews.filter(n => n.status !== 'DRAFT');

  return (
    <ClientMotionWrapper>
      <div className="min-h-screen bg-[#0A0E17] text-white font-sans selection:bg-white/10">
        <ScanLines />

        {/* ── Header ──────────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 bg-[#0A0E17]/80 backdrop-blur-md border-b border-white/[0.05] px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <div>
              <p className="text-sm font-bold text-white leading-none tracking-wide">MIENO COMMAND CENTER</p>
              <p className="text-[9px] font-mono text-white/25 tracking-[0.3em] uppercase mt-0.5">Strategic Operations HQ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CommandBar
              role={role}
              onTransmission={() => setTransmissionOpen(true)}
              onLiveEditor={() => handleOpenLiveEditor()}
              onOperationBoard={() => setOperationBoardOpen(true)}
              onRSVP={() => setRSVPOpen(true)}
              onGlobalOverride={() => setGlobalOverrideOpen(true)}
            />
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-mono text-white/50">{user.email}</p>
            </div>
            
            {(role.toLowerCase() === 'admin' || role.toLowerCase() === 'cto' || role.toLowerCase() === 'ceo') && (
              <button
                onClick={() => setGlobalOverrideOpen(true)}
                className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-all"
              >
                <Settings size={14} />
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={14} />
            </button>
          </div>
        </header>

        {/* ── Main Grid ───────────────────────────────────────────── */}
        <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >

            {/* ── Row 1: Clock + Status ──────────────────────────── */}
            <GlassPanel className="md:col-span-2 p-8 flex flex-col justify-between gap-8 min-h-[180px]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-mono text-white/25 tracking-[0.3em] uppercase mb-1">System Status</p>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[11px] font-mono text-green-400/80 tracking-widest">ONLINE · ALL SYSTEMS GO</span>
                  </div>
                </div>
                <Shield size={16} className="text-white/10" />
              </div>
              <SystemClock />
            </GlassPanel>

            <StatCard
              label="Unread Intel"
              value={stats.unreadInquiries}
              icon={Mail}
              accent={stats.unreadInquiries > 0 ? 'text-blue-400' : 'text-white/60'}
              onClick={() => setTransmissionOpen(true)}
            />
            <StatCard
              label="RSVP Active"
              value={rsvpActive}
              icon={Users}
              accent={rsvpActive > 0 ? 'text-indigo-400' : 'text-white/60'}
              onClick={() => setRSVPOpen(true)}
            />

            {/* ── Row 2: Quick Launch ────────────────────────────── */}
            <GlassPanel className="md:col-span-4 p-5">
              <p className="text-[9px] font-mono text-white/20 tracking-[0.3em] uppercase mb-4">Quick Launch</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ...(role.toLowerCase() !== 'cmo' ? [{ label: '通信管制', sub: 'Transmission', icon: Radio,    count: stats.unreadInquiries, action: () => setTransmissionOpen(true)    }] : []),
                  { label: 'ライブエディタ', sub: 'Live Editor', icon: Megaphone, count: stats.news,             action: () => handleOpenLiveEditor()     },
                  ...(role.toLowerCase() !== 'cmo' ? [{ label: '作戦ボード', sub: 'Op. Board',   icon: Archive,  count: stats.archives,        action: () => setOperationBoardOpen(true)  }] : []),
                  { label: 'RSVP',     sub: 'Monitor',     icon: Users,    count: rsvpActive,            action: () => setRSVPOpen(true)           },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.sub}
                      onClick={item.action}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/10 transition-all group text-left"
                    >
                      <div>
                        <p className="text-[9px] font-mono text-white/25 tracking-widest uppercase">{item.sub}</p>
                        <p className="text-sm font-bold text-white/70 group-hover:text-white transition-colors mt-0.5">{item.label}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Icon size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
                        {item.count > 0 && (
                          <span className="text-[10px] font-black text-white/50 tabular-nums">{item.count}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </GlassPanel>

            {role.toLowerCase() !== 'cmo' && (
              <GlassPanel className="md:col-span-2 p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-mono text-white/20 tracking-[0.3em] uppercase">Latest Transmissions</p>
                    <p className="text-sm font-bold text-white/70 mt-0.5">未読インテル</p>
                  </div>
                  {stats.unreadInquiries > 0 && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      <span className="text-[10px] font-mono text-blue-400">{stats.unreadInquiries} unread</span>
                    </span>
                  )}
                </div>
                <LogStream items={latestInquiries.slice(0, 5)} onClick={() => setTransmissionOpen(true)} type="inquiry" />
              </GlassPanel>
            )}

            <GlassPanel className={role.toLowerCase() === 'cmo' ? "md:col-span-4 p-6 flex flex-col gap-4" : "md:col-span-2 p-6 flex flex-col gap-4"}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-mono text-white/20 tracking-[0.3em] uppercase">Drafts & Scheduled</p>
                  <p className="text-sm font-bold text-white/70 mt-0.5">下書き・公開待ち</p>
                </div>
                <span className="text-[10px] font-mono text-white/30">{drafts.length} drafts</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {drafts.length === 0 ? (
                  <p className="text-xs font-mono text-white/30 mt-4">No drafts found.</p>
                ) : (
                  drafts.map(draft => (
                    <div 
                      key={draft.id} 
                      onClick={() => handleOpenLiveEditor(draft)}
                      className="group p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">{draft.title}</span>
                        <span className="text-[9px] font-mono text-amber-500/70 border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 rounded">DRAFT</span>
                      </div>
                      <div className="text-[10px] font-mono text-white/40 flex items-center gap-2">
                        <span>{draft.category}</span>
                        <span>{new Date(draft.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassPanel>

            <GlassPanel className={role.toLowerCase() === 'cmo' ? "md:col-span-4 p-6 flex flex-col gap-4" : "md:col-span-2 p-6 flex flex-col gap-4"}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-mono text-white/20 tracking-[0.3em] uppercase">Recent Broadcasts</p>
                  <p className="text-sm font-bold text-white/70 mt-0.5">最近の通達</p>
                </div>
                <span className="text-[10px] font-mono text-white/30">LATEST {publishedNews.slice(0, 5).length}</span>
              </div>
              <LogStream items={publishedNews.slice(0, 5)} onClick={(item) => handleOpenLiveEditor(item as News)} type="news" />
            </GlassPanel>

            {/* ── Row 4: System info footer ─────────────────────── */}
            <GlassPanel className="md:col-span-4 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-mono text-white/20 tracking-widest uppercase">MIENO ERP v2.0</span>
                <span className="text-[10px] font-mono text-white/15">·</span>
                <span className="text-[10px] font-mono text-white/20">Next.js 16 · Supabase · Turbopack</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={11} className="text-green-400/50" />
                <span className="text-[10px] font-mono text-green-400/50 tracking-widest">NOMINAL</span>
              </div>
            </GlassPanel>

          </m.div>
        </main>

        {/* ── Modals ──────────────────────────────────────────────── */}
        {role.toLowerCase() !== 'cmo' && <TransmissionControl isOpen={isTransmissionOpen} onClose={() => setTransmissionOpen(false)} inquiries={latestInquiries} />}
        <LiveEditor isOpen={isLiveEditorOpen} onClose={() => { setLiveEditorOpen(false); setEditingNews(null); }} initialData={editingNews} />
        {role.toLowerCase() !== 'cmo' && <OperationBoard isOpen={isOperationBoardOpen} onClose={() => setOperationBoardOpen(false)} operations={latestNews} />}
        {(role.toLowerCase() === 'admin' || role.toLowerCase() === 'cto' || role.toLowerCase() === 'ceo') && (
          <GlobalOverride isOpen={isGlobalOverrideOpen} onClose={() => setGlobalOverrideOpen(false)} />
        )}
        <RSVPMonitor isOpen={isRSVPOpen} onClose={() => setRSVPOpen(false)} surveys={surveys} />
      </div>
    </ClientMotionWrapper>
  );
}
