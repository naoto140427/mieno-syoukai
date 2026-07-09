-- Create a test user for Preview/E2E testing
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if user exists
  SELECT id INTO new_user_id FROM auth.users WHERE email = 'preview-agent@mieno-shokai.com' LIMIT 1;

  -- Insert if not exists
  IF new_user_id IS NULL THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      'preview-agent@mieno-shokai.com',
      crypt('AgentTestPass2026!', gen_salt('bf')),
      now(),
      null,
      null,
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  END IF;

  -- Insert into public.agents
  INSERT INTO public.agents (id, email, role, codename)
  VALUES (new_user_id, 'preview-agent@mieno-shokai.com', 'Developer', 'PreviewAgent')
  ON CONFLICT (id) DO NOTHING;

END $$;
