import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Skip supabase auth checks entirely for public routes to ensure ZERO LATENCY
  // Only perform these checks for routes that explicitly need protection via proxy
  if (!request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/agent')) {
      return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Route protection
  // If accessing /admin sub-routes (e.g. /admin/dashboard) without auth, redirect to /admin (login)
  // We allow /admin itself so the login form can be shown.
  if (request.nextUrl.pathname.startsWith('/admin/') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  // Protect /agent route
  if (request.nextUrl.pathname.startsWith('/agent')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }

    // Strict role check
    const { data: agentProfile, error } = await supabase
      .from('agents')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error || !agentProfile) {
      // Not an agent, redirect to home or unauthorized
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match only the protected routes to prevent running the proxy on public pages.
     */
    '/admin/:path*',
    '/agent/:path*',
  ],
}
