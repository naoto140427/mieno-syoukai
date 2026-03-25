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
