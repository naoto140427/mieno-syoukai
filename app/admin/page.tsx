import { createClient } from '@/lib/supabase/server';
import AdminDashboardClient from './AdminDashboardClient';
import AdminLoginClient from './AdminLoginClient';
import { getAllTouringSurveys } from '@/app/actions/survey';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return <AdminLoginClient />;
  }

  const { data: profile } = await supabase
    .from('agents')
    .select('role, email, codename')
    .eq('email', user.email)
    .single();

  const role = profile?.role;
  const adminRoles = ['CTO', 'CEO', 'CMO', 'Admin'];

  if (!role || !adminRoles.includes(role)) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
        {/* Scan-line overlay */}
        <div className="pointer-events-none fixed inset-0 z-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)' }} />

        <div className="relative z-10 max-w-lg w-full">
          {/* Warning header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-xs font-bold tracking-[0.2em] uppercase">Security Protocol Active</span>
            </div>
            <div className="text-8xl font-black text-white tracking-tighter leading-none mb-2">403</div>
            <div className="text-2xl font-bold text-white tracking-tight mb-3">ACCESS DENIED</div>
            <div className="text-gray-500 font-mono text-xs tracking-widest uppercase">Secure Sector: Command Center</div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent mb-8" />

          {/* Message */}
          <p className="text-gray-400 text-sm leading-relaxed mb-2">
            このセクションへのアクセスには、<span className="text-white font-semibold">司令官レベルの認証</span>が必要です。
          </p>
          <p className="text-gray-600 font-mono text-xs tracking-widest uppercase mb-10">Clearance Level: CTO / CEO / CMO / Admin Required</p>

          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all font-mono tracking-widest uppercase"
          >
            ← Return to Base
          </Link>
        </div>
      </div>
    );
  }

  const [
    { count: newsCount },
    { count: archivesCount },
    { count: unreadInquiriesCount },
    { data: latestInquiries },
    { data: latestNews },
    surveys
  ] = await Promise.all([
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('archives').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
    supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('news').select('*').order('date', { ascending: false }).limit(5),
    getAllTouringSurveys()
  ]);

  const stats = {
    news: newsCount || 0,
    archives: archivesCount || 0,
    unreadInquiries: unreadInquiriesCount || 0
  };

  return <AdminDashboardClient user={user} stats={stats} latestInquiries={latestInquiries || []} latestNews={latestNews || []} surveys={surveys} />;
}
