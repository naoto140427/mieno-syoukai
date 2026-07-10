'use server'

import { createClient } from '@/lib/supabase/server';
import { createPublicClient } from '@/lib/supabase/public';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { Unit } from '@/types/database';

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const STORAGE_BUCKET = 'unit-documents';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
  'text/csv',
];

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const STORAGE_BUCKET = 'unit-documents';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
  'text/csv',
];

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
          ? (data.docs as UnitDocument[]).map((doc) => ({
              ...doc,
              // Legacy compat aliases for UnitDetailClient.tsx
              type: doc.document_type ?? doc.type ?? 'OTHER',
              date: doc.created_at ?? doc.date ?? '',
              size: doc.file_size ? `${(doc.file_size / (1024 * 1024)).toFixed(1)} MB` : (doc.size ?? '-'),
              url: doc.file_url ?? doc.url ?? '',
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

// ─────────────────────────────────────────────────────────────
// DOCUMENT MANAGEMENT (Admin Only)
// ─────────────────────────────────────────────────────────────

/**
 * マニュアル・書類をSupabase Storageにアップロードし、unit_documentsにレコードを追加する
 */
export async function uploadUnitDocument(formData: FormData): Promise<{
  success: boolean;
  error?: string;
  doc?: { id: number; title: string; file_url: string; document_type: string; file_name: string; file_size: number; created_at: string };
}> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  const file = formData.get('file') as File | null;
  const unitId = formData.get('unitId') as string;
  const title = formData.get('title') as string;
  const documentType = formData.get('documentType') as string || 'OTHER';
  const unitSlug = formData.get('unitSlug') as string;

  if (!file || !unitId || !title) {
    return { success: false, error: '必要な情報が不足しています' };
  }

  // バリデーション
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: 'ファイルサイズが50MBを超えています' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { success: false, error: 'このファイル形式はサポートされていません' };
  }

  // Storage パスを生成 (unit_id/timestamp_filename)
  const timestamp = Date.now();
  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${unitId}/${timestamp}_${safeFileName}`;

  // ファイルをArrayBufferに変換してアップロード
  const arrayBuffer = await file.arrayBuffer();
  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (storageError) {
    console.error('Storage upload error:', storageError);
    return { success: false, error: `アップロードに失敗しました: ${storageError.message}` };
  }

  // Public URLを取得
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  // DBにレコードを追加
  const { data: doc, error: dbError } = await supabase
    .from('unit_documents')
    .insert({
      unit_id: Number(unitId),
      title,
      document_type: documentType,
      file_url: publicUrl,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      storage_path: storagePath,
      uploaded_by: user.id,
    })
    .select('id, title, file_url, document_type, file_name, file_size, created_at')
    .single();

  if (dbError) {
    // DBに失敗した場合はStorageからも削除（ロールバック）
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
    console.error('DB insert error:', dbError);
    return { success: false, error: 'データベースへの保存に失敗しました' };
  }

  // キャッシュパージ
  revalidateTag('units', 'default');
  if (unitSlug) {
    revalidatePath(`/units/${unitSlug}`);
  }

  return { success: true, doc: doc as { id: number; title: string; file_url: string; document_type: string; file_name: string; file_size: number; created_at: string } };
}

/**
 * 書類をDBとStorageの両方から削除する
 */
export async function deleteUnitDocument(
  docId: number,
  storagePath: string,
  unitSlug: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  // DBから削除
  const { error: dbError } = await supabase
    .from('unit_documents')
    .delete()
    .eq('id', docId);

  if (dbError) {
    console.error('Error deleting unit document from DB:', dbError);
    return { success: false, error: 'データベースからの削除に失敗しました' };
  }

  // Storageから削除 (DBが成功した場合のみ)
  if (storagePath) {
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);

    if (storageError) {
      // Storageの削除失敗はログするが、DBは既に削除済みなのでエラーとしない
      console.error('Storage delete error (non-critical):', storageError);
    }
  }

  // キャッシュパージ
  revalidateTag('units', 'default');
  revalidatePath(`/units/${unitSlug}`);

  return { success: true };
}
