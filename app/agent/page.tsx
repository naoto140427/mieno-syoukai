import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AgentDashboardClient from './AgentDashboardClient';
import { TouringSurvey, InventoryRequest } from '@/types/database';

export const metadata = {
  title: 'Agent Dashboard | MIENO CORP.',
  description: 'MIENO CORP. Agent Dashboard',
};

export default async function AgentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin');
  }

  // Find agent profile (assuming 'agents' table or using user email for matching)
  // Memory says: The Admin Login exclusively uses Supabase Auth Magic Link (signInWithOtp) and maps the authenticated user's email to a role-based profile.
  // We will assume agent name matches their email or is in the agents table.
  // We'll fetch surveys joined by this agent. We can use the user's email or a specific ID if present.

  // For now, let's fetch all 'JOIN' surveys that match this user's email or name
  // To be safe, let's fetch surveys where agent_name matches user.email, or if there's an agents table, fetch the profile first.
  let agentName = user.email || 'Unknown Agent';

  const { data: agentProfile } = await supabase
    .from('agents')
    .select('*')
    .eq('id', user.id)
    .single();

  if (agentProfile) {
      agentName = agentProfile.name;
  }

  const { data: surveysData, error: surveysError } = await supabase
    .from('touring_surveys')
    .select('*, news:news_id(*)')
    .eq('agent_name', agentName)
    .eq('attendance_status', 'JOIN')
    .order('created_at', { ascending: false });

  const surveys = (surveysData || []) as any[];

  // Fetch currently requested/loaned equipment
  // Since we are adding InventoryRequest, let's assume 'inventory_requests' table.
  const { data: requestsData, error: requestsError } = await supabase
    .from('inventory_requests')
    .select('*, tool:tool_id(*)')
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false });

  const requests = (requestsData || []) as any[];

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
       <AgentDashboardClient user={user} agentProfile={agentProfile} surveys={surveys} requests={requests} />
    </div>
  );
}
