const { Client } = require('pg');
async function main() {
  const client = new Client({
    connectionString: "postgres://postgres.nfcejbkgispqyrtbggnk:0304a0127a0427A@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  
  await client.query(`
    ALTER TABLE news ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PUBLISHED';
  `);
  
  console.log('Added status column successfully');
  await client.end();
}
main().catch(console.error);
