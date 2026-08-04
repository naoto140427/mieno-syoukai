import { streamText, Message } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // if (!user) {
    //   return new Response('Unauthorized', { status: 401 });
    // }

    const { messages, unitId } = await req.json();

    // 1. DBから関連ドキュメントを取得
    const { data: docs } = await supabase
      .from('unit_documents')
      .select('*')
      .eq('unit_id', unitId)
      .in('document_type', ['MANUAL', 'PARTS_LIST']);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured on the server.' }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    const fileParts: { type: 'file'; data: string; mimeType: string }[] = [];

    if (docs && docs.length > 0) {
      for (const doc of docs) {
        try {
          console.log(`Downloading ${doc.file_name} from Supabase...`);
          const { data: fileData, error: downloadError } = await supabase.storage
            .from('unit-documents')
            .download(doc.storage_path);

          if (downloadError || !fileData) {
            console.error('Failed to download document:', downloadError);
            continue;
          }

          const arrayBuffer = await fileData.arrayBuffer();
          const base64Data = Buffer.from(arrayBuffer).toString('base64');

          fileParts.push({
            type: 'file',
            data: base64Data,
            mimeType: doc.mime_type || 'application/pdf',
          });
        } catch (docError) {
          console.error('Error processing document for Gemini:', docError);
        }
      }
    }

    // 2. メッセージの構成
    const systemPrompt = `あなたはMIENO CORP.の戦術整備AIアシスタントです。
提供されたマニュアルとパーツリスト（PDF）に基づき、エージェントからの技術的な質問に回答してください。
もし部品の型番を聞かれたら、PDF内の図解やリストから該当する型番を特定して回答してください。
トラブルの症状が提示されたら、マニュアルのトラブルシューティングに基づき、可能性のある原因と確認手順を提案してください。
回答は日本語で、簡潔かつ的確に行ってください。出力にはMarkdown（太字やリスト）を使用してください。`;

    const lastMessage = messages[messages.length - 1] as Message;
    
    // AI SDK v3.x の CoreMessage 形式に変換
    // CoreMessageでは content を Array にして複数のパートを持たせることができる
    const coreMessages = messages.map((m: Message, idx: number) => {
      if (idx === messages.length - 1 && m.role === 'user' && fileParts.length > 0) {
        return {
          role: m.role,
          content: [
            { type: 'text', text: m.content },
            ...fileParts
          ]
        };
      }
      return {
        role: m.role,
        content: m.content
      };
    });

    const googleProvider = createGoogleGenerativeAI({ apiKey });

    const result = await streamText({
      model: googleProvider('gemini-3.6-flash'),
      system: systemPrompt,
      messages: coreMessages as any,
      onFinish: async ({ usage }) => {
        try {
          if (user) {
            await supabase.from('ai_usage_logs').insert({
              user_id: user.id,
              model: 'gemini-3.6-flash',
              prompt_tokens: usage.promptTokens,
              completion_tokens: usage.completionTokens,
              unit_id: unitId
            });
          }
        } catch (e) {
          console.error('Failed to log AI usage:', e);
        }
      }
    });

    return result.toDataStreamResponse();
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Chat Error:', errorMessage, error);
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
