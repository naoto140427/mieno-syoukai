-- ============================================================
-- Migration: Enable RLS on all public tables
-- Date: 2026-07-09
-- Purpose: セキュリティホール修正 - 全テーブルにRLSを有効化し
--          適切なアクセスポリシーを設定する
-- ============================================================

-- ─────────────────────────────────────────
-- news テーブル
-- 読み取り: 全員（公開コンテンツのため）
-- 書き込み: 認証済みユーザーのみ（管理画面から操作）
-- ─────────────────────────────────────────
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "news_select_public"
  ON public.news FOR SELECT
  USING (true);

CREATE POLICY "news_insert_authenticated"
  ON public.news FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "news_update_authenticated"
  ON public.news FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "news_delete_authenticated"
  ON public.news FOR DELETE
  TO authenticated
  USING (true);

-- ─────────────────────────────────────────
-- archives テーブル（ミッションログ）
-- 読み取り: 全員
-- 書き込み: 認証済みユーザーのみ
-- ─────────────────────────────────────────
ALTER TABLE public.archives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "archives_select_public"
  ON public.archives FOR SELECT
  USING (true);

CREATE POLICY "archives_insert_authenticated"
  ON public.archives FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "archives_update_authenticated"
  ON public.archives FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "archives_delete_authenticated"
  ON public.archives FOR DELETE
  TO authenticated
  USING (true);

-- ─────────────────────────────────────────
-- units テーブル（戦略ユニット/バイク）
-- 読み取り: 全員（公開ページで使用）
-- 書き込み: 認証済みユーザーのみ
-- ─────────────────────────────────────────
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "units_select_public"
  ON public.units FOR SELECT
  USING (true);

CREATE POLICY "units_insert_authenticated"
  ON public.units FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "units_update_authenticated"
  ON public.units FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "units_delete_authenticated"
  ON public.units FOR DELETE
  TO authenticated
  USING (true);

-- ─────────────────────────────────────────
-- inquiries テーブル（お問い合わせ）
-- 読み取り: 認証済みユーザーのみ（個人情報保護）
-- 書き込み（INSERT）: 全員（フォーム送信）
-- 更新/削除: 認証済みユーザーのみ
-- ─────────────────────────────────────────
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inquiries_select_authenticated"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "inquiries_insert_public"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "inquiries_update_authenticated"
  ON public.inquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "inquiries_delete_authenticated"
  ON public.inquiries FOR DELETE
  TO authenticated
  USING (true);

-- ─────────────────────────────────────────
-- consumables テーブル（消耗品管理）
-- 読み取り: 認証済みユーザーのみ（内部管理情報）
-- 書き込み: 認証済みユーザーのみ
-- ─────────────────────────────────────────
ALTER TABLE public.consumables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consumables_authenticated"
  ON public.consumables FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────
-- tools テーブル（工具管理）
-- 読み取り: 認証済みユーザーのみ（内部管理情報）
-- 書き込み: 認証済みユーザーのみ
-- ─────────────────────────────────────────
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tools_authenticated"
  ON public.tools FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────
-- ir_metrics テーブル
-- 読み取り: 全員
-- 書き込み: 認証済みユーザーのみ
-- ─────────────────────────────────────────
ALTER TABLE public.ir_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ir_metrics_select_public"
  ON public.ir_metrics FOR SELECT
  USING (true);

CREATE POLICY "ir_metrics_write_authenticated"
  ON public.ir_metrics FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────
-- agents テーブル（メンバー情報）
-- 読み取り: 全員（公開プロフィール）
-- 書き込み: 認証済みユーザーのみ（自分のプロフィールのみ）
-- ─────────────────────────────────────────
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agents_select_public"
  ON public.agents FOR SELECT
  USING (true);

CREATE POLICY "agents_insert_authenticated"
  ON public.agents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "agents_update_own"
  ON public.agents FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
