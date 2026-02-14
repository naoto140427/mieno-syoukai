import os
from playwright.sync_api import sync_playwright, expect

def test_mieno_ecosystem():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            print("Navigating to home page...")
            page.goto("http://localhost:3000")

            # ページがロードされるまで待機
            page.wait_for_load_state("networkidle")

            print("Checking for Mieno Ecosystem section...")
            # セクションのヘッダーを確認
            header = page.get_by_role("heading", name="Mieno Ecosystem")
            expect(header).to_be_visible()

            # 各サービスのカードが存在するか確認
            services = [
                "Mieno Drive",
                "Mieno Intelligence",
                "Intercom SharePlay",
                "Mieno Vision",
                "Mieno Private",
                "Mieno Care+"
            ]

            for service in services:
                print(f"Checking for service: {service}")
                # headingレベル3で絞り込む
                locator = page.get_by_role("heading", name=service)
                # スクロールして表示させる（Framer Motionのトリガーのため）
                locator.scroll_into_view_if_needed()
                # アニメーション待機
                page.wait_for_timeout(500)
                expect(locator).to_be_visible()

            # 全体のスクリーンショットを撮影
            print("Taking screenshot...")

            screenshot_path = "verification/mieno_ecosystem.png"
            os.makedirs("verification", exist_ok=True)
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"Screenshot saved to {screenshot_path}")

        except Exception as e:
            print(f"Test failed: {e}")
            # 失敗時もスクリーンショットを撮る
            page.screenshot(path="verification/error_screenshot.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    test_mieno_ecosystem()
