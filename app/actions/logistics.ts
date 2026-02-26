'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Consumable, Tool } from '@/types/database';

export async function getConsumables() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('consumables')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching consumables:', error);
    return [];
  }

  return data as Consumable[];
}

export async function getTools() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching tools:', error);
    return [];
  }

  return data as Tool[];
}

export async function updateConsumableQuantity(id: number, quantity: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('consumables')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating consumable quantity:', error);
    throw new Error('Failed to update consumable quantity');
  }

  revalidatePath('/logistics');
  return { success: true };
}

export async function updateToolStatus(id: number, status: string, assigned_to: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('tools')
    .update({ status, assigned_to, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating tool status:', error);
    throw new Error('Failed to update tool status');
  }

  revalidatePath('/logistics');
  return { success: true };
}
