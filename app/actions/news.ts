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

    const { error } = await supabase
        .from('news')
        .insert(data);

    if (error) {
        console.error('Error adding news:', error);
        throw new Error('Failed to add news');
    }

    revalidatePath('/');
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
}
