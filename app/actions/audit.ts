'use server'

import { createClient } from '@/lib/supabase/server';
export async function logAuditAction(action: string, target_table?: string, target_id?: string, details?: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase.from('audit_logs').insert({
    action,
    target_table,
    target_id,
    user_id: user.id,
    details
  });

  if (error) {
    console.error('Audit log error:', error);
  }
}

export async function logLogin() {
  await logAuditAction('USER_LOGIN', 'users');
}

export async function getAuditLogs(limitCount = 50) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('audit_logs')
    .select(`
      *,
      users:user_id (
        email
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limitCount);

  if (error) {
    console.error('Failed to fetch audit logs:', error);
    return [];
  }

  // Next.jsのキャッシュ機能を使用しない場合は直接返す
  return data || [];
}
