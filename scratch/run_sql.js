const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgres://postgres.nfcejbkgispqyrtbggnk:0304a0127a0427A@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  
  // Create status column if not exists
  await client.query(`
    ALTER TABLE news 
    ADD COLUMN IF NOT EXISTS status text DEFAULT 'PUBLISHED' NOT NULL;
  `);
  
  const res = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'news';
  `);
  console.log(res.rows);
  
  await client.end();
}
main().catch(console.error);
