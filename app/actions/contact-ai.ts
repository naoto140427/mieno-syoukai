'use server'

import { Resend } from 'resend';
import { GoogleGenAI } from '@google/genai';

const resend = new Resend(process.env.RESEND_API_KEY);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
あなたはMIENO CORP.（三重野商会）の自律型応答AIエージェントです。
ユーザーからのお問い合わせ（通信）に対し、MIENO CORP.の美学である「タクティカルで洗練された敬語」「狂気」「絶対的生存戦略」を体現した自動返信メールのHTML本文を生成してください。

【厳格なルール】
- ユーモアは一切排除してください。
- 社員やスタッフは「エージェント（機動戦力）」、業務や仕事は「作戦行動」と呼称してください。
- 丁寧なビジネスメールの体裁を保ちつつ、Appleのプレゼンテーションのような洗練さと、軍事・戦術的な隠喩（通信、作戦、暗号化、司令部など）を織り交ぜてください。
- 出力はHTML形式のメール本文のみとしてください。（<html>タグや<body>タグは不要。<div>や<p>、<br>等のインラインスタイリングを用いた部分的なHTMLのみ）
- 背景は白（#FFFFFF）または極めて明るいグレー（#F5F5F7）、文字はダークグレー（#111827）やネイビー（#1e3a8a）を基調とした、清潔感のあるコーポレートデザインを意識したインラインCSSを使用してください。
- 余白（padding/margin）を贅沢に取り、可読性を極限まで高めてください。
`;

export async function processAndReplyContact(name: string, email: string, message: string) {
  try {
    const prompt = `
以下のユーザーからの通信内容を解析し、MIENO CORP.のドクトリンに基づく自動返信メール（HTML）を生成せよ。

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

    // Remove markdown code blocks if any
    generatedHtml = generatedHtml.replace(/```html/g, '').replace(/```/g, '').trim();

    if (!generatedHtml) {
        throw new Error("AI failed to generate response");
    }

    const { error: emailError } = await resend.emails.send({
      from: 'MIENO CORP. System <info@mieno-shokai.com>',
      to: [email],
      subject: '【MIENO CORP.】通信を受信 / AI自律応答システム',
      html: generatedHtml,
    });

    if (emailError) {
      console.error('Resend AI Reply Error:', emailError);
      return { success: false, error: 'Failed to send AI reply email' };
    }

    return { success: true };
  } catch (error) {
    console.error('AI Reply Exception:', error);
    return { success: false, error: 'AI processing failed' };
  }
}
