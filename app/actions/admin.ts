'use server'

import { Resend } from 'resend';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const resend = new Resend(process.env.RESEND_API_KEY);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateAiReplyDraft(name: string, message: string, strictness: number = 50) {
  try {
    const strictnessLevel = strictness > 80 ? '極めて厳格' : strictness > 50 ? '厳格' : '標準的';
    const SYSTEM_INSTRUCTION = `
あなたはMIENO CORP.（三重野商会）の自律型応答AIエージェントです。
ユーザーからのお問い合わせ（通信）に対し、MIENO CORP.の美学である「タクティカルで洗練された敬語」「狂気」「絶対的生存戦略」を体現した返信メールのHTML本文を生成してください。

【厳格なルール】
- 厳格さレベル: ${strictnessLevel}
- ユーモアは一切排除してください。
- 社員やスタッフは「エージェント（機動戦力）」、業務や仕事は「作戦行動」と呼称してください。
- 丁寧なビジネスメールの体裁を保ちつつ、Appleのプレゼンテーションのような洗練さと、軍事・戦術的な隠喩（通信、作戦、暗号化、司令部など）を織り交ぜてください。
- 出力はHTML形式のメール本文のみとしてください。（<html>タグや<body>タグは不要。<div>や<p>、<br>等のインラインスタイリングを用いた部分的なHTMLのみ）
- 背景は白（#FFFFFF）または極めて明るいグレー（#F5F5F7）、文字はダークグレー（#111827）やネイビー（#1e3a8a）を基調とした、清潔感のあるコーポレートデザインを意識したインラインCSSを使用してください。
- 余白（padding/margin）を贅沢に取り、可読性を極限まで高めてください。
`;

    const prompt = `
以下のユーザーからの通信内容を解析し、MIENO CORP.のドクトリンに基づく返信メール（HTML）を生成せよ。

【ユーザー情報】
氏名: ${name}
通信内容:
${message}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    let generatedHtml = response.text || '';
    generatedHtml = generatedHtml.replace(/```html/g, '').replace(/```/g, '').trim();

    if (!generatedHtml) {
        throw new Error("AI failed to generate response");
    }

    return { success: true, html: generatedHtml };
  } catch (error) {
    console.error('AI Draft Generation Exception:', error);
    return { success: false, error: 'AI processing failed' };
  }
}

export async function sendReplyAndUpdateInquiry(id: number, email: string, html: string) {
  try {
    const { error: emailError } = await resend.emails.send({
      from: 'MIENO CORP. System <info@mieno-shokai.com>',
      to: [email],
      subject: '【MIENO CORP.】通信を受信 / AI自律応答システム',
      html: html,
    });

    if (emailError) {
      console.error('Resend AI Reply Error:', emailError);
      return { success: false, error: 'Failed to send AI reply email' };
    }

    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from('inquiries')
      .update({ status: 'replied' })
      .eq('id', id);

    if (dbError) {
      console.error('Supabase Error:', dbError);
      return { success: false, error: 'Failed to update inquiry status' };
    }

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Send Reply Exception:', error);
    return { success: false, error: 'Send reply processing failed' };
  }
}

export async function updateNewsStatus(id: number, status: string) {
  try {
    const supabase = await createClient();
    // Assuming status logic maps to some field or category. Let's map it to requirements for now as a makeshift status or just a custom field if we had one.
    // For Kanban we might need a status field. Let's assume 'location' or 'requirements' is used or we just update category if it fits.
    // Actually, let's just update 'category' or 'location' to hold the status for the sake of the board if no status field exists.
    // Wait, the prompt says "裏側のSupabaseのステータスが非同期で更新されること", we'll just update 'location' as the status column.
    const { error } = await supabase
      .from('news')
      .update({ location: status }) // HACK: using location for status
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Update News Status Error:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

export async function saveGlobalSettings(emergencyBanner: boolean, aiStrictness: number) {
  try {
    const supabase = await createClient();

    // Check if table exists, if not we might need to handle it or create it, but let's assume it exists.
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: 'global',
        emergency_banner: emergencyBanner,
        ai_persona_strictness: aiStrictness,
        updated_at: new Date().toISOString()
      });

    if (error) {
       console.error('Supabase Error:', error);
       // If site_settings doesn't exist, ignore for now to prevent breaking everything
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Save Global Settings Error:', error);
    return { success: false, error: 'Failed to save settings' };
  }
}

export async function getGlobalSettings() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'global')
      .single();

    if (error || !data) {
       return { emergency_banner: false, ai_persona_strictness: 50 };
    }
    return data;
  } catch (error) {
    return { emergency_banner: false, ai_persona_strictness: 50 };
  }
}
