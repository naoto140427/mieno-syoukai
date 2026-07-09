'use server'

import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { News } from '@/types/database';
import { logAuditAction } from './audit';

// ─────────────────────────────────────────────────────────────
// PUBLIC READ FUNCTIONS (Zero-Latency / Edge Cached)
// createPublicClient + unstable_cache を使用し、cookiesを読まない
// ─────────────────────────────────────────────────────────────

export const getNews = unstable_cache(
  async (limit?: number): Promise<News[]> => {
    const supabase = createPublicClient();

    let query = supabase
      .from('news')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('is_pinned', { ascending: false })
      .order('date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching news:', error);
      return [];
    }

    return (data as News[]) || [];
  },
  ['news-list'],
  { tags: ['news'], revalidate: false }
);

export const getNewsById = unstable_cache(
  async (id: number): Promise<News | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .eq('status', 'PUBLISHED')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error fetching news by id:', error);
      throw new Error('Failed to fetch news');
    }

    return data as News;
  },
  ['news-by-id'],
  { tags: ['news'], revalidate: false }
);

// ─────────────────────────────────────────────────────────────
// WRITE FUNCTIONS (Admin Only / RLS Protected)
// createClient (server) を使用し、認証セッションを確認する
// ─────────────────────────────────────────────────────────────

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

  if (error) {
    console.error('Error adding news:', error);
    throw new Error('Failed to add news');
  }

  // INSERT成功後にLINE通知送信（TOURINGカテゴリかつ公開時のみ）
  if (insertedData && insertedData.category === 'TOURING' && insertedData.status === 'PUBLISHED') {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mieno-corp.vercel.app'}/news/${insertedData.id}`;
    await sendLineNotification(insertedData.title, url);
  }

  // オンデマンドキャッシュパージ
  revalidateTag('news', 'default');
  revalidatePath('/');
  revalidatePath('/news');

  await logAuditAction('CREATE_NEWS', 'news', insertedData?.id?.toString(), { title: data.title, status: data.status });
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

  // オンデマンドキャッシュパージ
  revalidateTag('news', 'default');
  revalidatePath('/');
  revalidatePath('/news');

  await logAuditAction('UPDATE_NEWS', 'news', id.toString(), { updated_fields: Object.keys(data) });
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

  // オンデマンドキャッシュパージ
  revalidateTag('news', 'default');
  revalidatePath('/');
  revalidatePath('/news');

  await logAuditAction('DELETE_NEWS', 'news', id.toString());
}

export async function sendLineNotification(title: string, url: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const groupId = process.env.LINE_GROUP_ID;

  if (!token) {
    console.warn('LINE_CHANNEL_ACCESS_TOKEN not set. Skipping LINE notification.');
    return;
  }

  const message = `[MIENO COMMAND CENTER] 新たな作戦『${title}』が発令されました。各員、直ちに詳細を確認しRSVPを提出せよ。 URL: ${url}`;

  try {
    if (groupId) {
      // グループIDが設定されている場合はプッシュ配信
      const response = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          to: groupId,
          messages: [
            {
              type: 'text',
              text: message
            }
          ]
        })
      });

      if (!response.ok) {
        console.error('Failed to send LINE push notification:', await response.text());
      }
    } else {
      // グループIDがない場合は従来のブロードキャスト（個人宛一斉送信）
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
        console.error('Failed to send LINE broadcast notification:', await response.text());
      }
    }
  } catch (error) {
    console.error('Error sending LINE notification:', error);
  }
}
