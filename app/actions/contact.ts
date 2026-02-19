'use server'

import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com';

export async function submitInquiry(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const supabase = await createClient();

  // 1. Validate
  if (!formData.name || !formData.email || !formData.subject || !formData.message) {
    return { success: false, error: 'All fields are required' };
  }

  // 2. Insert into Supabase
  const { error: dbError } = await supabase
    .from('inquiries')
    .insert([
      {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      },
    ]);

  if (dbError) {
    console.error('Supabase Error:', dbError);
    return { success: false, error: 'Failed to save inquiry' };
  }

  // 3. Send Email via Resend
  try {
    const { error: emailError } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: `[三重野商会] 新規お問い合わせ: ${formData.subject}`,
      text: `
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}
Message:
${formData.message}
      `,
    });

    if (emailError) {
      console.error('Resend Error:', emailError);
      // We log the error but return success because the inquiry was saved to the database.
      // In a production environment, we might want to alert the admin via another channel or retry.
    }
  } catch (e) {
     console.error('Resend Exception:', e);
  }

  // 4. Send Auto-reply to User
  try {
    const { error: autoReplyError } = await resend.emails.send({
      from: 'info@mieno-shokai.com',
      to: [formData.email],
      subject: '【株式会社三重野商会】お問い合わせを受け付けました（自動返信）',
      text: `
${formData.name} 様

この度は、株式会社三重野商会（MIENO CORP.）にお問い合わせいただき、誠にありがとうございます。
以下の内容で、通信回線（お問い合わせフォーム）からのデータ受信を正常に確認いたしました。

━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 送信内容の控え
・お名前：${formData.name} 様
・メールアドレス：${formData.email}
・要件：${formData.subject}
・メッセージ：
${formData.message}
━━━━━━━━━━━━━━━━━━━━━━━━━━

本メールはシステムからの自動返信です。
内容を確認の上、弊社担当（役員陣）より通常1〜3営業日以内にご連絡させていただきます。
今しばらくお待ちくださいますようお願い申し上げます。

※ご自身の機体（モビリティ）に関する技術的なご相談等の場合は、詳細なスペックや現状の走行距離などを後ほどお伺いする場合がございます。

引き続き、株式会社三重野商会をよろしくお願いいたします。

--------------------------------------------------
株式会社三重野商会 (MIENO CORP.)
統合戦略システム 自動配信
Web: https://mieno-shokai.com/
--------------------------------------------------
      `.trim(),
    });

    if (autoReplyError) {
      console.error('Auto-reply Error:', autoReplyError);
    }
  } catch (e) {
    console.error('Auto-reply Exception:', e);
  }

  return { success: true };
}
