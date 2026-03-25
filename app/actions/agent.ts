'use server';

import { createClient } from '@/lib/supabase/server';
import { Agent, News, Tool } from '@/types/database';

// Extended types
export interface ExtendedSurvey {
  id: number;
  news_id: number;
  agent_name: string;
  attendance_status: string;
  vehicle_info?: string;
  message?: string;
  created_at?: string;
  news: News;
}

export interface ExtendedRequest {
  id: number;
  tool_id: number;
  agent_id: string;
  start_date: string;
  end_date: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "RETURNED";
  created_at?: string;
  tool: Tool;
}

export async function getAgentProfile(): Promise<{ profile: Agent | null; userEmail: string | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { profile: null, userEmail: null, error: 'Not authenticated' };
    }

    const { data: profile, error: profileError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means zero rows found
      console.error('Error fetching agent profile:', profileError);
    }

    return { profile: profile || null, userEmail: user.email || null, error: null };
  } catch (err) {
    console.error('Unexpected error in getAgentProfile:', err);
    return { profile: null, userEmail: null, error: 'Internal server error' };
  }
}

export async function getAgentActiveOperations(): Promise<{ surveys: ExtendedSurvey[]; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { surveys: [], error: 'Not authenticated' };
    }

    // Securely derive agent name
    let agentName = user.email || 'Unknown Agent';
    const { data: profile } = await supabase.from('agents').select('*').eq('id', user.id).single();
    if (profile) {
       agentName = profile.name;
    }

    const { data, error } = await supabase
      .from('touring_surveys')
      .select('*, news:news_id(*)')
      .eq('agent_name', agentName)
      .eq('attendance_status', 'JOIN')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching operations:', error);
      return { surveys: [], error: error.message };
    }

    return { surveys: (data || []) as ExtendedSurvey[], error: null };
  } catch (err) {
    console.error('Unexpected error in getAgentActiveOperations:', err);
    return { surveys: [], error: 'Internal server error' };
  }
}

export async function getAgentLogistics(): Promise<{ requests: ExtendedRequest[]; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { requests: [], error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('inventory_requests')
      .select('*, tool:tool_id(*)')
      .eq('agent_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching logistics:', error);
      return { requests: [], error: error.message };
    }

    return { requests: (data || []) as ExtendedRequest[], error: null };
  } catch (err) {
    console.error('Unexpected error in getAgentLogistics:', err);
    return { requests: [], error: 'Internal server error' };
  }
}
