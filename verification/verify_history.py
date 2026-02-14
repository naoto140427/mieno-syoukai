import os
from playwright.sync_api import sync_playwright, expect

def test_history_section():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # デスクトップ表示のテスト
        print("Starting Desktop Test...")
        context_desktop = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context_desktop.new_page()

        try:
            print("Navigating to home page (Desktop)...")
            page.goto("http://localhost:3000")
            # domcontentloadedまで待機
            page.wait_for_load_state("domcontentloaded")

            print("Checking for History section...")
            history_header = page.get_by_role("heading", name="Our History")
            history_header.scroll_into_view_if_needed()
            expect(history_header).to_be_visible()

            # 各年代の確認
            years = ["2020年以前", "2021年", "2023年", "2024年", "2026年2月"]
            for year in years:
                print(f"Checking for year: {year}")
                # テキストを含む要素を探す
                locator = page.get_by_text(year).first
                locator.scroll_into_view_if_needed()
                # アニメーション待機
                page.wait_for_timeout(500)
                expect(locator).to_be_visible()

            print("Taking desktop screenshot...")
            os.makedirs("verification", exist_ok=True)
            page.screenshot(path="verification/history_desktop.png", full_page=True)
            print("Desktop screenshot saved.")

        except Exception as e:
            print(f"Desktop Test failed: {e}")
            page.screenshot(path="verification/error_history_desktop.png")
            raise e
        finally:
            context_desktop.close()

        # モバイル表示のテスト
        print("Starting Mobile Test...")
        context_mobile = browser.new_context(viewport={"width": 375, "height": 667})
        page_mobile = context_mobile.new_page()

        try:
            print("Navigating to home page (Mobile)...")
            page_mobile.goto("http://localhost:3000")
            page_mobile.wait_for_load_state("domcontentloaded")

            history_header_mobile = page_mobile.get_by_role("heading", name="Our History")
            history_header_mobile.scroll_into_view_if_needed()
            expect(history_header_mobile).to_be_visible()

            # モバイルでも年代が表示されるか確認
            # 最初の1つだけ確認してスクロールさせる
            first_year = page_mobile.get_by_text("2020年以前").first
            first_year.scroll_into_view_if_needed()
            page_mobile.wait_for_timeout(500)

            print("Taking mobile screenshot...")
            page_mobile.screenshot(path="verification/history_mobile.png", full_page=True)
            print("Mobile screenshot saved.")

        except Exception as e:
            print(f"Mobile Test failed: {e}")
            page_mobile.screenshot(path="verification/error_history_mobile.png")
            raise e
        finally:
            context_mobile.close()
            browser.close()

if __name__ == "__main__":
    test_history_section()
