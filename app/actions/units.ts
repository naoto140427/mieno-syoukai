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
      .select(`
        *,
        docs:unit_documents(id, title, type:document_type, date:created_at, url:file_url),
        logs:maintenance_logs(id, title, type:log_type, date, details)
      `)
      .ilike('slug', safeSlug)
      .single();

    if (error || !data) {
      return null;
    }

    // Process the data to ensure arrays and default values
    // Note: data.docs and data.logs come from the query aliases
    const processedUnit: Unit = {
      ...data,
      specs: data.specs || {},
      docs: Array.isArray(data.docs)
        ? data.docs.map((doc: any) => ({
            ...doc,
            size: '-' // Default size since DB does not store it
          }))
        : [],
      logs: Array.isArray(data.logs) ? data.logs : [],
    } as unknown as Unit;

    return processedUnit;
  } catch (error) {
    console.error('Error fetching unit:', error);
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
  if (data.slug) {
    revalidatePath(`/units/${data.slug}`);
  }

  return { success: true };
}
