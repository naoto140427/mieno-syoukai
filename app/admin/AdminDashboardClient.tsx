'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Activity, Archive, Megaphone, Clock, Mail, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

import TransmissionControl from '@/components/admin/TransmissionControl';
import LiveEditor from '@/components/admin/LiveEditor';
import OperationBoard from '@/components/admin/OperationBoard';
import GlobalOverride from '@/components/admin/GlobalOverride';

const supabase = createClient();

interface DashboardProps {
  user: any;
  stats: {
    news: number;
    archives: number;
    unreadInquiries: number;
  };
  latestInquiries: any[];
  latestNews: any[];
}

const generateTrendData = () => {
    return Array.from({ length: 15 }, (_, i) => ({
        name: `Day ${i}`,
        uv: Math.floor(Math.random() * 50) + 10,
    }));
};

const chartData = generateTrendData();

export default function AdminDashboardClient({ user, stats, latestInquiries, latestNews }: DashboardProps) {
  const router = useRouter();
  const [time, setTime] = useState(new Date());

  // Panel states
  const [isTransmissionOpen, setTransmissionOpen] = useState(false);
  const [isLiveEditorOpen, setLiveEditorOpen] = useState(false);
  const [isOperationBoardOpen, setOperationBoardOpen] = useState(false);
  const [isGlobalOverrideOpen, setGlobalOverrideOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 pb-24 font-sans selection:bg-gray-200">
      <header className="sticky top-0 z-30 bg-[#F5F5F7]/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 flex justify-between items-center">
        <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">MIENO COMMAND CENTER</h1>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest mt-1 uppercase">Strategic Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
            <button
                onClick={() => setGlobalOverrideOpen(true)}
                className="p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-gray-900 hover:shadow-md transition-all active:scale-95"
            >
                <Settings size={18} />
            </button>
            <div className="text-right mr-2 hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{user.email}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Agent</p>
            </div>
            <button onClick={handleLogout} className="p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:shadow-md transition-all active:scale-95">
                <LogOut size={18} />
            </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
            {/* Top Left: Clock & Status */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-2 bg-white/5 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 shadow-sm flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white to-gray-50">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Activity size={160} />
                </div>
                <div className="relative z-10">
                    <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        System Status: Online
                    </h2>
                    <div className="mt-8">
                        <p className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900">
                            {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' })}
                            <span className="text-2xl md:text-4xl text-gray-400 font-normal ml-2">{time.getSeconds().toString().padStart(2, '0')}</span>
                        </p>
                        <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase mt-4">
                            {time.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')} / JST
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Top Right: Stat Cards */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col gap-6">
                <button onClick={() => setOperationBoardOpen(true)} className="text-left bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col justify-center relative overflow-hidden group hover:border-gray-300 transition-colors">
                     <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Archive size={100} />
                     </div>
                     <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Operations Board</h3>
                     <p className="text-5xl font-bold tracking-tighter text-gray-900">{stats.archives}</p>
                </button>
                <button onClick={() => setLiveEditorOpen(true)} className="text-left bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col justify-center relative overflow-hidden group hover:border-gray-300 transition-colors">
                     <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Megaphone size={100} />
                     </div>
                     <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Live Editor</h3>
                     <p className="text-5xl font-bold tracking-tighter text-gray-900">{stats.news}</p>
                </button>
            </motion.div>

            {/* Unread Intel (Transmission Control) */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-3 lg:col-span-1 flex flex-col gap-6">
                <button onClick={() => setTransmissionOpen(true)} className="text-left bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 shadow-md border border-blue-500 flex-1 flex flex-col justify-center relative overflow-hidden group hover:from-blue-700 hover:to-blue-900 transition-colors">
                     <div className="absolute right-0 top-0 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Mail size={120} />
                     </div>
                     <h3 className="text-xs font-semibold tracking-widest text-blue-200 uppercase mb-2">Unread Intel</h3>
                     <p className="text-5xl font-bold tracking-tighter text-white">{stats.unreadInquiries}</p>
                     <p className="text-xs text-blue-200 mt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Open Transmission Control →
                     </p>
                </button>
            </motion.div>

            {/* Middle Full: Area Chart */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-3 lg:col-span-4 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                 <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-8">Operation Activity Trends</h2>
                 <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="uv" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
                        </AreaChart>
                    </ResponsiveContainer>
                 </div>
            </motion.div>

            {/* Bottom: Latest Transmissions */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-3 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Inquiries */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Latest Inquiries</h2>
                        <span className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-500 uppercase">Live</span>
                    </div>
                    <div className="space-y-4">
                        {latestInquiries.length > 0 ? latestInquiries.map((inq) => (
                            <div key={inq.id} onClick={() => setTransmissionOpen(true)} className="p-4 rounded-2xl bg-[#F5F5F7] hover:bg-gray-100 transition-colors flex items-center justify-between border border-transparent hover:border-gray-200 cursor-pointer">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-gray-900 text-sm">{inq.subject}</h3>
                                        {inq.status === 'unread' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">{inq.name}</p>
                                </div>
                                <span className="text-[10px] text-gray-400 font-mono">
                                    {new Date(inq.created_at).toLocaleDateString('ja-JP')}
                                </span>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-400 italic">No new inquiries.</p>
                        )}
                    </div>
                </div>

                {/* News */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Recent Broadcasts</h2>
                        <span className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-500 uppercase">Log</span>
                    </div>
                    <div className="space-y-4">
                        {latestNews.length > 0 ? latestNews.map((news) => (
                            <div key={news.id} onClick={() => setLiveEditorOpen(true)} className="p-4 rounded-2xl bg-[#F5F5F7] hover:bg-gray-100 transition-colors flex items-center justify-between border border-transparent hover:border-gray-200 cursor-pointer">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">{news.category}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{news.title}</h3>
                                </div>
                                <span className="text-[10px] text-gray-400 font-mono shrink-0 ml-4">
                                    {new Date(news.date).toLocaleDateString('ja-JP')}
                                </span>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-400 italic">No recent news.</p>
                        )}
                    </div>
                </div>

            </motion.div>

        </motion.div>
      </main>

      {/* Admin Modals */}
      <TransmissionControl
         isOpen={isTransmissionOpen}
         onClose={() => setTransmissionOpen(false)}
         inquiries={latestInquiries}
      />

      <LiveEditor
         isOpen={isLiveEditorOpen}
         onClose={() => setLiveEditorOpen(false)}
      />

      <OperationBoard
         isOpen={isOperationBoardOpen}
         onClose={() => setOperationBoardOpen(false)}
         operations={latestNews}
      />

      <GlobalOverride
         isOpen={isGlobalOverrideOpen}
         onClose={() => setGlobalOverrideOpen(false)}
      />

    </div>
  );
}
