'use server'

import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { Archive } from '@/types/database';

// ─────────────────────────────────────────────────────────────
// PUBLIC READ FUNCTIONS (Zero-Latency / Edge Cached)
// ─────────────────────────────────────────────────────────────

export const getArchives = unstable_cache(
  async (): Promise<Archive[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('archives')
      // route_data は GPX 全座標を含み 3MB+ になるため一覧では除外
      .select('id, title, date, distance, members, weather, details, geojson, distance_km, max_speed, max_elevation, duration_time, avg_speed, elevation_gain, location_name, created_at')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching archives:', error);
      return [];
    }

    return (data as Archive[]) || [];
  },
  ['archives-list'],
  { tags: ['archives'], revalidate: false }
);

export const getArchiveById = unstable_cache(
  async (id: number): Promise<Archive | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('archives')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching archive with id ${id}:`, error);
      return null;
    }

    return data as Archive;
  },
  ['archive-by-id'],
  { tags: ['archives'], revalidate: false }
);

// ─────────────────────────────────────────────────────────────
// WRITE FUNCTIONS (Admin Only / RLS Protected)
// ─────────────────────────────────────────────────────────────

export async function addArchive(data: Omit<Archive, 'id'>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const payload = {
    title: data.title,
    date: data.date,
    distance: data.distance,
    members: data.members,
    weather: data.weather,
    details: data.details,
    geojson: data.geojson,
    distance_km: data.distance_km,
    max_speed: data.max_speed,
    max_elevation: data.max_elevation,
    duration_time: data.duration_time,
    avg_speed: data.avg_speed,
    elevation_gain: data.elevation_gain,
    route_data: data.route_data,
    location_name: data.location_name
  };

  const { error } = await supabase
    .from('archives')
    .insert(payload);

  if (error) {
    console.error('Error adding archive:', error);
    throw new Error('Failed to add archive');
  }

  // オンデマンドキャッシュパージ
  revalidateTag('archives', 'default');
  revalidatePath('/archives');
  revalidatePath('/');
  return { success: true };
}

export async function updateArchive(id: number, data: Partial<Archive>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('archives')
    .update(data)
    .eq('id', id);

  if (error) {
    console.error('Error updating archive:', error);
    throw new Error('Failed to update archive');
  }

  // オンデマンドキャッシュパージ
  revalidateTag('archives', 'default');
  revalidatePath('/archives');
  revalidatePath('/');
  return { success: true };
}

export async function deleteArchive(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('archives')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting archive:', error);
    throw new Error('Failed to delete archive');
  }

  // オンデマンドキャッシュパージ
  revalidateTag('archives', 'default');
  revalidatePath('/archives');
  revalidatePath('/');
  return { success: true };
}
