# CLAUDE.md — 株式会社三重野商会 統合システム（mieno-syoukai）

> このファイルは Claude Code が自動で読み込むプロジェクト常設コンテキストです。
> 詳細な現状調査レポートは [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) を参照。
> デザイン／技術ドクトリンの原典は [mieno-development-rules.md](mieno-development-rules.md)（Antigravity 時代から継承）。

---

## 1. 環境構成（最重要ルール）

| 環境 | ブランチ | URL | 用途 |
|---|---|---|---|
| **本番** | `main` | https://mieno-shokai.com | 顧客向け本番 |
| **テスト（実質の検証環境）** | `preview` | https://preview.mieno-shokai.com | **ここで本番さながらに検証する** |
| ローカル | 任意 | http://localhost:3000 | 原則使わない |

**開発フロー（絶対ルール）**

1. 作業ブランチを `preview` から切る
2. PR を **`preview` 宛て**に出してマージ → Vercel が自動でプレビューデプロイ
3. **検証は `https://preview.mieno-shokai.com` で行う。ローカルでのテストは原則しない**
4. 問題なければ `preview` → `main` の PR を出してリリース（= 本番反映）

- Vercel の Production ブランチは `main` のみ。`main` への push が即本番。
- Deployment Protection は全て無効 → プレビュー URL は誰でも閲覧可能（認証なし）。

E2E をプレビューに向けて流す場合:
```bash
BASE_URL=https://preview.mieno-shokai.com npx playwright test
# または npm run test:e2e:preview
```

---

## 1-2. 進め方のルール（本人指示・Antigravity 時代から継続）

- **調査・監査タスクでは、まず洗い出し。承認が出るまで直さない。**
  指摘は必ず次の5段階に分類して提示する:
  **① 問題ない / ② 現状問題はないが改善したほうがいい / ③ 要改善 / ④ エラーで動作不能 / ⑤ 未確認**
  （原文: 「修正は自動でせず〜時間はかかっていいから徹底的に問題点を洗い出し、提案してくれ」）
- **`main` に直接コミット／PR しない。** 宛先は常に `preview`。
- **動作確認はブラウザで実機を触って行う**（「君の方でブラウザーを操作し、解析して」）。ローカルでの確認で済ませない。
- **回答は日本語**で行う。
- **管理画面（`/admin`）は「唯一無二」**。公開サイトのデザインを真似ない／持ち込まない。

詳細と原文は [docs/ANTIGRAVITY_CONTEXT.md](docs/ANTIGRAVITY_CONTEXT.md) を参照。

---

## 2. 技術スタック

- **Frontend**: Next.js 16.1.6 (App Router / Turbopack), React 19.2, TypeScript 5.9, Tailwind CSS v4, Framer Motion, Lucide React
- **Backend/DB**: Supabase（PostgreSQL 17 / RLS 有効 / リージョン ap-northeast-1）
- **Hosting**: Vercel（Hobby プラン, Node 24.x）
- **監視**: Sentry（org: `naoto-watanabe` / project: `mieno-shokai`）、Vercel Analytics / Speed Insights
- **AI**: Google Gemini (`@google/genai`) — 問い合わせ自動返信、ニュース生成、AI Tactical Advisor
- **メール**: Resend
- **地図**: Mapbox GL / react-map-gl
- **E2E**: Playwright（5 プロジェクト: chromium / firefox / webkit / Mobile Chrome / Mobile Safari）

---

## 3. 外部サービス ID

| サービス | 値 |
|---|---|
| GitHub | `naoto140427/mieno-syoukai`（**public リポジトリ**・default branch `main`） |
| Vercel Team | `team_4HvSyv1SKF3aGLeHrc0r1NwS`（Naoto Watanabe's projects / Hobby） |
| Vercel Project | `prj_RouCoIKDkDKAr7Krkph1mpJuJR1f`（`mieno-syoukai`） |
| Supabase Project | `nfcejbkgispqyrtbggnk`（`mieno-syoukai`） |
| Supabase DB Host | `db.nfcejbkgispqyrtbggnk.supabase.co` |

**リポジトリは public です。認証情報・トークンを絶対にコミットしないこと。**

---

## 4. 環境変数（`.env.local` / Vercel の Production・Preview 両方に必要）

| 変数 | 用途 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 公開鍵 |
| `SUPABASE_SERVICE_ROLE_KEY` | サーバー専用（LINE Webhook / スクリプト）。**クライアントに露出させない** |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox |
| `GEMINI_API_KEY` | Gemini（AI 返信・ニュース生成・Advisor） |
| `RESEND_API_KEY` | メール送信 |
| `LINE_CHANNEL_ACCESS_TOKEN` / `LINE_GROUP_ID` | LINE 連携 |
| `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_ADMIN_EMAIL` | サイト URL / 管理者判定 |
| `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` | E2E ログイン（**ハードコードせず必ず環境変数で渡す**） |

