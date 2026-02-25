'use server'

import { createClient } from '@/lib/supabase/server';
import { Unit, UnitDocument, MaintenanceLog } from '@/types/database';
import { revalidatePath } from 'next/cache';

// --- Unit Operations ---

export async function getUnitBySlug(slug: string) {
  const supabase = await createClient();

  const { data: unit, error: unitError } = await supabase
    .from('units')
    .select('*')
    .eq('slug', slug)
    .single();

  if (unitError || !unit) {
    console.error('Error fetching unit:', unitError);
    return null;
  }

  const { data: docs, error: docsError } = await supabase
    .from('unit_documents')
    .select('*')
    .eq('unit_id', unit.id)
    .order('created_at', { ascending: false });

  if (docsError) {
    console.error('Error fetching docs:', docsError);
  }

  const { data: logs, error: logsError } = await supabase
    .from('maintenance_logs')
    .select('*')
    .eq('unit_id', unit.id)
    .order('date', { ascending: false });

  if (logsError) {
    console.error('Error fetching logs:', logsError);
  }

  return {
    ...unit,
    docs: docs || [],
    logs: logs || [],
  };
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

  revalidatePath('/units');
  if (data.slug) {
    revalidatePath(`/units/${data.slug}`);
  }

  return { success: true };
}

// --- Maintenance Log Operations ---

export async function addMaintenanceLog(log: Omit<MaintenanceLog, 'id' | 'created_at'>) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('maintenance_logs')
    .insert([log]);

  if (error) {
    console.error('Error adding log:', error);
    throw new Error('Failed to add log');
  }

  revalidatePath('/units');
  return { success: true };
}

export async function updateMaintenanceLog(id: number, log: Partial<MaintenanceLog>) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('maintenance_logs')
    .update(log)
    .eq('id', id);

  if (error) {
    console.error('Error updating log:', error);
    throw new Error('Failed to update log');
  }

  revalidatePath('/units');
  return { success: true };
}

export async function deleteMaintenanceLog(id: number) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('maintenance_logs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting log:', error);
    throw new Error('Failed to delete log');
  }

  revalidatePath('/units');
  return { success: true };
}

// --- Document Operations ---

export async function addUnitDocument(doc: Omit<UnitDocument, 'id' | 'created_at'>) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('unit_documents')
    .insert([doc]);

  if (error) {
    console.error('Error adding document:', error);
    throw new Error('Failed to add document');
  }

  revalidatePath('/units');
  return { success: true };
}

export async function deleteUnitDocument(id: number) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('unit_documents')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting document:', error);
    throw new Error('Failed to delete document');
  }

  revalidatePath('/units');
  return { success: true };
}
