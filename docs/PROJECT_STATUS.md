# 現状把握レポート（GitHub / Vercel / Supabase 全調査）

**調査日**: 2026-09-06
**対象**: `naoto140427/mieno-syoukai` / Vercel `mieno-syoukai` / Supabase `nfcejbkgispqyrtbggnk`

次回開発を止めずに進めるための「今どうなっているか」と「先に片付けるべきこと」の一覧です。

---

## 0. サマリー（先に読む3行）

1. **`preview` ブランチが `main` より 54 コミット先行**したまま約1ヶ月放置。PR #151（`preview` → `main`）が 2026-07-16 から open。AI Tactical Advisor 一式が本番未反映。
2. **セキュリティ最優先事項が1件**（§5-1）。public リポジトリに本番管理者の認証情報が入っており、ログイン画面の初期値にも埋まっている。次の作業の前に対処すべき。
3. **CI は実質停止**。Playwright は self-hosted ランナー指定でランナー不在のまま全て cancelled（最終 2026-03-16）。Supabase マイグレーション CI は全 5 回 failure 後に削除済み。

---

## 1. GitHub

| 項目 | 状態 |
|---|---|
| リポジトリ | `naoto140427/mieno-syoukai` — **public**、default branch `main` |
| 作成 | 2026-02-14 / 最終 push 2026-08-04 |
| コミット数 | 約 252（`naoto140427` 121 / `Naoto Watanabe` 71 / `google-labs-jules[bot]` 60） |
| リモートブランチ | 65 本（うち大半がマージ済みの作業ブランチ・Jules 自動生成ブランチ） |
| Open PR | **#151「chore: merge preview into main」**（`preview` → `main`, 2026-07-16 作成 / 2026-08-04 最終更新） |
| ブランチ保護 | なし（`main` へ直接 push 可能） |

### 1-1. `main` と `preview` の差分

`preview` にのみ存在する内容（10ファイル / +1,705 −242）:

```
app/api/admin/chat/route.ts                              新規 (+121)  AIチャット API
components/admin/AITacticalAdvisor.tsx                   新規 (+282)  管理者向け AI アドバイザー
components/Inventory.tsx / app/inventory/page.tsx        改修         AI トークン使用量の表示
components/UnitDetailClient.tsx                          改修
supabase/migrations/20260804000000_add_gemini_file_cache.sql   新規
supabase/migrations/20260805000000_create_ai_usage_logs.sql    新規
package.json / package-lock.json                         Gemini 関連依存の追加
```

`main` にのみあるのは #152/#145 などのマージコミット5本のみで、実コードは `preview` が完全な上位互換。
**→ PR #151 をマージすれば本番が最新になる。** ただしマージ前に §5 の対処を推奨。

### 1-2. CI/CD の状態

| ワークフロー | 状態 |
|---|---|
| `.github/workflows/playwright.yml` | `runs-on: self-hosted` を指定。**ランナーが存在せず、2026-03-16 の run #116 以降すべて cancelled（24時間タイムアウト）**。実質機能していない |
| `.github/workflows/supabase-migration.yml` | 2026-07-10 に追加 → 5 回すべて failure → 削除済み（現存するのは `feat/setup-supabase-ci` ブランチのみ） |

