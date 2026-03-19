'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { TouringSurvey } from '@/types/database';

export async function submitSurvey(data: Omit<TouringSurvey, 'id' | 'created_at'>) {
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
