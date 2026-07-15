const { Client } = require('pg');
async function main() {
  const client = new Client({
    connectionString: "postgres://postgres.nfcejbkgispqyrtbggnk:0304a0127a0427A@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  
  await client.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      action TEXT NOT NULL,
      target_table TEXT,
      target_id TEXT,
      user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      details JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  
  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'audit_logs';
  `);
  console.log('Tables found:', res.rows);
  
  await client.end();
}
main().catch(console.error);
