/**
 * Supabase StorageにPrivateバケット「unit-documents」を作成する
 * Management APIを使用（service_role keyが必要）
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// プレビューのリモートURLを使う
const REMOTE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co')
  ? process.env.NEXT_PUBLIC_SUPABASE_URL
  : 'https://nfcejbkgispqyrtbggnk.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// プレビューの環境変数を確認
console.log('URL:', REMOTE_URL);
console.log('Service key set:', !!SERVICE_ROLE_KEY);
console.log('Key prefix:', SERVICE_ROLE_KEY?.substring(0, 15) + '...');

// Supabase Previewの本番URLを使う
// .env.localのNEXT_PUBLIC_SUPABASE_URLはlocalhost → 本番URLを直接指定
const supabase = createClient(REMOTE_URL, SERVICE_ROLE_KEY);

async function run() {
  // バケット一覧を取得
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) {
    console.error('Error listing buckets:', listErr.message);
    return;
  }
  console.log('Existing buckets:', buckets?.map(b => b.name).join(', ') || '(none)');

  const exists = buckets?.some(b => b.name === 'unit-documents');
  
  if (exists) {
    console.log('✅ unit-documents bucket already exists!');
  } else {
    // バケットを作成
    const { data, error } = await supabase.storage.createBucket('unit-documents', {
      public: true,  // publicにしてファイルURLに直接アクセス可能にする
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: [
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/webp',
        'text/plain',
        'text/csv',
      ]
    });

    if (error) {
      console.error('❌ Error creating bucket:', error.message);
    } else {
      console.log('✅ unit-documents bucket created!', data);
    }
  }

  // テーブル確認
  const { data: docData, error: docErr } = await supabase
    .from('unit_documents')
    .select('id')
    .limit(1);
  console.log('unit_documents table:', docErr ? `ERROR: ${docErr.message}` : '✅ exists');

  const { data: logData, error: logErr } = await supabase
    .from('maintenance_logs')
    .select('id')
    .limit(1);
  console.log('maintenance_logs table:', logErr ? `ERROR: ${logErr.message}` : '✅ exists');
}

run().catch(console.error);
