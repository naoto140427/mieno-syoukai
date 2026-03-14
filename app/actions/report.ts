'use server';

import { GoogleGenAI } from '@google/genai';

export async function generateTacticalReport(data: Record<string, unknown>) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = "あなたはMIENO CORP.の戦略分析AIです。提供されたテレメトリーデータ（距離、最高速度、獲得標高、天候、参加メンバー等）を元に、最高司令官の教義（狂気、120%のエンタメ、絶対的生存戦略）に則った、重厚でサイバーかつ少し狂気じみた作戦レポートを300〜400文字程度で生成してください。Appleの発表のように洗練されたトーンを保つこと。";

    const promptData = `
【タクティカルデータ】
・作戦名: ${data.title || 'Unknown'}
・日付: ${data.date || 'Unknown'}
・天候: ${data.weather || 'Unknown'}
・目的地: ${data.location_name || 'Unknown'}
・距離: ${data.distance_km || data.distance || 0} km
・最高速度: ${data.max_speed || 0} km/h
・平均速度: ${data.avg_speed || 0} km/h
・獲得標高: ${data.elevation_gain || 0} m
・最高標高: ${data.max_elevation || 0} m
・作戦時間: ${data.duration_time || 'Unknown'}
・参加メンバー: ${Array.isArray(data.members) ? data.members.join(', ') : (data.members || 'Unknown')}
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptData,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return {
      success: true,
      report: response.text,
    };
  } catch (error: unknown) {
    console.error('Tactical Report Generation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `作戦レポートの生成に失敗しました: ${errorMessage}`,
    };
  }
}
