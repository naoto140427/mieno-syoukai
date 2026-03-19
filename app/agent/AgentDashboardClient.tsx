'use client';

import { motion } from 'framer-motion';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { Agent, News, Tool, InventoryRequest } from '@/types/database';
import { Package, Calendar, MapPin, Activity, ShieldCheck, LogOut, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface ExtendedSurvey {
  id: number;
  news_id: number;
  agent_name: string;
  attendance_status: string;
  vehicle_info?: string;
  message?: string;
  created_at?: string;
  news: News;
}

interface ExtendedRequest {
  id: number;
  tool_id: number;
  agent_id: string;
  start_date: string;
  end_date: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "RETURNED";
  created_at?: string;
  tool: Tool;
}

interface AgentDashboardClientProps {
  user: SupabaseUser;
  agentProfile: Agent | null;
  surveys: ExtendedSurvey[];
  requests: ExtendedRequest[];
}

export default function AgentDashboardClient({ user, agentProfile, surveys, requests }: AgentDashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as any, stiffness: 300, damping: 24 } }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-12"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mieno-navy flex items-center gap-3">
             <ShieldCheck size={32} className="text-mieno-blue" />
             AGENT PORTAL
          </h1>
          <p className="text-gray-500 font-mono text-sm mt-2">{agentProfile?.role || 'FIELD AGENT'} // {user.email}</p>
        </div>
        <button
           onClick={handleSignOut}
           className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-500 hover:text-red-500 border border-gray-100"
           title="Sign Out"
        >
           <LogOut size={20} />
        </button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >

        {/* Profile Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
           <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg">
              <User size={40} className="text-gray-400" />
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-1">{agentProfile?.name || user.email?.split('@')[0].toUpperCase()}</h2>
           <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full tracking-widest uppercase mb-4">
              ACTIVE
           </span>
           <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 mt-auto">
              <div className="flex justify-between text-sm mb-2">
                 <span className="text-gray-500">Operations Joined</span>
                 <span className="font-bold font-mono">{surveys.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Active Gear</span>
                 <span className="font-bold font-mono">{requests.filter(r => r.status === 'APPROVED').length}</span>
              </div>
           </div>
        </motion.div>

        {/* Operations Bento */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-gray-50 rounded-lg"><MapPin size={20} className="text-gray-600" /></div>
             <h3 className="text-lg font-bold text-gray-900 tracking-tight">UPCOMING DEPLOYMENTS</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
             {surveys.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-gray-400 min-h-[150px]">
                 <Activity size={32} className="mb-3 opacity-20" />
                 <p className="font-mono text-sm">NO PENDING OPERATIONS.</p>
               </div>
             ) : (
               surveys.map(survey => (
                 <div key={survey.id} className="group relative overflow-hidden bg-[#F5F5F7] hover:bg-white rounded-2xl p-5 border border-transparent hover:border-gray-200 transition-all">
                    <div className="flex justify-between items-start">
                       <div>
                         <span className="text-[10px] font-bold text-mieno-blue uppercase tracking-widest mb-1 block">CONFIRMED (JOIN)</span>
                         <h4 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                            {survey.news?.title || 'Unknown Operation'}
                         </h4>
                         {survey.news?.event_date && (
                           <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                              <Calendar size={12} />
                              {new Date(survey.news.event_date).toLocaleDateString()}
                           </div>
                         )}
                       </div>
                       {survey.vehicle_info && (
                          <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 text-xs font-mono text-gray-600 shadow-sm">
                             {survey.vehicle_info}
                          </div>
                       )}
                    </div>
                 </div>
               ))
             )}
          </div>
        </motion.div>

        {/* Gear Bento */}
        <motion.div variants={itemVariants} className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-2">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-gray-50 rounded-lg"><Package size={20} className="text-gray-600" /></div>
             <h3 className="text-lg font-bold text-gray-900 tracking-tight">TACTICAL GEAR</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {requests.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-400 font-mono text-sm border-2 border-dashed border-gray-100 rounded-2xl">
                   NO EQUIPMENT ISSUED.
                </div>
             ) : (
                requests.map(req => (
                   <div key={req.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                      {req.status === 'APPROVED' && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>}
                      {req.status === 'PENDING' && <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>}
                      {req.status === 'RETURNED' && <div className="absolute top-0 left-0 w-1 h-full bg-gray-300"></div>}
                      {req.status === 'REJECTED' && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>}

                      <div className="flex justify-between items-start mb-3">
                         <h4 className="font-bold text-gray-900">{req.tool?.name || 'Unknown Tool'}</h4>
                         <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wider ${
                            req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                            req.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                            req.status === 'RETURNED' ? 'bg-gray-100 text-gray-600' :
                            'bg-rose-50 text-rose-700'
                         }`}>
                            {req.status}
                         </span>
                      </div>

                      <div className="text-xs text-gray-500 font-mono space-y-1">
                         <div className="flex justify-between">
                            <span>From:</span>
                            <span className="text-gray-700">{new Date(req.start_date).toLocaleDateString()}</span>
                         </div>
                         <div className="flex justify-between">
                            <span>To:</span>
                            <span className="text-gray-700">{new Date(req.end_date).toLocaleDateString()}</span>
                         </div>
                      </div>
                   </div>
                ))
             )}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
