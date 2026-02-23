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

  const { error } = await supabase
    .from('archives')
    .insert(data);

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
