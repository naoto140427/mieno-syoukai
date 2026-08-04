const { Client } = require('pg');
const fs = require('fs');

async function main() {
  const client = new Client({
    connectionString: "postgres://postgres.nfcejbkgispqyrtbggnk:0304a0127a0427A@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  
  const sql = fs.readFileSync('supabase/migrations/20260804000000_add_gemini_file_cache.sql', 'utf8');
  await client.query(sql);
  console.log("Migration applied successfully!");
  
  await client.end();
}
main().catch(console.error);
