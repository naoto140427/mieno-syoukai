import { createClient } from '@/lib/supabase/server';
import AdminLoginClient from './AdminLoginClient';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <AdminLoginClient />;
  }

  // Fetch dashboard stats
  const [{ count: newsCount }, { count: archivesCount }, { count: unreadCount }, { data: latestInquiries }, { data: latestNews }] = await Promise.all([
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('archives').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
    supabase.from('inquiries').select('id, name, subject, created_at, status').order('created_at', { ascending: false }).limit(5),
    supabase.from('news').select('id, title, date, category').order('date', { ascending: false }).limit(5),
  ]);

  return (
    <AdminDashboardClient
      user={user}
      stats={{
        news: newsCount || 0,
        archives: archivesCount || 0,
        unreadInquiries: unreadCount || 0,
      }}
      latestInquiries={latestInquiries || []}
      latestNews={latestNews || []}
    />
  );
}
