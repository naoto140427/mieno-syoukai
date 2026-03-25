'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { TouringSurvey } from '@/types/database';

export async function upsertSurvey(data: { news_id: number, attendance_status: 'JOIN' | 'PENDING' | 'DECLINE', vehicle_info?: string, message?: string }) {
    const supabase = await createClient();

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('Unauthorized Agent');
    }

    // Determine agent_name securely
    let agentName = user.email || 'Unknown Agent';
    const { data: profile } = await supabase.from('agents').select('*').eq('id', user.id).single();
    if (profile && profile.name) {
        agentName = profile.name;
    }

    // Check if survey already exists for this agent and news_id to determine ID for upsert or do a raw upsert if unique constraint exists
    const { data: existingSurvey } = await supabase
        .from('touring_surveys')
        .select('id')
        .eq('news_id', data.news_id)
        .eq('agent_name', agentName)
        .single();

    let resultError;

    if (existingSurvey) {
        // Update
        const { error } = await supabase
            .from('touring_surveys')
            .update({
                attendance_status: data.attendance_status,
                vehicle_info: data.vehicle_info,
                message: data.message
            })
            .eq('id', existingSurvey.id);
        resultError = error;
    } else {
        // Insert
        const { error } = await supabase
            .from('touring_surveys')
            .insert({
                news_id: data.news_id,
                agent_name: agentName,
                attendance_status: data.attendance_status,
                vehicle_info: data.vehicle_info,
                message: data.message
            });
        resultError = error;
    }

    if (resultError) {
        console.error('Error upserting survey:', resultError);
        throw new Error('Failed to submit RSVP');
    }

    revalidatePath(`/news/${data.news_id}`);
    revalidatePath('/agent');
    revalidatePath('/admin');
    return { success: true };
}

export async function submitSurvey(data: Omit<TouringSurvey, 'id' | 'created_at'>) {
    // Legacy support, but we should secure it if we can.
    // Usually submitSurvey was for public form maybe? But the task implies it's for agents.
    // Leaving it as it was to avoid breaking other parts, but upsertSurvey is the new secure one.
    const supabase = await createClient();

    const { error } = await supabase
        .from('touring_surveys')
        .insert(data);

    if (error) {
        console.error('Error submitting survey:', error);
        throw new Error('Failed to submit survey');
    }

    revalidatePath(`/news/${data.news_id}`);
    revalidatePath('/admin');
    return { success: true };
}

export async function getSurveysByNewsId(newsId: number) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('touring_surveys')
        .select('*')
        .eq('news_id', newsId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching surveys:', error);
        return [];
    }

    return (data as TouringSurvey[]) || [];
}

export async function getUserSurveyByNewsId(newsId: number): Promise<TouringSurvey | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    let agentName = user.email || 'Unknown Agent';
    const { data: profile } = await supabase.from('agents').select('*').eq('id', user.id).single();
    if (profile && profile.name) {
        agentName = profile.name;
    }

    const { data, error } = await supabase
        .from('touring_surveys')
        .select('*')
        .eq('news_id', newsId)
        .eq('agent_name', agentName)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') {
             console.error('Error fetching user survey:', error);
        }
        return null;
    }

    return data as TouringSurvey;
}

export async function deleteSurvey(id: number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('touring_surveys')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting survey:', error);
        throw new Error('Failed to delete survey');
    }
    return { success: true };
}
