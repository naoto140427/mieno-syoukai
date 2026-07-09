const { createClient } = require('@supabase/supabase-js');

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nfcejbkgispqyrtbggnk.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // I'll run this using npx load-env
  
  if (!supabaseKey) {
      console.log('No key');
      return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase.from('agents').select('*').eq('email', 'naoto150127@gmail.com');
  console.log(data, error);
}

main();
