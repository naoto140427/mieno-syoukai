import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Supabase セッション自動リフレッシュ Middleware
 *
 * [MIENO CORP. DOCTRINE]
 * このミドルウェアはすべてのリクエストに対してSupabaseセッションの
 * リフレッシュを実行する。これにより、クライアントとサーバー間の
 * 認証状態の断絶（突然の403エラー）を防ぐ。
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // まずリクエストにCookieをセット
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // 新しいレスポンスを作り直してCookieを引き継ぐ
          supabaseResponse = NextResponse.next({
            request,
          })
          // レスポンスにもCookieをセット（これがブラウザへ送られる）
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 重要: getUser() を呼び出すことでトークンの期限チェックと
  // リフレッシュが実行される。結果は使わなくてOK。
  // 絶対に削除しないこと。
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * 以下のパスを除く全リクエストにマッチさせる:
     * - _next/static (静的アセット)
     * - _next/image (画像最適化)
     * - favicon.ico, sitemap.xml, robots.txt
     * - 画像ファイル拡張子
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
