from playwright.sync_api import sync_playwright

def verify_navigation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # サイトにアクセス
        print("Navigating to http://localhost:3000")
        try:
            page.goto("http://localhost:3000", timeout=60000)
        except Exception as e:
            print(f"Error navigating: {e}")
            browser.close()
            return

        # ページのロードを待つ
        page.wait_for_load_state("networkidle")

        # 1. Strategic Units セクションの存在確認
        # セクションIDが存在するか
        units_section = page.locator("#units")
        if units_section.count() > 0:
            print("SUCCESS: Strategic Units section found by ID.")
        else:
            print("FAILURE: Strategic Units section not found.")

        # コンテンツが見えているか確認
        # Strategic Units のタイトル "Power. Precision. Prestige." が見えるか
        if page.get_by_text("Power. Precision. Prestige.").is_visible():
            print("SUCCESS: Strategic Units content is visible.")
        else:
            print("FAILURE: Strategic Units content not visible.")

        # 2. ヘッダーリンクのhref確認
        # "Strategic Units" リンクが #units を指しているか
        link = page.get_by_role("link", name="Strategic Units")
        href = link.get_attribute("href")
        if href == "#units":
             print(f"SUCCESS: Header link 'Strategic Units' points to {href}.")
        else:
             print(f"FAILURE: Header link 'Strategic Units' points to {href}, expected '#units'.")

        # 3. スクロールの確認 (簡易的)
        # リンクをクリック
        link.click()
        page.wait_for_timeout(1000) # スクロールのアニメーション待ち

        # URLハッシュが変わったか
        if "#units" in page.url:
            print("SUCCESS: URL updated with hash #units.")
        else:
            print("FAILURE: URL hash did not update.")

        # スクリーンショット撮影 (Strategic Units セクション)
        # スクロール後の位置で撮影
        page.screenshot(path="verification/verification_navigation.png")
        print("Screenshot saved to verification/verification_navigation.png")

        browser.close()

if __name__ == "__main__":
    verify_navigation()
