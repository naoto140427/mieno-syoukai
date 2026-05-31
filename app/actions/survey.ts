'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { TouringSurvey } from '@/types/database';

export async function upsertSurvey(data: { news_id: number | string, attendance_status: 'JOIN' | 'PENDING' | 'DECLINE', vehicle_info?: string, message?: string }) {
    try {
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

        // Cast news_id to string to match DB column type
        const newsIdStr = String(data.news_id);

        // Check if survey already exists for this agent and news_id
        const { data: existingSurvey } = await supabase
            .from('touring_surveys')
            .select('id')
            .eq('news_id', newsIdStr)
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
                    news_id: newsIdStr,
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
    } catch (error) {
        console.error('Action Error in upsertSurvey:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown Server Error' };
    }
}

export async function submitSurvey(data: Omit<TouringSurvey, 'id' | 'created_at'>) {
    // Legacy support - stringify news_id for DB compatibility
    const supabase = await createClient();

    const { error } = await supabase
        .from('touring_surveys')
        .insert({
            ...data,
            news_id: String(data.news_id),
        });

    if (error) {
        console.error('Error submitting survey:', error);
        throw new Error('Failed to submit survey');
    }

    revalidatePath(`/news/${data.news_id}`);
    revalidatePath('/admin');
    return { success: true };
}

export async function getSurveysByNewsId(newsId: number | string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('touring_surveys')
        .select('*')
        .eq('news_id', String(newsId))
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching surveys:', error);
        return [];
    }

    return (data as TouringSurvey[]) || [];
}

export async function getUserSurveyByNewsId(newsId: number | string): Promise<TouringSurvey | null> {
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
        .eq('news_id', String(newsId))
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

export async function deleteSurvey(id: string) {
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

export async function getAllTouringSurveys() {
    try {
        const supabase = await createClient();

        // Admin Auth check
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error('Unauthorized: No user session');
            return [];
        }

        const { data: profile } = await supabase
            .from('agents')
            .select('role')
            .eq('id', user.id)
            .single();

        const role = profile?.role;
        const adminRoles = ['CTO', 'CEO', 'CMO', 'Admin'];

        if (!role || !adminRoles.includes(role)) {
            console.error('Unauthorized: Not an admin');
            return [];
        }

        // Fetch all surveys with news title
        const { data, error } = await supabase
            .from('touring_surveys')
            .select(`
                *,
                news (
                    title
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching all surveys:', error);
            return [];
        }

        // Map data to handle relation smoothly
        return (data || []).map((item: any) => ({
            ...item,
            news_title: item.news?.title || 'Unknown Operation'
        }));
    } catch (error) {
        console.error('Action Error in getAllTouringSurveys:', error);
        return [];
    }
}
