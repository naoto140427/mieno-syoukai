from playwright.sync_api import sync_playwright, expect
import time

def verify_admin_access():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # 1. Verify Header Link
        print("Navigating to Home...")
        page.goto("http://localhost:3000")

        print("Verifying Admin link in Header...")
        admin_link = page.get_by_role("link", name="管理コンソール")
        expect(admin_link).to_be_visible()

        print("Clicking Admin link...")
        with page.expect_navigation(url="**/admin"):
            admin_link.click()

        print("Navigation to Admin verified.")

        # 2. Verify Root Access Button
        print("Verifying Root Access Button...")
        # The button has text "[ ROOT ACCESS ]"
        root_btn = page.get_by_text("[ ROOT ACCESS ]")
        expect(root_btn).to_be_visible()

        print("Clicking Root Access Button...")
        root_btn.click()

        # Check for modal content
        modal_content = page.get_by_text("[TOP SECRET / CLASSIFIED]")
        expect(modal_content).to_be_visible(timeout=5000)

        print("Root Access Modal verified.")

        # Take screenshot
        page.screenshot(path="verification/admin_root_access.png")

        browser.close()

if __name__ == "__main__":
    verify_admin_access()
