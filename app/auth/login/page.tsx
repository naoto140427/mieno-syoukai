import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'

export const metadata = {
  title: 'Agent Login | MIENO CORP.',
  description: 'MIENO CORP. Secure Access Portal',
}

export default async function LoginPage() {
  const supabase = await createClient()

  // セッションの確認
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 既にログイン済みの場合は /agent へリダイレクト
  if (user) {
    redirect('/agent')
  }

  // 未ログインの場合はログインフォームを表示
  return <LoginForm />
}
