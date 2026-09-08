'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function signInWithEmail(prevState: Record<string, unknown>, formData: FormData) {
  const email = formData.get('email')

  if (!email || typeof email !== 'string') {
    return {
      success: false,
      message: '有効なメールアドレスを入力してください。',
    }
  }

  try {
    const supabase = await createClient()
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const redirectUrl = `${protocol}://${host}/auth/callback?next=/agent`

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
        shouldCreateUser: false, // Only existing agents can log in
      },
    })

    if (error) {
      console.error('Supabase auth error:', error)
      return {
        success: false,
        message: '認証リンクの送信に失敗しました。システム管理者にお問い合わせください。',
      }
    }

    return {
      success: true,
      message: '認証リンクを送信しました。受信トレイをご確認ください。',
    }
  } catch (error: unknown) {
    console.error('Auth action error:', error)
    return {
      success: false,
      message: '予期せぬエラーが発生しました。時間をおいて再度お試しください。',
    }
  }
}

/** E2E・プレビュー検証専用のパスワードログイン。本番では使用不可。 */
export async function signInWithTestPassword(prevState: Record<string, unknown>, formData: FormData) {
  // Vercel の本番デプロイのみブロックする。
  // NODE_ENV では `npm run build && npm run start`（Playwright の webServer）も
  // production 扱いになり、ローカル E2E が実行できなくなるため使わない。
  if (process.env.VERCEL_ENV === 'production') {
    return { success: false, message: 'このログイン方法は本番環境では利用できません。' }
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, message: 'メールアドレスとパスワードを入力してください。' }
  }

  // 実在の管理者アカウントは許可しない。追加したい場合は TEST_USER_EMAILS で指定する。
  const allowedTestEmails = (process.env.TEST_USER_EMAILS || 'preview-agent@mieno-shokai.com,test-agent@mieno-shokai.com')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)
  if (!allowedTestEmails.includes(email)) {
    return { success: false, message: 'テストアカウントではありません。' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Test login error:', error)
      return { success: false, message: '認証に失敗しました。パスワードをご確認ください。' }
    }

    return { success: true, message: 'ログイン成功' }
  } catch (error: unknown) {
    console.error('Test auth error:', error)
    return { success: false, message: '予期せぬエラーが発生しました。' }
  }
}
