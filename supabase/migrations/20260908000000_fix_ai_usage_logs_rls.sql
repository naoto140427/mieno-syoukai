-- ============================================================================
-- ai_usage_logs の RLS を user_metadata 依存から agents.role 参照へ修正
--
-- 背景: Supabase Advisor の ERROR 指摘
--   ポリシー "Admin can read ai usage logs" が auth.jwt() -> user_metadata -> role
--   を参照していた。user_metadata はユーザー自身が書き換え可能なため、
--   権限判定に使うと管理者になりすませる。
--
-- あわせて、anon / authenticated から /rest/v1/rpc 経由で実行できてしまっていた
-- SECURITY DEFINER 関数 rls_auto_enable() の EXECUTE 権限を剥奪する。
-- ============================================================================

-- 呼び出し元自身が管理者ロールを持つかを判定する。
-- SECURITY DEFINER だが auth.uid() 固定で自分の行しか見ないため安全。
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.agents a
    where a.id = auth.uid()
      and lower(a.role) in ('cto', 'ceo', 'cmo', 'admin')
  );
$$;

revoke execute on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Admin can read ai usage logs" on public.ai_usage_logs;

create policy "Admin can read ai usage logs"
  on public.ai_usage_logs
  for select
  to authenticated
  using (public.is_admin());

-- SECURITY DEFINER 関数の公開実行を止める
do $$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'rls_auto_enable'
  ) then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end $$;
