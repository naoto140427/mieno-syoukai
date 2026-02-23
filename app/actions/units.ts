'use server'

import { createClient } from '@/lib/supabase/server';
import { Unit } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function updateUnit(id: number, data: Partial<Unit>) {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  // Perform update
  const { error } = await supabase
    .from('units')
    .update(data)
    .eq('id', id);

  if (error) {
    console.error('Error updating unit:', error);
    throw new Error('Failed to update unit');
  }

  revalidatePath('/');
  revalidatePath('/units');

  return { success: true };
}
