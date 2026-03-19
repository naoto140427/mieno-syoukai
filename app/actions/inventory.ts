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

export async function createInventoryRequest(toolId: number, startDate: string, endDate: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('inventory_requests')
        .insert({
            tool_id: toolId,
            agent_id: user.id,
            start_date: startDate,
            end_date: endDate,
            status: 'PENDING'
        });

    if (error) {
        console.error('Error creating inventory request:', error);
        throw new Error('Failed to create request');
    }

    revalidatePath('/inventory');
    revalidatePath('/agent');

    return { success: true };
}

export async function approveInventoryRequest(requestId: number, toolId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // Check Admin role
    const { data: profile } = await supabase.from('agents').select('role').eq('id', user.id).single();
    if (!profile || (profile.role !== 'CTO' && profile.role !== 'Admin' && profile.role !== 'admin' && profile.role !== 'ADMIN')) {
        throw new Error('Forbidden: Admin access required');
    }

    // Update request status
    const { error: requestError } = await supabase
        .from('inventory_requests')
        .update({ status: 'APPROVED' })
        .eq('id', requestId);

    if (requestError) throw new Error('Failed to approve request');

    // Update tool status to In Use
    const { error: toolError } = await supabase
        .from('tools')
        .update({ status: 'In Use' })
        .eq('id', toolId);

    if (toolError) throw new Error('Failed to update tool status');

    revalidatePath('/inventory');
    revalidatePath('/agent');
    revalidatePath('/admin');

    return { success: true };
}

export async function returnInventoryRequest(requestId: number, toolId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // Check Admin role
    const { data: profile } = await supabase.from('agents').select('role').eq('id', user.id).single();
    if (!profile || (profile.role !== 'CTO' && profile.role !== 'Admin' && profile.role !== 'admin' && profile.role !== 'ADMIN')) {
        throw new Error('Forbidden: Admin access required');
    }

    // Update request status
    const { error: requestError } = await supabase
        .from('inventory_requests')
        .update({ status: 'RETURNED' })
        .eq('id', requestId);

    if (requestError) throw new Error('Failed to return request');

    // Update tool status to Available
    const { error: toolError } = await supabase
        .from('tools')
        .update({ status: 'Available' })
        .eq('id', toolId);

    if (toolError) throw new Error('Failed to update tool status');

    revalidatePath('/inventory');
    revalidatePath('/agent');
    revalidatePath('/admin');

    return { success: true };
}
