# プレビューのブラウザ確認

GitHub Actions の標準 Ubuntu ランナーで、Vercel が現在の `preview` コミットの Preview デプロイ成功を通知したときに実行します。対象 URL は `https://preview.mieno-shokai.com` 固定です。トップ、機動戦力、広域兵站、お問い合わせの4ページについて、Chromium で HTTP 200、遷移先、ページタイトル、メイン領域の表示を確認します。フォームの送信やログインは行いません。

- 成功時は通過ページ数のみ出力します。失敗時は **Preview Browser Check → Check public pages on the preview domain** のログを確認します。検証結果を Codex に渡す場合は、まず失敗行だけで十分です。
- ワークフローと検証スクリプトを変更する `preview` 宛て PR では、マージ前にスクリプトの構文を確認します。ブラウザ確認はデプロイ成功後のため、PR の必須チェックにはしません。
- プレビューがメンテナンス中で HTTP 503 の場合や、Vercel のログイン画面へ転送された場合は、アプリ本体を確認できていないため失敗とします。認証付きのプレビューで自動確認を有効にする方法は、復旧作業で決める検証環境と合わせて選びます。公開設定を緩める必要はありません。

手動で同じプレビュードメインを確認する場合は、依存パッケージを用意して下記を実行します。Mac に Chrome が入っていれば Chromium の追加ダウンロードは不要です。

```sh
PLAYWRIGHT_CHANNEL=chrome node scripts/check-preview.mjs
```
