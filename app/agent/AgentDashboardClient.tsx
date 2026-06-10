'use client';

import { m, AnimatePresence } from 'framer-motion';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { Agent } from '@/types/database';
import { ExtendedSurvey, ExtendedRequest } from '@/app/actions/agent';
import {
  Package, Calendar, MapPin, Activity,
  ShieldCheck, LogOut, User, Newspaper,
  ChevronRight, Clock, CheckCircle2, XCircle, RotateCcw
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ClientMotionWrapper from '@/components/ClientMotionWrapper';

interface AgentDashboardClientProps {
  user: SupabaseUser;
  agentProfile: Agent | null;
  surveys: ExtendedSurvey[];
  requests: ExtendedRequest[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 26 } }
};

const STATUS_CONFIG = {
  APPROVED: { label: 'APPROVED', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500' },
  PENDING:  { label: 'PENDING',  icon: Clock,         color: 'text-amber-600',   bg: 'bg-amber-50',   bar: 'bg-amber-400' },
  REJECTED: { label: 'REJECTED', icon: XCircle,        color: 'text-rose-600',    bg: 'bg-rose-50',    bar: 'bg-rose-500' },
  RETURNED: { label: 'RETURNED', icon: RotateCcw,      color: 'text-gray-500',    bg: 'bg-gray-100',   bar: 'bg-gray-300' },
} as const;

export default function AgentDashboardClient({ user, agentProfile, surveys, requests }: AgentDashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const pendingCount  = requests.filter(r => r.status === 'PENDING').length;
  const displayName   = agentProfile?.codename || user.email?.split('@')[0].toUpperCase() || 'AGENT';

  return (
    <ClientMotionWrapper>
      <div className="min-h-screen bg-[#F5F5F7]">

        {/* ── Top Bar ─────────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/60"
        >
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-mieno-blue" />
              <span className="text-sm font-bold tracking-widest text-mieno-navy uppercase">Agent Portal</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-bold text-emerald-600 tracking-wider ml-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AUTHORIZED
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/news" className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-mieno-navy transition-colors tracking-wider">
                <Newspaper size={14} />
                <span className="hidden sm:inline">通達 / NEWS</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-gray-500 hover:text-rose-500 hover:bg-rose-50 transition-all border border-gray-200 hover:border-rose-200"
                title="Sign Out"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">SIGN OUT</span>
              </button>
            </div>
          </div>
        </m.div>

        {/* ── Main Content ─────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
          <m.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5"
          >

            {/* ── [1] Profile Card ── */}
            <m.div
              variants={itemVariants}
              className="lg:col-span-4 bg-white rounded-3xl p-7 shadow-sm border border-gray-100/80 relative overflow-hidden"
            >
              {/* accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

              <div className="flex flex-col items-center text-center pt-2">
                {/* Avatar */}
                <div className="relative mb-5">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <User size={32} className="text-indigo-400" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>

                {/* Name & Role */}
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">{displayName}</h2>
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">{agentProfile?.role || 'FIELD AGENT'}</p>
                <p className="text-[11px] font-mono text-gray-400 mb-5 truncate max-w-full">{user.email}</p>

                {/* Stats row */}
                <div className="w-full grid grid-cols-2 gap-3">
                  <div className="bg-[#F5F5F7] rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-gray-900">{surveys.length}</p>
                    <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">Ops Joined</p>
                  </div>
                  <div className="bg-[#F5F5F7] rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-gray-900">{approvedCount}</p>
                    <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">Active Gear</p>
                  </div>
                </div>

                {/* Quick links */}
                <div className="w-full mt-4 space-y-2">
                  <Link
                    href="/news"
                    className="flex items-center justify-between w-full px-4 py-3 bg-[#F5F5F7] hover:bg-blue-50 rounded-2xl transition-colors group"
                  >
                    <span className="text-xs font-bold text-gray-600 group-hover:text-blue-600 tracking-wider uppercase">最新通達を確認</span>
                    <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  <Link
                    href="/inventory"
                    className="flex items-center justify-between w-full px-4 py-3 bg-[#F5F5F7] hover:bg-blue-50 rounded-2xl transition-colors group"
                  >
                    <span className="text-xs font-bold text-gray-600 group-hover:text-blue-600 tracking-wider uppercase">備品をリクエスト</span>
                    <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </div>
              </div>
            </m.div>

            {/* ── [2] Upcoming Deployments ── */}
            <m.div
              variants={itemVariants}
              className="lg:col-span-8 bg-white rounded-3xl p-7 shadow-sm border border-gray-100/80 flex flex-col min-h-[320px]"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <MapPin size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 tracking-widest uppercase">Upcoming Deployments</h3>
                    <p className="text-[10px] text-gray-400 font-mono tracking-wider">参加確定の作戦一覧</p>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono text-gray-400">{surveys.length} OPS</span>
              </div>

              <div className="flex-1 overflow-y-auto">
                <AnimatePresence>
                  {surveys.length === 0 ? (
                    <m.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                        <Activity size={24} className="text-gray-300" />
                      </div>
                      <p className="text-xs font-bold font-mono text-gray-300 tracking-widest uppercase">No Pending Operations</p>
                      <Link
                        href="/news"
                        className="mt-4 text-xs font-bold text-mieno-blue hover:underline tracking-wider"
                      >
                        通達 / NEWS でツーリングに参加 →
                      </Link>
                    </m.div>
                  ) : (
                    <div className="space-y-3 pr-1">
                      {surveys.map((survey, i) => (
                        <m.div
                          key={survey.id}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 28 }}
                          className="group relative bg-[#F5F5F7] hover:bg-white rounded-2xl p-4 border border-transparent hover:border-blue-100 hover:shadow-sm transition-all cursor-default"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1 block">
                                ● CONFIRMED — JOIN
                              </span>
                              <h4 className="text-base font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors truncate">
                                {survey.news?.title || 'Unknown Operation'}
                              </h4>
                              <div className="flex flex-wrap items-center gap-3">
                                {survey.news?.event_date && (
                                  <span className="flex items-center gap-1 text-[11px] text-gray-500 font-mono">
                                    <Calendar size={11} />
                                    {new Date(survey.news.event_date).toLocaleDateString('ja-JP')}
                                  </span>
                                )}
                                {survey.news?.location && (
                                  <span className="flex items-center gap-1 text-[11px] text-gray-500 font-mono">
                                    <MapPin size={11} />
                                    {survey.news.location}
                                  </span>
                                )}
                              </div>
                            </div>
                            {survey.vehicle_info && (
                              <div className="shrink-0 bg-white px-3 py-1.5 rounded-xl border border-gray-100 text-[11px] font-mono text-gray-600 shadow-sm whitespace-nowrap">
                                {survey.vehicle_info}
                              </div>
                            )}
                          </div>
                          {survey.message && (
                            <p className="mt-2.5 text-[11px] text-gray-400 italic border-t border-gray-100 pt-2.5 line-clamp-1">
                              &ldquo;{survey.message}&rdquo;
                            </p>
                          )}
                        </m.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </m.div>

            {/* ── [3] Tactical Gear (Inventory Requests) ── */}
            <m.div
              variants={itemVariants}
              className="lg:col-span-12 bg-white rounded-3xl p-7 shadow-sm border border-gray-100/80"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-gray-50 rounded-xl">
                    <Package size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 tracking-widest uppercase">Tactical Gear</h3>
                    <p className="text-[10px] text-gray-400 font-mono tracking-wider">装備リクエスト状況</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {pendingCount > 0 && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                      {pendingCount} PENDING
                    </span>
                  )}
                  <span className="text-xs font-bold font-mono text-gray-400">{requests.length} ITEMS</span>
                </div>
              </div>

              {requests.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                  <Package size={28} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-xs font-bold font-mono text-gray-300 tracking-widest uppercase">No Equipment Issued</p>
                  <Link
                    href="/inventory"
                    className="mt-3 inline-block text-xs font-bold text-mieno-blue hover:underline tracking-wider"
                  >
                    備品リストを見る →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {requests.map((req, i) => {
                    const cfg = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.PENDING;
                    const StatusIcon = cfg.icon;
                    return (
                      <m.div
                        key={req.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05, type: 'spring', stiffness: 320, damping: 28 }}
                        className="relative bg-[#F5F5F7] rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all overflow-hidden"
                      >
                        {/* Status bar */}
                        <div className={`absolute top-0 left-0 right-0 h-0.5 ${cfg.bar}`} />

                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-sm text-gray-900 leading-tight pr-2">{req.tool?.name || 'Unknown Tool'}</h4>
                          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg tracking-wider shrink-0 ${cfg.bg} ${cfg.color}`}>
                            <StatusIcon size={10} />
                            {cfg.label}
                          </span>
                        </div>

                        {req.tool?.spec && (
                          <p className="text-[11px] text-gray-400 mb-3 line-clamp-1">{req.tool.spec}</p>
                        )}

                        <div className="text-[11px] text-gray-500 font-mono space-y-1 border-t border-gray-100/80 pt-3">
                          <div className="flex justify-between">
                            <span>FROM</span>
                            <span className="text-gray-700">{new Date(req.start_date).toLocaleDateString('ja-JP')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>TO</span>
                            <span className="text-gray-700">{new Date(req.end_date).toLocaleDateString('ja-JP')}</span>
                          </div>
                        </div>
                      </m.div>
                    );
                  })}
                </div>
              )}
            </m.div>

          </m.div>
        </div>
      </div>
    </ClientMotionWrapper>
  );
}