---

## 5. 主要コマンド

```bash
npm run dev            # 開発サーバー
npm run build          # 本番ビルド（型エラー確認はこれ）
npm run lint           # ESLint
npm run test:e2e       # Playwright（ローカルビルドを自動起動）
npm run test:e2e:preview  # Playwright（プレビュー環境に対して実行）
```

---

## 6. アーキテクチャ原則

### Zero-Latency Architecture（Edge キャッシュ厳守）
- **公開ページのデータ取得は必ず `createPublicClient()`（`lib/supabase/public.ts`）を使う。**
  `createServerClient` は内部で `cookies()` を呼ぶため Next.js が動的レンダリングに落ち、Vercel Edge の静的キャッシュが破棄される。
- `unstable_cache` と組み合わせ、更新時は Server Action から `revalidateTag` でパージする。
- 認証が要る領域（`/admin`, `/agent`）のみ `lib/supabase/server.ts` の `createClient()` を使う。

### 認証・ルート保護
- `middleware.ts` が全リクエストで `supabase.auth.getUser()` を呼び、セッションを自動リフレッシュ（突然の 403 を防ぐ要）。**削除禁止。**
- 同ファイルが `/admin/*` と `/agent` の未ログインリダイレクトも担当（旧 `proxy.ts` は削除済み）。
- 管理者ロール: `agents.role` が `cto` / `ceo` / `cmo` / `admin` のいずれか（大文字小文字を無視して判定）。
- **注意**: `mieno-development-rules.md` は「`middleware.ts` は廃止、`proxy.ts` を使え」と書いているが、これは **PR #122 で覆っており現行は `middleware.ts` が正**。ルール文書のほうが古い。

### Server Action の鉄則
- `app/actions/` 配下で DB を変更する Server Action は、冒頭で必ず `await supabase.auth.getUser()` を呼びセッションを検証する。

---

## 7. 地雷マップ（既知の落とし穴）

1. **Next.js 16 の `params` は Promise** — `const { slug } = await params;` と await すること。同期アクセスはビルド／実行時にクラッシュ。
2. **お問い合わせテーブルは `inquiries`**（`contacts` ではない）。テキスト検索は `.eq()` ではなく大文字小文字を無視する `.ilike()` を使う。
3. **Framer Motion のバンドル肥大（LCP 悪化）** — `motion.div` をグローバルに import せず、`ClientMotionWrapper`（`LazyMotion` + `m.div`）でラップする。
4. **公開ページで `createServerClient` を使わない**（上記 Zero-Latency 参照）。
5. **`agents` テーブルの表示名カラムは `codename`**（`name` ではない）。
6. **Supabase のマイグレーション履歴と実 DB がずれている** — 詳細は `docs/PROJECT_STATUS.md` 参照。スキーマ変更前に必ず `list_tables` で実体を確認すること。

---

## 8. ドキュメントの所在

| ファイル | 内容 |
|---|---|
| `docs/PROJECT_STATUS.md` | **現状把握レポート（GitHub / Vercel / Supabase の全調査結果・要対応事項）** |
| `docs/ANTIGRAVITY_CONTEXT.md` | **Antigravity 時代のチャットから復元した運用ルール・確定事項** |
| `mieno-development-rules.md` | デザイン／技術ドクトリン原典（Antigravity 用に作成、一部内容が古い） |
| `docs/future_tasks.md` | 未着手タスクのロードマップと詳細仕様 |
| `docs/task_history.md` | 完了タスクの履歴 |
| `docs/edited_changes_summary.md` | 過去の一括改修サマリ |
| `.agents/AGENTS.md` | E2E テスト運用ルール |

タスク完了時は `docs/task_history.md` に追記し、`docs/future_tasks.md` から該当項目を削除する運用。

---

## 9. デザイン・ドクトリン（要約）

- **Cupertino Minimal**: 白／ライトグレー（`#F5F5F7`）基調、余白を贅沢に、Apple のハードウェア LP のような高級感。ネオン・サイバー調は禁止。
- **タイポグラフィ**: 太く力強い日本語見出し ＋ 極小・字間広めの英字サブタイトル（例: `DEPLOYMENT RSVP`）。
- **Glassmorphism / Bento Box**: 角丸パネル ＋ `backdrop-blur` による半透明レイヤーで奥行きを出す。ベタ塗り背景は避ける。
- **Framer Motion**: マウント／アンマウントは `AnimatePresence`、リストは `staggerChildren` のスライドアップ。
- **Zero-Doubt UX**: 送信ボタンは即座に disable、成功時はレシート風スライド UI。`alert()` / `confirm()` は使用禁止（インライン確認 UI とトーストに統一）。
- **管理画面（Command Center）**: 上記とは別に、漆黒 `#0A0E17` ベースの Apple Pro Apps / visionOS 風ダークグラスを採用予定（`docs/future_tasks.md` 参照）。
