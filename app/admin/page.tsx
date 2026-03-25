import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata = {
  title: 'Admin Dashboard | MIENO CORP.',
  description: 'MIENO CORP. Command Center',
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch agent profile for role-based access control
  const { data: profile } = await supabase
    .from('agents')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role;
  const adminRoles = ['CTO', 'CEO', 'CMO', 'Admin'];

  if (!role || !adminRoles.includes(role)) {
    redirect('/agent');
  }

  // Fetch real data for the dashboard stats
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
    supabase.from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('news')
      .select('*')
      .order('date', { ascending: false })
      .limit(5)
  ]);

  return (
    <AdminDashboardClient
      user={user}
      stats={{
        news: newsCount || 0,
        archives: archivesCount || 0,
        unreadInquiries: unreadInquiriesCount || 0,
      }}
      latestInquiries={latestInquiries || []}
      latestNews={latestNews || []}
    />
  );
}