Playwright を CI で復活させるなら `runs-on: ubuntu-latest` に変更し、必要な Secrets（`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `NEXT_PUBLIC_MAPBOX_TOKEN` / `RESEND_API_KEY` / `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`）を設定する必要がある。

---

## 2. Vercel

| 項目 | 値 |
|---|---|
| Team | Naoto Watanabe's projects（`team_4HvSyv1SKF3aGLeHrc0r1NwS`）/ **Hobby プラン** |
| Project | `mieno-syoukai`（`prj_RouCoIKDkDKAr7Krkph1mpJuJR1f`）/ Framework: Next.js / Node 24.x / Bundler: Turbopack |
| Production ドメイン | `mieno-shokai.com`（+ `mieno-syoukai-*.vercel.app`） |
| Preview ドメイン | `preview.mieno-shokai.com` → `preview` ブランチに紐付け |
| 最終本番デプロイ | 2026-07-16 14:57 UTC（`main` @ `23490b1`） |
| 最終プレビューデプロイ | 2026-08-04 17:03 UTC（`preview` @ `966591f`） |
| Deployment Protection | Password / Vercel Authentication / Trusted IPs **すべて無効** |

- 本番・プレビュー両 URL の疎通と別ビルドであることを確認済み（どちらも HTTP 200、配信チャンクが異なる）。
- 直近のプレビュー履歴には Gemini モデル名の試行錯誤（`gemini-1.5-pro` → `2.5-pro` → `3.6-flash`）と ERROR 1件（`1a17f34` の依存アップグレード）が残っている。
- **Deployment Protection が無効なため、プレビュー URL は URL を知る誰でも閲覧できる。** 検証フロー上は便利だが、公開前コンテンツを扱う際は留意。
- 同チームにもう1つ `kyushuunion` プロジェクトあり（別リポジトリ、本件とは無関係）。

> ※ 環境変数の一覧は MCP 経由では取得できないため未確認。**Preview 環境にも Production と同じ変数（特に `GEMINI_API_KEY`）が入っているか**を Vercel ダッシュボードで確認してください。

---

## 3. Supabase

| 項目 | 値 |
|---|---|
| Project | `mieno-syoukai`（`nfcejbkgispqyrtbggnk`）/ region `ap-northeast-1` / PostgreSQL 17.6 |
| 状態 | ACTIVE_HEALTHY（作成 2026-02-15） |
| Edge Functions | なし |
| ブランチ機能 | 未使用（DB は本番・プレビュー共用） |

### 3-1. テーブル（public スキーマ・全 15 テーブル、RLS は全て有効）

| テーブル | 行数 | 用途 |
|---|---|---|
| `news` | 13 | ニュース／ツーリング告知（`status`, `is_pinned`, `event_date` 等） |
| `archives` | 7 | 走行アーカイブ（GPX / `route_data` jsonb / 距離・標高） |
| `units` | 7 | 機動戦力（車両）。`slug`, `specs` jsonb, `odometer` |
| `inquiries` | 3 | お問い合わせ（**`contacts` ではない**） |
| `agents` | 2 | エージェント（`auth.users` と 1:1、`codename`, `role`） |
| `touring_surveys` | 2 | ツーリング RSVP |
| `ai_usage_logs` | 4 | Gemini トークン使用量（デフォルトモデル `gemini-3.6-flash`） |
| `unit_documents` | 1 | 車両書類（`gemini_file_uri` キャッシュ列あり） |
| `tools` / `consumables` | 各1 | 工具・消耗品在庫 |
| `maintenance_logs` / `racing_logs` | 0 | 整備・走行ログ |
| `inventory_items` / `inventory_requests` | 0 | 貸出在庫（未使用） |
| `audit_logs` | 0 | 監査ログ |
| `autonomous_tasks` | 0 | 自律タスク（未使用） |
| `site_settings` | 1 | 緊急バナー・AI 厳格度のグローバル設定 |

### 3-2. Storage

| バケット | public | 制限 |
|---|---|---|
| `mieno-images` | **true** | サイズ・MIME 制限なし |
| `unit-documents` | **true** | 50MB / PDF・Office・画像・CSV のみ |

### 3-3. マイグレーション履歴のドリフト（要注意）

Supabase 側に記録されているマイグレーションは `20260716000000` まで。
一方 `preview` ブランチには以下2本があるが**履歴に載っていない**（＝ SQL エディタ等で手動適用された）:

- `20260804000000_add_gemini_file_cache.sql`
- `20260805000000_create_ai_usage_logs.sql`

実 DB には `ai_usage_logs` テーブルも `unit_documents.gemini_file_uri` 列も**既に存在する**。
**スキーマ変更の前には必ず実 DB を確認すること。** マイグレーションファイルだけを信用しない。

### 3-4. Advisor（Supabase 診断）

**セキュリティ**
- 🔴 ERROR: `ai_usage_logs` の RLS ポリシー `Admin can read ai usage logs` が `auth.jwt() -> user_metadata -> role` を参照。**`user_metadata` はユーザー自身が書き換え可能**なので権限判定に使ってはいけない。→ `agents` テーブルの `role` を参照する形に修正すべき。
- ⚠️ WARN: `public.rls_auto_enable()` が SECURITY DEFINER のまま `anon` / `authenticated` から `/rest/v1/rpc/` 経由で実行可能。EXECUTE を revoke するか SECURITY INVOKER に変更を。
- ⚠️ WARN: 漏洩パスワード保護（HaveIBeenPwned 連携）が無効。
- ℹ️ INFO: `audit_logs` / `inventory_items` / `inventory_requests` / `site_settings` は RLS 有効だがポリシー0件（＝誰もアクセスできない状態）。

**パフォーマンス**
- ⚠️ `multiple_permissive_policies` × 41 — `archives` / `consumables` / `inquiries` / `news` / `tools` / `units` で古いポリシーと新しいポリシーが重複（例: `Enable read access for all users` と `news_select_public`）。整理すればクエリごとの評価コストが下がる。
- ⚠️ `auth_rls_initplan` × 7 — `agents` / `ai_usage_logs` / `autonomous_tasks` のポリシーで `auth.*()` を `(select auth.uid())` にラップすると行ごとの再評価を回避できる。
- ℹ️ 未インデックスの外部キー 7件、未使用インデックス 1件。

---

## 4. コードベース構成

```
app/
  actions/       Server Actions（admin, agent, archives, audit, auth, contact, contact-ai,
                 inventory, logistics, news, news-ai, report, survey, units, upload）
  admin/         管理コンソール（ログイン + ダッシュボード）
  agent/         エージェント用ダッシュボード
  api/           auth/test-login, line/webhook, sentry-example-api
                 （preview のみ: admin/chat）
  公開ページ:     /, news, archives, units（+ [slug] / compare）, inventory, logistics,
                 history, services, ir, doctrine, careers, contact, legal/*
components/      公開 UI（Hero, News, Archives, StrategicUnits, DeploymentRSVP 等）
  admin/         LiveEditor, OperationBoard, RSVPMonitor, TransmissionControl,
                 GlobalOverride（+ preview のみ: AITacticalAdvisor）
lib/supabase/    client.ts（ブラウザ）/ server.ts（Cookie 有）/ public.ts（Cookie 無・キャッシュ用）
lib/gpx/         GPX パーサとジオコーディング
middleware.ts    セッションリフレッシュ + /admin, /agent のルート保護
supabase/migrations/  8本
tests/           Playwright（auth.setup, admin, navigation, visual + スナップショット）
```

### 4-1. 作業ディレクトリの汚れ（次回のノイズ源）

コミット済みで削除候補のファイル群:

- ログ: `dev_server.log`, `dev_server_merge.log`, `e2e_out2.log`, `nextjs_output.log`, `npm_dev.log`, `npm_install.log`, `server_logs.txt`, `server_verify.log`
- 検証スクショ: `verification_*.png`（3枚）、`verification/` 配下（10枚 + Python スクリプト3本）
- 一時パッチ／バックアップ: `*.orig`, `*.patch`（`app/actions/survey.ts.orig`, `types/database.ts.patch` など計7本）、`docs/edited_changes.patch`（158KB）
- 使い捨てスクリプト: `fix-careers.sh`, `fix-careers-2.sh`, `test.py`, `run_frontend_verification.py`
- `scratch/`（`node_modules` ごとコミットされている）

`types/database.ts` と `types/supabase.ts` の2系統が並存しており、どちらが正か不明瞭。`supabase gen types` で `types/supabase.ts` に一本化するのが望ましい。

---

## 5. 要対応事項（優先度順）

### 5-1. 🔴 最優先: 本番管理者の認証情報が public リポジトリに露出

- `app/admin/AdminLoginClient.tsx` の 39〜40 行目で、**管理者のメールアドレスとパスワードが `useState` の初期値としてハードコード**されている。これは本番バンドルにも含まれる。
- `scripts/setup-test-user.ts` および `tests/auth.setup.ts` にも同じパスワードが平文で入っている。
- `create_test_user.sql` にはプレビュー用アカウントのパスワードが平文で入っている。
- 該当アカウントは `agents.role = 'CTO'` で、管理者ロール判定を通過する。
- 加えて `app/api/auth/test-login/route.ts` は「開発・プレビュー環境のみ許可」とコメントされているが**実際には環境チェックが一切なく**、許可メールアドレスの allowlist にこの管理者アドレスが含まれている。→ 本番 URL に対して直接 POST するとセッション Cookie が発行される。
- リポジトリは public、かつ Git 履歴（少なくとも `88524f3` 以降）にも残っている。

**対処案**
1. Supabase Dashboard で該当アカウントのパスワードを即座に変更する
2. ログイン画面の初期値を空にする
3. テスト系のパスワードは `process.env.TEST_USER_PASSWORD` 必須にしてフォールバックを削除する
4. `/api/auth/test-login` に `process.env.VERCEL_ENV !== 'production'` のガードを追加、または本番ビルドから除外する
5. `create_test_user.sql` を履歴ごと整理するか、パスワードをプレースホルダに置換する

### 5-2. 🟠 LINE Webhook が無認証でデバッグコードのまま

`app/api/line/webhook/route.ts` は署名検証を行わず、**service_role キー**で受信ペイロードをそのまま `news` テーブルに INSERT する（`title: 'GROUP_ID_LOG'` / `status: 'DRAFT'`）。
グループ ID を調べるための一時コードと思われるが、公開エンドポイントのため誰でも `news` に行を書き込める。
→ LINE の `x-line-signature` 検証を追加するか、役目を終えているなら削除する。

### 5-3. 🟠 PR #151 の滞留

`preview` の AI 機能一式（Tactical Advisor / トークン使用量表示 / Gemini ファイルキャッシュ）が1ヶ月以上本番未反映。
マージ時は §3-3 のとおり関連マイグレーションが**既に手動適用済み**である点に注意（再適用しようとすると衝突する可能性）。

### 5-4. 🟡 `ai_usage_logs` の RLS が `user_metadata` 依存

§3-4 参照。ユーザーが自分で書き換え可能な値で管理者判定しているため、実質ザル。`agents.role` 参照に修正する。

### 5-5. 🟡 CI の再建

Playwright を `ubuntu-latest` に戻して Secrets を設定するか、CI をやめるなら `.github/workflows/playwright.yml` を削除して cancelled ランの蓄積を止める。

### 5-6. 🟡 ドキュメントとコードの不一致

`mieno-development-rules.md` §4-2 は「`middleware.ts` は廃止、`proxy.ts` を使え」とあるが、PR #122 で逆に `proxy.ts` を削除して `middleware.ts` に統合済み。ルール文書を現行に合わせて更新すべき（`CLAUDE.md` には現行仕様を記載済み）。

### 5-7. 🔵 リポジトリの整理

§4-1 のログ・スクショ・パッチ・`scratch/node_modules` を削除し、`.gitignore` を拡充。マージ済みブランチ（65本中の大半）も削除するとブランチ一覧が見通せるようになる。

---

## 6. Antigravity 時代のチャット履歴について

Antigravity のチャットログはローカルマシン（`~/Library/Application Support/...` 配下）に保存されるもので、このリモート実行環境からは参照できません。リポジトリ内も探索しましたが、Antigravity のセッションデータは含まれていませんでした。

ただし**当時の文脈は以下のファイルに文書として残されており、実質的に引き継げています**:

- `mieno-development-rules.md` — Antigravity 向けに書かれたドクトリン原典（デザイン原則・地雷マップ・応答プロトコル）
- `docs/task_history.md` — 完了タスクの履歴（2026-06-05 まで）
- `docs/future_tasks.md` — 未完了タスクのロードマップと UI/UX 仕様
- `docs/edited_changes_summary.md` + `docs/edited_changes.patch` — 一括改修の内容とパッチ
- `.agents/AGENTS.md` — E2E テスト運用ルール

これらは `CLAUDE.md` から参照する形に整理済みです。もし過去チャットで決まった事項でこれらに書かれていないものがあれば、共有いただければドキュメントに追記します。
