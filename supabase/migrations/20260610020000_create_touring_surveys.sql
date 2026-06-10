-- touring_surveys テーブル作成
-- RSVPモニターおよびツーリング参加意向調査に使用

create table if not exists public.touring_surveys (
  id          uuid primary key default gen_random_uuid(),
  news_id     text not null,
  agent_name  text not null,
  attendance_status text not null check (attendance_status in ('JOIN', 'PENDING', 'DECLINE')),
  vehicle_info      text,
  message           text,
  created_at        timestamptz not null default now(),

  -- 同一エージェントが同一ニュースに複数回投票できない
  unique (news_id, agent_name)
);

-- news テーブルとの外部キー（任意参照）
-- news テーブルの id が integer の場合は news_id を text で保持してコード側でキャスト済み

-- RLS
alter table public.touring_surveys enable row level security;

-- 認証済みユーザーは自分のレコードのみ読み書き可能
create policy "Agent can read own surveys"
  on public.touring_surveys for select
  to authenticated
  using (true);

create policy "Agent can insert own survey"
  on public.touring_surveys for insert
  to authenticated
  with check (true);

create policy "Agent can update own survey"
  on public.touring_surveys for update
  to authenticated
  using (true);

create policy "Agent can delete own survey"
  on public.touring_surveys for delete
  to authenticated
  using (true);
