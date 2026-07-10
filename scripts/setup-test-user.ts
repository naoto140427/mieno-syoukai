import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function setupTestUser() {
  const email = 'naoto150127@gmail.com';
  const password = '0304a0127A';

  console.log(`Setting up test user: ${email}`);

  // Try to create the user
  const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    if (createError.message.includes('already exists') || createError.message.includes('already registered')) {
      console.log('User exists. Updating password...');
      // Get the user ID first
      const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) {
        console.error('Failed to list users:', listError);
        return;
      }
      
      const existingUser = users.users.find(u => u.email === email);
      if (existingUser) {
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          existingUser.id,
          { password }
        );
        if (updateError) {
          console.error('Failed to update password:', updateError);
        } else {
          console.log('Password updated successfully!');
        }
      } else {
        console.error('User not found in list despite existing error?');
      }
    } else {
      console.error('Failed to create user:', createError);
    }
  } else {
    console.log('User created successfully:', user);
  }
}

setupTestUser().catch(console.error);
