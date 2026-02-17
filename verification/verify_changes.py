from playwright.sync_api import sync_playwright, expect
import time

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        print("Navigating to home page...")
        page.goto("http://localhost:3000")

        # Verify Footer
        print("Verifying Footer...")
        # Scroll to bottom
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(2)

        footer = page.locator("footer")
        expect(footer).to_contain_text("機動戦力")
        expect(footer).to_contain_text("広域兵站")
        expect(footer).to_contain_text("Miyagawachi Base, Oita, Japan")

        page.screenshot(path="verification/footer_verification.png")
        print("Footer verified and screenshot taken.")

        # Verify Admin Page
        print("Navigating to Admin page...")
        page.goto("http://localhost:3000/admin")
        time.sleep(2)

        # Check Login UI text
        # Use specific text locators
        expect(page.get_by_text("メンバーID")).to_be_visible()
        expect(page.get_by_text("システム認証")).to_be_visible()
        expect(page.get_by_text("※関係者以外アクセス禁止")).to_be_visible()

        page.screenshot(path="verification/admin_login_verification.png")
        print("Admin Login UI verified and screenshot taken.")

        # Verify Easter Egg
        print("Verifying Easter Egg...")
        # The title is "MIENO CORP."
        # Note: There might be multiple "MIENO CORP." if Header is present.
        # But Admin page has its own H1.
        # Let's locate the H1 specifically.
        title = page.locator("h1", has_text="MIENO CORP.").first

        # Click 5 times rapidly
        for i in range(5):
            title.click()
            time.sleep(0.1)

        # Check for modal content
        # The modal has text "[TOP SECRET / CLASSIFIED]"
        modal_content = page.get_by_text("[TOP SECRET / CLASSIFIED]")
        expect(modal_content).to_be_visible(timeout=5000)

        page.screenshot(path="verification/admin_easter_egg_verification.png")
        print("Easter Egg verified and screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_changes()
