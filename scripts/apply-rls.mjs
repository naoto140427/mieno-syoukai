// RLS適用スクリプト - Supabase REST API経由でマイグレーションを実行
// Usage: node scripts/apply-rls.mjs

const SUPABASE_URL = 'https://nfcejbkgispqyrtbggnk.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mY2VqYmtnaXNwcXlydGJnZ25rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTE2NDMyMCwiZXhwIjoyMDg2NzQwMzIwfQ.7NH2Z7L-J4zR23GV8u_RKVCDKMiTqh-FRndRXlKBYvI';

// 実行するSQL文（順番が重要）
const migrations = [
  // news
  `ALTER TABLE public.news ENABLE ROW LEVEL SECURITY`,
  `CREATE POLICY "news_select_public" ON public.news FOR SELECT USING (true)`,
  `CREATE POLICY "news_insert_authenticated" ON public.news FOR INSERT TO authenticated WITH CHECK (true)`,
  `CREATE POLICY "news_update_authenticated" ON public.news FOR UPDATE TO authenticated USING (true) WITH CHECK (true)`,
  `CREATE POLICY "news_delete_authenticated" ON public.news FOR DELETE TO authenticated USING (true)`,

  // archives
  `ALTER TABLE public.archives ENABLE ROW LEVEL SECURITY`,
  `CREATE POLICY "archives_select_public" ON public.archives FOR SELECT USING (true)`,
  `CREATE POLICY "archives_insert_authenticated" ON public.archives FOR INSERT TO authenticated WITH CHECK (true)`,
  `CREATE POLICY "archives_update_authenticated" ON public.archives FOR UPDATE TO authenticated USING (true) WITH CHECK (true)`,
  `CREATE POLICY "archives_delete_authenticated" ON public.archives FOR DELETE TO authenticated USING (true)`,

  // units
  `ALTER TABLE public.units ENABLE ROW LEVEL SECURITY`,
  `CREATE POLICY "units_select_public" ON public.units FOR SELECT USING (true)`,
  `CREATE POLICY "units_insert_authenticated" ON public.units FOR INSERT TO authenticated WITH CHECK (true)`,
  `CREATE POLICY "units_update_authenticated" ON public.units FOR UPDATE TO authenticated USING (true) WITH CHECK (true)`,
  `CREATE POLICY "units_delete_authenticated" ON public.units FOR DELETE TO authenticated USING (true)`,

  // inquiries（お問い合わせは個人情報含むので書き込みも制限）
  `ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY`,
  `CREATE POLICY "inquiries_select_authenticated" ON public.inquiries FOR SELECT TO authenticated USING (true)`,
  `CREATE POLICY "inquiries_insert_public" ON public.inquiries FOR INSERT WITH CHECK (true)`,
  `CREATE POLICY "inquiries_update_authenticated" ON public.inquiries FOR UPDATE TO authenticated USING (true) WITH CHECK (true)`,
  `CREATE POLICY "inquiries_delete_authenticated" ON public.inquiries FOR DELETE TO authenticated USING (true)`,

  // consumables
  `ALTER TABLE public.consumables ENABLE ROW LEVEL SECURITY`,
  `CREATE POLICY "consumables_authenticated" ON public.consumables FOR ALL TO authenticated USING (true) WITH CHECK (true)`,

  // tools
  `ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY`,
  `CREATE POLICY "tools_authenticated" ON public.tools FOR ALL TO authenticated USING (true) WITH CHECK (true)`,

  // ir_metrics
  `ALTER TABLE public.ir_metrics ENABLE ROW LEVEL SECURITY`,
  `CREATE POLICY "ir_metrics_select_public" ON public.ir_metrics FOR SELECT USING (true)`,
  `CREATE POLICY "ir_metrics_write_authenticated" ON public.ir_metrics FOR INSERT TO authenticated WITH CHECK (true)`,
  `CREATE POLICY "ir_metrics_update_authenticated" ON public.ir_metrics FOR UPDATE TO authenticated USING (true) WITH CHECK (true)`,
  `CREATE POLICY "ir_metrics_delete_authenticated" ON public.ir_metrics FOR DELETE TO authenticated USING (true)`,

  // agents（メンバー情報）
  `ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY`,
  `CREATE POLICY "agents_select_public" ON public.agents FOR SELECT USING (true)`,
  `CREATE POLICY "agents_insert_own" ON public.agents FOR INSERT TO authenticated WITH CHECK (auth.uid() = id)`,
  `CREATE POLICY "agents_update_own" ON public.agents FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id)`,
];

async function executeSQL(sql) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });

  // Supabase REST API doesn't expose raw SQL — use the pg endpoint instead
  const pgResponse = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!pgResponse.ok) {
    const text = await pgResponse.text();
    throw new Error(`Failed (${pgResponse.status}): ${text}`);
  }
  return pgResponse.json();
}

// Supabase Management API経由でSQLを実行
async function executeSQLViaManagementAPI(sql) {
  const projectRef = 'nfcejbkgispqyrtbggnk';
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });

  const text = await response.text();
  return { status: response.status, body: text };
}

async function main() {
  console.log('🔒 Starting RLS migration via Supabase...\n');

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const sql of migrations) {
    const preview = sql.substring(0, 60) + '...';
    try {
      const result = await executeSQLViaManagementAPI(sql);
      if (result.status === 200 || result.status === 201) {
        console.log(`✅ ${preview}`);
        success++;
      } else if (result.body.includes('already exists') || result.body.includes('duplicate')) {
        console.log(`⏭️  SKIP (already exists): ${preview}`);
        skipped++;
      } else {
        console.log(`❌ FAIL (${result.status}): ${preview}`);
        console.log(`   Response: ${result.body.substring(0, 200)}`);
        failed++;
      }
    } catch (e) {
      console.log(`❌ ERROR: ${preview}\n   ${e.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ✅${success} success, ⏭️${skipped} skipped, ❌${failed} failed`);
}

main();
