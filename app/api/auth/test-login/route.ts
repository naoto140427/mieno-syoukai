import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  // 開発環境またはプレビュー環境（特定のメールアドレス等）でのみ許可
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
  }

  // プレビューテスト用の特定のメールアドレスのみ許可する安全策
  if (email !== 'preview-agent@mieno-shokai.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  // createServerClient internally sets the cookies on the response
  // BUT we need to ensure the cookies set by supabase are passed down.
  // Actually, Next.js 'cookies().set' is used inside createServerClient.
  // So returning a normal NextResponse is enough, the headers are merged by Next.js automatically.
  return NextResponse.json({ success: true, user: data.user });
}
