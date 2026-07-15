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
 * 旧 proxy.ts の機能（/admin サブルート・/agent ルートの保護）も統合済み。
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
  // リフレッシュが実行される。これが認証安定化の核心。
  // 絶対に削除しないこと。
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ─── ルート保護 ────────────────────────────────────────────
  // /admin/xxx (サブルート) に未ログインでアクセスした場合 → /admin へリダイレクト
  // /admin 自体はログインフォームを表示するため許可する
  if (request.nextUrl.pathname.startsWith('/admin/') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  // /agent ルートは認証必須
  if (request.nextUrl.pathname.startsWith('/agent') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

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
     * - monitoring (Sentryトンネル)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|monitoring|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
