import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AgentDashboardClient from './AgentDashboardClient';
import { getAgentProfile, getAgentActiveOperations, getAgentLogistics } from '@/app/actions/agent';

export const metadata = {
  title: 'Agent Dashboard | MIENO CORP.',
  description: 'MIENO CORP. Agent Dashboard',
};

export default async function AgentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch agent profile
  const { profile: agentProfile } = await getAgentProfile();

  // Fetch surveys and logistics in parallel
  const [
    { surveys },
    { requests }
  ] = await Promise.all([
    getAgentActiveOperations(),
    getAgentLogistics()
  ]);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
       <AgentDashboardClient
         user={user}
         agentProfile={agentProfile}
         surveys={surveys}
         requests={requests}
       />
    </div>
  );
}
