'use server'

import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com';

export async function submitInquiry(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
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

  return { success: true };
}
