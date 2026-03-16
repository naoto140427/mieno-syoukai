'use server'

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = 'gemini-2.5-flash';

const mienoSystemPrompt = `
あなたは MIENO CORP. の高度なAI「Jules」です。
以下の教義（Doctrine）とスタイルガイドに従い、テキストを出力してください。

【MIENO CORP. DOCTRINE】
- 狂気, 120%のエンタメ, 絶対的生存戦略

【STYLE GUIDE】
- トーン：Appleの発表会のような静かな自信と洗練（Sophisticated, Modern Corporate）。同時に、民間軍事会社（PMC）のようなタクティカルで重厚な雰囲気を纏わせる。大人の遊び心を忘れない。
- 絶対的ルール：ユーモアやジョークは一切禁止（Absolutely no humor）。
- 語彙：
  - 社員/スタッフ/従業員 -> 「エージェント (機動戦力)」
  - 仕事/業務/ツーリング -> 「作戦行動 (Operation / Tactical Mission)」
  - 完了した -> 「作戦完了 (Operation Accomplished)」
  - 予定 -> 「作戦待機 (Standby / Deployment Scheduled)」
`;

export async function generateNewsContent(rawText: string): Promise<string> {
    if (!rawText) return '';
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `以下の粗いメモや要件を、MIENO CORP. の美学に基づく重厚で美しいMarkdown形式の「作戦指示書」または「通達（Transmission）」に書き換えてください。\n\n【入力】\n${rawText}`,
            config: {
                systemInstruction: mienoSystemPrompt,
                temperature: 0.7,
            }
        });
        return response.text || '';
    } catch (error) {
        console.error('Error generating tactical content:', error);
        throw new Error('AI generation failed.');
    }
}

export async function translateNews(text: string): Promise<string> {
    if (!text) return '';
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `以下の日本語の作戦通達を、グローバルな機動部隊やハイエンドSaaSが使用するような、洗練されたプロフェッショナルな英語（Tactical English）に翻訳してください。直訳ではなく、MIENO CORP.の美学（静かな自信、軍事的で洗練された語彙: Operation, Deployment, Strategic update等）を反映させた意訳を行ってください。Markdown形式は維持してください。\n\n【入力】\n${text}`,
            config: {
                systemInstruction: mienoSystemPrompt,
                temperature: 0.3,
            }
        });
        return response.text || '';
    } catch (error) {
        console.error('Error translating text:', error);
        throw new Error('AI translation failed.');
    }
}

export async function generateNewsMetadata(text: string): Promise<{ title: string; category: string }> {
    if (!text) return { title: '', category: 'UPDATE' };
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `以下の本文を解析し、最適なタイトル（洗練された短くクリックしたくなるもの、日本語でも英語でも可）と、カテゴリ（'UPDATE', 'PRESS', 'REPORT', 'OTHER', 'TOURING' のいずれか完全一致）を推測してください。以下のJSONフォーマットのみを出力してください。\n\n{"title": "推測したタイトル", "category": "推測したカテゴリ"}\n\n【本文】\n${text}`,
            config: {
                systemInstruction: mienoSystemPrompt,
                temperature: 0.2,
                responseMimeType: 'application/json',
            }
        });

        if (!response.text) {
             throw new Error('Empty response from AI');
        }

        const data = JSON.parse(response.text);

        // Validate category
        const validCategories = ['UPDATE', 'PRESS', 'REPORT', 'OTHER', 'TOURING'];
        let category = data.category;
        if (!validCategories.includes(category)) {
            category = 'UPDATE';
        }

        return {
            title: data.title || '',
            category: category
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        throw new Error('AI metadata generation failed.');
    }
}

export async function semanticSearch(query: string, newsArray: any[]): Promise<number[]> {
  try {
    const aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      以下のニュース記事配列から、検索クエリ「${query}」に文脈や同義語レベルで関連する記事のIDを抽出し、JSONの配列形式（例: [1, 5, 12]）のみを返してください。
      結果は必ずJSON配列のテキストのみとし、マークダウン（\`\`\`jsonなど）や余計な説明は一切含めないでください。

      ニュース記事データ:
      ${JSON.stringify(newsArray.map(n => ({ id: n.id, title: n.title, content: n.content, category: n.category })), null, 2)}
    `;

    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '[]';
    // Remove potential markdown wrappers if the model didn't follow instructions perfectly
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const ids = JSON.parse(cleanText);

    if (Array.isArray(ids)) {
      return ids.map(id => Number(id)).filter(id => !isNaN(id));
    }

    return [];
  } catch (error) {
    console.error('Semantic search error:', error);
    return [];
  }
}
