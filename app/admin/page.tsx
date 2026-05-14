import { createClient } from '@/lib/supabase/server';
import AdminDashboardClient from './AdminDashboardClient';
import AdminLoginClient from './AdminLoginClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return <AdminLoginClient />;
  }

  const { data: profile, error: dbError } = await supabase
    .from('agents')
    .select('role, email, codename')
    .eq('id', user.id)
    .single();

  const role = profile?.role;
  const adminRoles = ['CTO', 'CEO', 'CMO', 'Admin'];

  if (!role || !adminRoles.includes(role)) {
    return (
      <div style={{ padding: '50px', backgroundColor: '#1a1a1a', color: '#00ffcc', fontFamily: 'monospace', height: '100vh' }}>
        <h1 style={{ color: '#ff4444' }}>🚨 ACCESS DENIED: HUD展開失敗 (DEBUG MODE) 🚨</h1>
        <hr style={{ borderColor: '#333' }} />
        <h2>[1] Auth認証システムが認識しているUUID</h2>
        <p>{user.id}</p>

        <h2>[2] データベース (agentsテーブル) からの応答</h2>
        <p>{JSON.stringify(profile) || 'NULL (データなし)'}</p>
        <p>エラー: {JSON.stringify(dbError) || 'なし'}</p>
      </div>
    );
  }

  // DashboardProps is required for AdminDashboardClient
  // We need to pass user, stats, latestInquiries, latestNews, surveys
  const [
    { count: newsCount },
    { count: archivesCount },
    { count: unreadInquiriesCount },
    { data: latestInquiries },
    { data: latestNews }
  ] = await Promise.all([
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('archives').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
    supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('news').select('*').order('date', { ascending: false }).limit(5)
  ]);

  const stats = {
    news: newsCount || 0,
    archives: archivesCount || 0,
    unreadInquiries: unreadInquiriesCount || 0
  };

  return <AdminDashboardClient user={user} stats={stats} latestInquiries={latestInquiries || []} latestNews={latestNews || []} />;
}
