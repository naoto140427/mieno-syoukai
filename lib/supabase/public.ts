import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * createPublicClient — クッキーを読み込まないパブリック専用Supabaseクライアント
 *
 * [MIENO CORP. DOCTRINE]
 * 認証不要なパブリックデータ（News, Archives, Units等）のFetchには
 * 必ずこのクライアントを使用すること。
 *
 * 理由: createServerClient は内部で cookies() を呼び出すため、
 * Next.js はページを動的レンダリングに強制し、Vercel Edge Network の
 * 静的キャッシュ（CDNキャッシュ）が破棄（Bailout）される。
 * このクライアントは cookies() を一切呼び出さないため、
 * unstable_cache と組み合わせることで完全な Zero-Latency アーキテクチャを実現する。
 */
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
