const { Client } = require('pg');
async function main() {
  const client = new Client({
    connectionString: "postgres://postgres:0304a0127a0427A@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?options=reference%3Dnfcejbkgispqyrtbggnk&sslmode=require&pgbouncer=true"
  });
  await client.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS line_webhook_logs (
        id SERIAL PRIMARY KEY,
        payload JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("Table created.");
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
main();
