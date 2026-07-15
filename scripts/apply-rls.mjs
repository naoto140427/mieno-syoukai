// RLS適用スクリプト - Supabase Management API経由でマイグレーションを実行
// Usage: node scripts/apply-rls.mjs

const PAT = 'process.env.SUPABASE_ACCESS_TOKEN';
const PROJECT_REF = 'nfcejbkgispqyrtbggnk';

// 実行するSQL文
const migrations = [
  // ─── news ───────────────────────────────────────────────────
  `ALTER TABLE public.news ENABLE ROW LEVEL SECURITY`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='news' AND policyname='news_select_public') THEN
      CREATE POLICY "news_select_public" ON public.news FOR SELECT USING (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='news' AND policyname='news_insert_authenticated') THEN
      CREATE POLICY "news_insert_authenticated" ON public.news FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='news' AND policyname='news_update_authenticated') THEN
      CREATE POLICY "news_update_authenticated" ON public.news FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='news' AND policyname='news_delete_authenticated') THEN
      CREATE POLICY "news_delete_authenticated" ON public.news FOR DELETE TO authenticated USING (true);
    END IF;
  END $$`,

  // ─── archives ───────────────────────────────────────────────
  `ALTER TABLE public.archives ENABLE ROW LEVEL SECURITY`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='archives' AND policyname='archives_select_public') THEN
      CREATE POLICY "archives_select_public" ON public.archives FOR SELECT USING (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='archives' AND policyname='archives_insert_authenticated') THEN
      CREATE POLICY "archives_insert_authenticated" ON public.archives FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='archives' AND policyname='archives_update_authenticated') THEN
      CREATE POLICY "archives_update_authenticated" ON public.archives FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='archives' AND policyname='archives_delete_authenticated') THEN
      CREATE POLICY "archives_delete_authenticated" ON public.archives FOR DELETE TO authenticated USING (true);
    END IF;
  END $$`,

  // ─── units ──────────────────────────────────────────────────
  `ALTER TABLE public.units ENABLE ROW LEVEL SECURITY`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='units' AND policyname='units_select_public') THEN
      CREATE POLICY "units_select_public" ON public.units FOR SELECT USING (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='units' AND policyname='units_insert_authenticated') THEN
      CREATE POLICY "units_insert_authenticated" ON public.units FOR INSERT TO authenticated WITH CHECK (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='units' AND policyname='units_update_authenticated') THEN
      CREATE POLICY "units_update_authenticated" ON public.units FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='units' AND policyname='units_delete_authenticated') THEN
      CREATE POLICY "units_delete_authenticated" ON public.units FOR DELETE TO authenticated USING (true);
    END IF;
  END $$`,

  // ─── inquiries（個人情報含む → SELECT は認証必須）─────────────
  `ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='inquiries' AND policyname='inquiries_select_authenticated') THEN
      CREATE POLICY "inquiries_select_authenticated" ON public.inquiries FOR SELECT TO authenticated USING (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='inquiries' AND policyname='inquiries_insert_public') THEN
      CREATE POLICY "inquiries_insert_public" ON public.inquiries FOR INSERT WITH CHECK (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='inquiries' AND policyname='inquiries_update_authenticated') THEN
      CREATE POLICY "inquiries_update_authenticated" ON public.inquiries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='inquiries' AND policyname='inquiries_delete_authenticated') THEN
      CREATE POLICY "inquiries_delete_authenticated" ON public.inquiries FOR DELETE TO authenticated USING (true);
    END IF;
  END $$`,

  // ─── consumables ────────────────────────────────────────────
  `ALTER TABLE public.consumables ENABLE ROW LEVEL SECURITY`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='consumables' AND policyname='consumables_authenticated') THEN
      CREATE POLICY "consumables_authenticated" ON public.consumables FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
  END $$`,

  // ─── tools ──────────────────────────────────────────────────
  `ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='tools' AND policyname='tools_authenticated') THEN
      CREATE POLICY "tools_authenticated" ON public.tools FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
  END $$`,

  // ─── ir_metrics ─────────────────────────────────────────────
  `ALTER TABLE public.ir_metrics ENABLE ROW LEVEL SECURITY`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='ir_metrics' AND policyname='ir_metrics_select_public') THEN
      CREATE POLICY "ir_metrics_select_public" ON public.ir_metrics FOR SELECT USING (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='ir_metrics' AND policyname='ir_metrics_write_authenticated') THEN
      CREATE POLICY "ir_metrics_write_authenticated" ON public.ir_metrics FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
  END $$`,

  // ─── agents（メンバー情報）──────────────────────────────────
  `ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='agents' AND policyname='agents_select_public') THEN
      CREATE POLICY "agents_select_public" ON public.agents FOR SELECT USING (true);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='agents' AND policyname='agents_insert_own') THEN
      CREATE POLICY "agents_insert_own" ON public.agents FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
    END IF;
  END $$`,
  `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='agents' AND policyname='agents_update_own') THEN
      CREATE POLICY "agents_update_own" ON public.agents FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
    END IF;
  END $$`,
];

async function executeSQL(sql) {
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  const text = await response.text();
  return { status: response.status, body: text };
}

async function main() {
  console.log('🔒 RLS Migration starting...\n');
  console.log(`   Project: ${PROJECT_REF}`);
  console.log(`   Tables: news, archives, units, inquiries, consumables, tools, ir_metrics, agents\n`);

  let success = 0;
  let failed = 0;

  for (const sql of migrations) {
    const preview = sql.replace(/\s+/g, ' ').substring(0, 70) + '...';
    try {
      const result = await executeSQL(sql);
      if (result.status === 200 || result.status === 201 || result.status === 204) {
        console.log(`✅ ${preview}`);
        success++;
      } else {
        const body = JSON.parse(result.body);
        // 既にポリシーが存在する場合はスキップ扱い
        if (body?.message?.includes('already exists') || body?.code === '42710') {
          console.log(`⏭️  SKIP: ${preview}`);
          success++;
        } else {
          console.log(`❌ FAIL (${result.status}): ${preview}`);
          console.log(`   → ${result.body.substring(0, 150)}`);
          failed++;
        }
      }
    } catch (e) {
      console.log(`❌ ERROR: ${preview}`);
      console.log(`   → ${e.message}`);
      failed++;
    }
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📊 Results: ✅ ${success} ok  ❌ ${failed} failed`);
  if (failed === 0) {
    console.log('🎉 All RLS policies applied successfully!');
  }
}

main();
