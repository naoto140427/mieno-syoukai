'use server'

import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { Unit, UnitDocument } from '@/types/database';

// ─────────────────────────────────────────────────────────────
// PUBLIC READ FUNCTIONS (Zero-Latency / Edge Cached)
// ─────────────────────────────────────────────────────────────

export const getUnits = unstable_cache(
  async (): Promise<Unit[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('units')
      .select('*');

    if (error) {
      console.error('Error fetching units:', error);
      return [];
    }

    return (data as unknown as Unit[]) || [];
  },
  ['units-list'],
  { tags: ['units'], revalidate: false }
);

export const getUnitBySlug = unstable_cache(
  async (slug: string): Promise<Unit | null> => {
    const supabase = createPublicClient();
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

      const processedUnit: Unit = {
        ...data,
        specs: Array.isArray(data.specs) ? data.specs : [],
        docs: Array.isArray(data.docs)
          ? (data.docs as (Omit<UnitDocument, 'size' | 'date'> & { date: string | null })[]).map((doc) => ({
              ...doc,
              date: doc.date || '',
              size: '-'
            }))
          : [],
        logs: Array.isArray(data.logs) ? data.logs : [],
      } as unknown as Unit;

      return processedUnit;
    } catch (error) {
      console.error('Error fetching unit:', error);
      return null;
    }
  },
  ['unit-by-slug'],
  { tags: ['units'], revalidate: false }
);

// ─────────────────────────────────────────────────────────────
// WRITE FUNCTIONS (Admin Only / RLS Protected)
// ─────────────────────────────────────────────────────────────

export async function updateUnit(id: number, data: Partial<Unit>) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('units')
    .update(data)
    .eq('id', id);

  if (error) {
    console.error('Error updating unit:', error);
    throw new Error('Failed to update unit');
  }

  // オンデマンドキャッシュパージ（ユニット全体 + 個別slug）
  revalidateTag('units', 'default');
  revalidatePath('/');
  revalidatePath('/units');
  if (data.slug) {
    revalidatePath(`/units/${data.slug}`);
  }

  return { success: true };
}

export async function addMaintenanceLog(
  unitId: number,
  data: { date: string; type: string; description: string; cost: number; distance_km?: number }
) {
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
      cost: data.cost,
    });

  if (error) {
    console.error('Error adding maintenance log:', error);
    throw new Error('Failed to add maintenance log');
  }

  // ── 走行距離が指定された場合、odometerを加算 ──────────────────
  if (data.distance_km && data.distance_km > 0) {
    // 現在のodometerを取得してから加算（アトミックではないがRLSを通す安全な方法）
    const { data: currentUnit } = await supabase
      .from('units')
      .select('odometer, slug')
      .eq('id', unitId)
      .single();

    if (currentUnit) {
      const newOdometer = (currentUnit.odometer ?? 0) + data.distance_km;
      await supabase
        .from('units')
        .update({ odometer: newOdometer })
        .eq('id', unitId);
    }
  }

  // キャッシュパージ
  const { data: unit } = await supabase.from('units').select('slug').eq('id', unitId).single();
  revalidateTag('units', 'default');
  revalidatePath('/logistics');
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

  const { data: log } = await supabase
    .from('maintenance_logs')
    .select('unit_id')
    .eq('id', logId)
    .single();

  const { error } = await supabase
    .from('maintenance_logs')
    .delete()
    .eq('id', logId);

  if (error) {
    console.error('Error deleting maintenance log:', error);
    throw new Error('Failed to delete maintenance log');
  }

  // キャッシュパージ
  revalidateTag('units', 'default');
  if (log) {
    const { data: unit } = await supabase.from('units').select('slug').eq('id', log.unit_id).single();
    if (unit) {
      revalidatePath(`/units/${unit.slug}`);
    }
  }

  return { success: true };
}
