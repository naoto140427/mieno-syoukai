'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Consumable, Tool } from '@/types/database';

export async function updateConsumableLevel(id: number, delta: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Fetch current level first
  const { data: current, error: fetchError } = await supabase
    .from('consumables')
    .select('level')
    .eq('id', id)
    .single();

  if (fetchError || !current) {
    throw new Error('Item not found');
  }

  let newLevel = current.level + delta;
  if (newLevel > 100) newLevel = 100;
  if (newLevel < 0) newLevel = 0;

  const { error } = await supabase
    .from('consumables')
    .update({ level: newLevel })
    .eq('id', id);

  if (error) {
    console.error('Error updating consumable:', error);
    throw new Error('Failed to update consumable');
  }

  revalidatePath('/');
  revalidatePath('/inventory');
  revalidatePath('/logistics');

  return { success: true, level: newLevel };
}

export async function toggleToolStatus(id: number, currentStatus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const newStatus = currentStatus === 'Available' ? 'In Use' : 'Available';

  const { error } = await supabase
    .from('tools')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    console.error('Error updating tool:', error);
    throw new Error('Failed to update tool');
  }

  revalidatePath('/');
  revalidatePath('/inventory');
  revalidatePath('/logistics');

  return { success: true, status: newStatus };
}

export async function addConsumable(data: Omit<Consumable, 'id'>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase
      .from('consumables')
      .insert(data);

    if (error) {
      console.error('Error adding consumable:', error);
      throw new Error('Failed to add consumable');
    }

    revalidatePath('/');
    revalidatePath('/inventory');
    revalidatePath('/logistics');

    return { success: true };
}

export async function addTool(data: Omit<Tool, 'id'>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase
      .from('tools')
      .insert(data);

    if (error) {
      console.error('Error adding tool:', error);
      throw new Error('Failed to add tool');
    }

    revalidatePath('/');
    revalidatePath('/inventory');
    revalidatePath('/logistics');

    return { success: true };
}
