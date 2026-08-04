-- ai_usage_logs: Gemini API トークン使用量を記録するテーブル
create table if not exists public.ai_usage_logs (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  model text not null default 'gemini-3.6-flash',
  prompt_tokens integer not null default 0,
  completion_tokens integer not null default 0,
  total_tokens integer generated always as (prompt_tokens + completion_tokens) stored,
  unit_id integer references public.units(id) on delete set null
);

-- インデックス（日付集計用）
create index if not exists ai_usage_logs_created_at_idx on public.ai_usage_logs (created_at);
create index if not exists ai_usage_logs_user_id_idx on public.ai_usage_logs (user_id);

-- RLS
alter table public.ai_usage_logs enable row level security;

-- admin/cto/ceo のみ閲覧可能
create policy "Admin can read ai usage logs"
  on public.ai_usage_logs for select
  to authenticated
  using (
    (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'cto', 'ceo')
  );

-- 認証済みユーザーなら誰でも insert 可能 (Chat API でログ記録するため)
create policy "Authenticated can insert ai usage logs"
  on public.ai_usage_logs for insert
  to authenticated
  with check (true);
