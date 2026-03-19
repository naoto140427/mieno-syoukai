'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { News } from '@/types/database';

export async function addNews(data: Omit<News, 'id' | 'created_at'>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const { data: insertedData, error } = await supabase
        .from('news')
        .insert(data)
        .select()
        .single();

    if (!error && insertedData && insertedData.category === 'TOURING') {
        const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mieno-corp.vercel.app'}/news/${insertedData.id}`;
        await sendLineNotification(insertedData.title, url);
    }

    if (error) {
        console.error('Error adding news:', error);
        throw new Error('Failed to add news');
    }

    revalidatePath('/');
    revalidatePath('/news');
}

export async function updateNews(id: number, data: Partial<News>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase
        .from('news')
        .update(data)
        .eq('id', id);

    if (error) {
        console.error('Error updating news:', error);
        throw new Error('Failed to update news');
    }

    revalidatePath('/');
    revalidatePath('/news');
}

export async function deleteNews(id: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting news:', error);
        throw new Error('Failed to delete news');
    }

    revalidatePath('/');
    revalidatePath('/news');
}

export async function getNews(limit?: number) {
    const supabase = await createClient();

    let query = supabase
        .from('news')
        .select('*')
        .order('is_pinned', { ascending: false }).order('date', { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching news:', error);
        return [];
    }

    return (data as News[]) || [];
}



export async function getNewsById(id: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null; // Not found
        }
        console.error('Error fetching news by id:', error);
        throw new Error('Failed to fetch news');
    }

    return data as News;
}

export async function sendLineNotification(title: string, url: string) {
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (!token) {
        console.warn('LINE_CHANNEL_ACCESS_TOKEN not set. Skipping LINE notification.');
        return;
    }

    const message = `[MIENO COMMAND CENTER] 新たな作戦『${title}』が発令されました。各員、直ちに詳細を確認しRSVPを提出せよ。 URL: ${url}`;

    try {
        const response = await fetch('https://api.line.me/v2/bot/message/broadcast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                messages: [
                    {
                        type: 'text',
                        text: message
                    }
                ]
            })
        });

        if (!response.ok) {
            console.error('Failed to send LINE notification:', await response.text());
        }
    } catch (error) {
        console.error('Error sending LINE notification:', error);
    }
}
