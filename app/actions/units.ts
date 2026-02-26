'use server'

import { createClient } from '@/lib/supabase/server';
import { Unit } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function getUnitBySlug(slug: string): Promise<Unit | null> {
  const supabase = await createClient();
  const safeSlug = slug.trim();

  try {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .ilike('slug', safeSlug)
      .single();

    if (error) {
      // It's normal to return null if not found or error, as per requirements
      return null;
    }

    return data as Unit;
  } catch (error) {
    return null;
  }
}

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
  revalidatePath(`/units/${data.slug}`); // Revalidate specific unit page if slug changed (though unlikely here)

  return { success: true };
}
