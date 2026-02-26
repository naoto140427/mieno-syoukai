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
        logs:maintenance_logs(id, title, type:log_type, date, details, cost)
      `)
      .ilike('slug', safeSlug)
      .single();

    if (error || !data) {
      return null;
    }

    // Process the data to ensure arrays and default values
    const processedUnit: Unit = {
      ...data,
      specs: Array.isArray(data.specs) ? data.specs : [], // Ensure specs is an array
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

export async function addMaintenanceLog(unitId: number, data: { date: string, type: string, description: string, cost: number }) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('maintenance_logs')
    .insert({
      unit_id: unitId,
      date: data.date,
      log_type: data.type,
      title: data.description,
      details: data.description,
      cost: data.cost
    });

  if (error) {
    console.error('Error adding maintenance log:', error);
    throw new Error('Failed to add maintenance log');
  }

  // Fetch slug for revalidation
  const { data: unit } = await supabase.from('units').select('slug').eq('id', unitId).single();
  if (unit) {
    revalidatePath(`/units/${unit.slug}`);
  }

  return { success: true };
}

export async function deleteMaintenanceLog(logId: number) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  // Get unit id/slug before deletion for revalidation
  const { data: log } = await supabase.from('maintenance_logs').select('unit_id').eq('id', logId).single();

  const { error } = await supabase
    .from('maintenance_logs')
    .delete()
    .eq('id', logId);

  if (error) {
    console.error('Error deleting maintenance log:', error);
    throw new Error('Failed to delete maintenance log');
  }

  if (log) {
     const { data: unit } = await supabase.from('units').select('slug').eq('id', log.unit_id).single();
     if (unit) {
       revalidatePath(`/units/${unit.slug}`);
     }
  }

  return { success: true };
}
