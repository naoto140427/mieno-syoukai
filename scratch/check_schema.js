const { Client } = require('pg');
async function main() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'surveys';");
  console.log(res.rows);
  await client.end();
}
main();
