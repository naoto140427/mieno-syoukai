import os
from playwright.sync_api import sync_playwright, expect

def test_performance_report():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # デスクトップ表示のテスト
        print("Starting Desktop Test...")
        context_desktop = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context_desktop.new_page()

        try:
            print("Navigating to home page (Desktop)...")
            page.goto("http://localhost:3000")
            page.wait_for_load_state("domcontentloaded")

            print("Checking for IR Information section...")
            ir_header = page.get_by_role("heading", name="IR Information")
            ir_header.scroll_into_view_if_needed()
            expect(ir_header).to_be_visible()

            # 各KPIの確認
            kpis = [
                "総インフラ踏破距離 (Total Mileage)",
                "地域経済への直接投資 (Soft Cream Consumption)",
                "ステークホルダー・エンゲージメント (Yae Response Rate)",
                "戦略的アセット投資 (Tire Replacement)"
            ]

            for kpi in kpis:
                print(f"Checking for KPI: {kpi}")
                locator = page.get_by_text(kpi).first
                locator.scroll_into_view_if_needed()
                # アニメーション待機
                page.wait_for_timeout(500)
                expect(locator).to_be_visible()

            # アニメーション完了後の状態を確認するために少し待つ
            page.wait_for_timeout(1000)

            print("Taking desktop screenshot...")
            os.makedirs("verification", exist_ok=True)
            page.screenshot(path="verification/performance_desktop.png", full_page=True)
            print("Desktop screenshot saved.")

        except Exception as e:
            print(f"Desktop Test failed: {e}")
            page.screenshot(path="verification/error_performance_desktop.png")
            raise e
        finally:
            context_desktop.close()

        # モバイル表示のテスト
        print("Starting Mobile Test...")
        context_mobile = browser.new_context(viewport={"width": 375, "height": 812})
        page_mobile = context_mobile.new_page()

        try:
            print("Navigating to home page (Mobile)...")
            page_mobile.goto("http://localhost:3000")
            page_mobile.wait_for_load_state("domcontentloaded")

            ir_header_mobile = page_mobile.get_by_role("heading", name="IR Information")
            ir_header_mobile.scroll_into_view_if_needed()
            expect(ir_header_mobile).to_be_visible()

            # モバイルで最初のKPIを確認
            first_kpi = page_mobile.get_by_text("総インフラ踏破距離").first
            first_kpi.scroll_into_view_if_needed()
            page_mobile.wait_for_timeout(500)

            print("Taking mobile screenshot...")
            page_mobile.screenshot(path="verification/performance_mobile.png", full_page=True)
            print("Mobile screenshot saved.")

        except Exception as e:
            print(f"Mobile Test failed: {e}")
            page_mobile.screenshot(path="verification/error_performance_mobile.png")
            raise e
        finally:
            context_mobile.close()
            browser.close()

if __name__ == "__main__":
    test_performance_report()
