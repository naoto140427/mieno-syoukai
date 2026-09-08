import { NextResponse } from 'next/server';

/**
 * LINE Webhook 受信エンドポイント。
 *
 * もともとは LINE グループ ID を調べるための一時的な実装で、受信内容をそのまま
 * service_role キーで `news` テーブルに INSERT していた。署名検証が無いため
 * 誰でも `news` に行を書き込める状態になっていたので、DB 書き込みを廃止した。
 *
 * グループ ID は取得済み（`LINE_GROUP_ID` として Vercel に設定済み）。
 * 現在はサーバーログにのみ出力する（Vercel のランタイムログで確認可能）。
 *
 * 今後この Webhook で実際の処理を行う場合は、必ず `x-line-signature` の
 * 検証（`LINE_CHANNEL_SECRET` による HMAC-SHA256）を実装してから行うこと。
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (Array.isArray(body?.events)) {
      for (const event of body.events) {
        if (event?.source?.type === 'group') {
          console.log('[LINE Webhook] group event received. groupId:', event.source.groupId);
        }
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('[LINE Webhook] error:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
