# Antigravity 時代のチャット履歴からの引き継ぎ

**抽出日**: 2026-09-07
**抽出元**: `~/.gemini/antigravity/conversations/9dccd36d-0a1f-4b3e-8dfa-25d99cd7ee5c.db`（mieno-syoukai のワークスペース / 8,357 ステップ）
**方法**: SQLite の `steps` テーブル（`step_type=23` がユーザー発言・セッション要約）から復元

> このファイルは、コード・既存ドキュメントには残っていないが**チャットでのみ合意されていた運用ルール**を保全するためのものです。
> `mieno-development-rules.md` が「デザイン／技術ドクトリン」、こちらが「進め方・コミュニケーションのルール」にあたります。

---

## 1. 進め方のルール（本人の指示・原文）

| ルール | 原文 |
|---|---|
| **修正より先に、まず洗い出し** | 「修正は自動でせず、**問題ない / 現状問題はないが改善したほうがいい / 要改善 / エラーで動作不能 / 未確認** に分類し、時間はかかっていいから徹底的に問題点を洗い出し、提案してくれ」 |
| **勝手に直さない** | 「修正はまだせず、炙り出すだけ」 |
| **main に直接触らない** | 「メインに直接じゃなくて、**preview ブランチ**にして」 |
| **ブラウザで実機検証する** | 「君の方でブラウザーを操作し、解析して」 |
| **日本語で回答** | 「私へのは Gemini、Claude 問わず日本語にて回答」 |

**→ 実務上の運用**
1. 調査・監査タスクでは、指摘を必ず上記5段階で分類して提示する。
2. 承認が出るまでコードを書き換えない。
3. PR の宛先は常に `preview`。`main` へは preview からのリリース PR のみ。
4. 「動いた」の確認はローカルではなく `https://preview.mieno-shokai.com` をブラウザで開いて行う。

---

## 2. デザイン上の確定事項（チャットで決まったもの）

### 管理画面（/admin）は「唯一無二」
> 「管理者画面は唯一無二だから、マネなくていいよ」

公開サイトの Cupertino Minimal（白基調）と管理画面のダークトーンは**別物として扱う**。
管理画面のデザインを公開サイトに持ち込まない／その逆もしない。

### RSVP フォームは公開サイト側のトーンに合わせる
> 「参加、未定、不参加のカラフルなのが気になるね。」

`components/DeploymentRSVP.tsx` はニュース記事詳細ページに**埋め込まれる**ため、管理画面のダークトーンにすると浮く。
→ 記事に馴染むライトトーンを維持し、装飾を落とす方針で確定。あわせて日本語化済み。

| 変更前 | 変更後 |
|---|---|
| `Deployment RSVP` | 参加可否フォーム |
| `AGENT NAME` | 名前 |
| `JOIN` / `PENDING` / `DECLINE` | 参加 / 未定 / 不参加 |
| `DEPLOYMENT VEHICLE` | 参加車両 |
| `COMMUNICATION / MESSAGE (OPTIONAL)` | 連絡事項・メッセージ（任意） |
| `TRANSMITTING...` | 送信中... |

### AI Tactical Advisor の UI 仕様
- 画面右下に常駐するアイコンから展開する**フローティング・ウィジェット**（文脈同期型）。
- チャット UI は Apple「メッセージ」ライク。
  - 自分の発言 = 右寄せ・青〜プライマリのグラデーション・白文字
  - AI の発言 = 左寄せ・ダークグレー／すりガラス（`backdrop-blur`）・白文字
  - 吹き出しの角丸は iMessage 同様、隣接メッセージで滑らかに変化（`rounded-tl-2xl rounded-bl-sm` 等）
- 応答待ちは iMessage の「3つのドットが波打つ」タイピングインジケータを左吹き出しで表示。
- 対象は各車両のドキュメント（100〜400ページ規模のマニュアル／パーツリスト）の解析支援。

### AI トークン残量の表示
> 「備品管理欄に AI の残り無料トークン数を記載しておこう。**4人で使う想定**だからね。」
> 「可能であればリアルタイムで、かつ見れるのは **admin 権限があるものに限る**。」

→ `ai_usage_logs` テーブルと `/inventory` 上の表示はこの要件から生まれたもの。
**閲覧は管理者ロール限定**という制約は仕様。現状 RLS が `user_metadata` 参照で実質機能していない（`docs/PROJECT_STATUS.md` §5-4）ため、ここは要修正。

---

## 3. 技術上の確定事項

- **`middleware.ts` の `getUser()` は削除禁止。** セッション断絶（突然の 403）を防ぐ要。
  - Antigravity 時代の `mieno-development-rules.md` は「`middleware.ts` 廃止 → `proxy.ts`」と書いているが、
    PR #122 でこれは**覆っており、現行は `middleware.ts` が正**。ルール文書のほうが古い。
- **Gemini のファイル添付は `GoogleAIFileManager` を使わない。**
  リモートアップロードがタイミング問題を起こし「通信エラーが発生しました」の原因になった。
  → `arrayBuffer` を直接 base64 エンコードしてインラインで渡す方式に変更して解決（コミット `a4fe858`）。
- Gemini のモデル名は `gemini-1.5-pro` → `2.5-pro` → `3.6-flash` と試行錯誤した経緯あり。
  現在の既定は **`gemini-3.6-flash`**。

---

## 4. 履歴の所在（次回以降のため）

Antigravity の会話ログはローカルの以下に SQLite で保存されている（リモート実行環境からは見えない）:

```
~/.gemini/antigravity/conversations/*.db          # 現行版
~/.gemini/antigravity-ide/conversations/*.pb      # 旧版（圧縮されており平文抽出は不可）
```

| ファイル | 内容 |
|---|---|
| `9dccd36d-….db`（158MB） | **mieno-syoukai 本体**。AI Tactical Advisor 開発〜RSVP UI 改修まで |
| `d9a69bfb-….db`（30MB） | 別件（Raspberry Pi 自宅サーバー / Discord Bot / シフト表 OCR）。本プロジェクトとは無関係 |
| `6bb46d29` / `e1bac1a9` / `a6ad10c7` / `d63ff3df` | 断片的・別件 |

抽出方法:

```bash
sqlite3 "file:$HOME/.gemini/antigravity/conversations/9dccd36d-0a1f-4b3e-8dfa-25d99cd7ee5c.db?mode=ro&immutable=1" \
  "select idx, step_payload from steps where step_type=23 order by idx;"
```

`step_payload` は protobuf。`step_type` の対応は概ね次のとおり:
`23`=ユーザー発言／セッション要約, `5`=`write_to_file`, `8`=`view_file`, `21`=`run_command`, `7`=`grep_search`, `38`=MCP ツール呼び出し。
