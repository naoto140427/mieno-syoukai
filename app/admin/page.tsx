import { createClient } from '@/lib/supabase/server';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
  const mockUser = { id: 'mock', email: 'agent@mieno.test' };
  return (
    <AdminDashboardClient
      user={mockUser}
      stats={{
        news: 42,
        archives: 13,
        unreadInquiries: 3,
      }}
      latestInquiries={[
        { id: 1, name: 'Alice', subject: 'Inquiry Alpha', created_at: new Date().toISOString(), status: 'unread' },
        { id: 2, name: 'Bob', subject: 'Inquiry Beta', created_at: new Date().toISOString(), status: 'unread' },
      ]}
      latestNews={[
        { id: 1, title: 'Operation Alpha Launch', date: new Date().toISOString(), category: 'TOURING' },
        { id: 2, title: 'Maintenance Report', date: new Date().toISOString(), category: 'UPDATE' },
      ]}
    />
  );
}
