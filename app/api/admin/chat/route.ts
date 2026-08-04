import { streamText, Message } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createClient } from '@/lib/supabase/server';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';

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
    const fileManager = new GoogleAIFileManager(apiKey);
    const fileParts: { type: 'file'; data: string; mimeType: string }[] = [];

    // Vercel AI SDK (@ai-sdk/google) は現在 type: 'file' をサポートしていますが、
    // URL/Bufferを渡す必要があります。もしGeminiのfileUriが直接使えない場合は、
    // ここでVercel AI SDKのネイティブな方法に落とし込むか、
    // dataに fileUri を渡して動くか確認します（Google providerはfileUriをサポートしています）。

    if (docs && docs.length > 0) {
      for (const doc of docs) {
        let fileUri = doc.gemini_file_uri;
        let expiresAt = doc.gemini_file_expires_at ? new Date(doc.gemini_file_expires_at) : null;

        // キャッシュが無効な場合（期限切れ or 未登録）
        if (!fileUri || !expiresAt || expiresAt < new Date()) {
          console.log(`Downloading ${doc.file_name} from Supabase...`);
          const { data: fileData, error: downloadError } = await supabase.storage
            .from('unit-documents')
            .download(doc.storage_path);

          if (downloadError || !fileData) {
            console.error('Failed to download document:', downloadError);
            continue;
          }

          const arrayBuffer = await fileData.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const tmpFilePath = join(tmpdir(), `${uuidv4()}_${doc.file_name}`);
          
          await writeFile(tmpFilePath, buffer);
          
          try {
            console.log(`Uploading ${doc.file_name} to Gemini...`);
            // Geminiにアップロード
            const uploadResult = await fileManager.uploadFile(tmpFilePath, {
              mimeType: doc.mime_type || 'application/pdf',
              displayName: doc.title,
            });
            fileUri = uploadResult.file.uri;
            
            // 期限はアップロードから約48時間（安全マージンをとって47時間）
            const newExpiresAt = new Date(Date.now() + 47 * 60 * 60 * 1000).toISOString();
            
            // キャッシュを更新
            await supabase.from('unit_documents')
              .update({ gemini_file_uri: fileUri, gemini_file_expires_at: newExpiresAt })
              .eq('id', doc.id);
            
            console.log(`Uploaded to Gemini: ${fileUri}`);

          } catch (uploadError) {
            console.error('Failed to upload to Gemini:', uploadError);
          } finally {
            // クリーンアップ
            await unlink(tmpFilePath).catch(() => {});
          }
        }

        if (fileUri) {
          // @ai-sdk/google は fileUri を data (string URL) として受け取ることができる
          fileParts.push({
            type: 'file',
            data: fileUri,
            mimeType: doc.mime_type || 'application/pdf',
          });
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
