from playwright.sync_api import sync_playwright, expect
import time

def verify_ux_legal():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        try:
            # 1. Verify Admin UX
            print("Navigating to Admin...")
            page.goto("http://localhost:3000/admin")

            # Login
            page.fill("input[placeholder*='ID']", "cto")
            page.fill("input[type='password']", "password")
            page.click("button[type='submit']")

            # Wait for dashboard
            expect(page.get_by_text("Asset Status Update")).to_be_visible()

            # Test Asset Form
            print("Testing Asset Form Reset & Disable...")
            odometer_input = page.locator("input[placeholder*='Example: 12500']")
            odometer_input.fill("99999")

            # Use a more stable locator
            submit_btn = page.locator("button[type='submit']")

            print("Clicking submit...")
            submit_btn.click()

            # Debug: Check if spinner appears
            # If loading is true, the button content changes to a spinner div
            # and the text "ステータスを更新" disappears.

            # Check if loading state is applied
            # We expect the button to be disabled
            expect(submit_btn).to_be_disabled(timeout=2000)
            print("Button is disabled (Loading state active).")

            # Wait for success (mock API takes 1000ms)
            time.sleep(1.5)

            # Check reset
            expect(odometer_input).to_have_value("")
            expect(odometer_input).not_to_be_disabled()
            print("Admin Form UX verified.")

            # 2. Verify Contact Validation
            print("Navigating to Contact...")
            page.goto("http://localhost:3000/contact")

            name_input = page.locator("input[name='name']")
            email_input = page.locator("input[name='email']")
            subject_select = page.locator("select[name='subject']")
            message_input = page.locator("textarea[name='message']")
            submit_contact = page.locator("button[type='submit']")

            # Fill valid data except email
            name_input.fill("Test User")
            subject_select.select_option("other")
            message_input.fill("Test message")

            # Invalid Email
            email_input.fill("invalid-email")
            expect(submit_contact).to_be_disabled()
            print("Contact: Invalid email disables button.")

            # Valid Email
            email_input.fill("test@example.com")
            expect(submit_contact).not_to_be_disabled()
            print("Contact: Valid email enables button.")

            # 3. Verify Legal Pages
            print("Verifying Legal Pages...")
            page.goto("http://localhost:3000/legal/terms")
            expect(page.locator("h1")).to_contain_text("利用規約")
            expect(page.locator("p", has_text="Terms of Service")).to_be_visible()

            page.goto("http://localhost:3000/legal/privacy")
            expect(page.locator("h1")).to_contain_text("プライバシーポリシー")
            expect(page.locator("p", has_text="Privacy Policy")).to_be_visible()
            print("Legal pages verified.")

            # 4. Verify Footer Links
            print("Verifying Footer Links...")
            page.goto("http://localhost:3000")
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(1)

            # Click Privacy Policy
            # Note: opens in same tab?
            with page.expect_navigation(url="**/legal/privacy"):
                page.get_by_role("link", name="プライバシーポリシー").click()

            print("Footer Privacy Policy link verified.")

        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/ux_failure.png")
            raise

        browser.close()

if __name__ == "__main__":
    verify_ux_legal()
