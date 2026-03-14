'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Archive } from '@/types/database';

export async function addArchive(data: Omit<Archive, 'id'>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // The 'data' object now includes new tactical fields:
  // distance_km, max_speed, max_elevation, route_data, location_name
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

  revalidatePath('/archives');
  revalidatePath('/');
  return { success: true };
}

export async function getArchiveById(id: number) {
  const supabase = await createClient();

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
}
