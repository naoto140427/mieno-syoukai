import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // ログイン後に飛ばしたいURL（指定がなければ /admin へ）
  const next = requestUrl.searchParams.get('next') ?? '/admin'

  if (code) {
    const supabase = await createClient()
    // 💡 ここが超重要：URLの引換券(code)を、本物のセッション(Cookie)に交換！
    await supabase.auth.exchangeCodeForSession(code)
  }

  // 認証が完了したら、システム内部（/admin 等）へ強制リダイレクト
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}