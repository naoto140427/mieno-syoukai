import sys
from playwright.sync_api import sync_playwright

def verify_ux_fixes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile Context
        mobile_context = browser.new_context(viewport={"width": 375, "height": 667})
        mobile_page = mobile_context.new_page()

        print("Verifying Header Mobile Menu...")
        try:
            mobile_page.goto("http://localhost:3000/")
            mobile_page.wait_for_selector("nav")

            # Check for hamburger menu
            menu_button = mobile_page.locator("button span:text('Open main menu')").locator("..") # Parent of span
            if not menu_button.is_visible():
                print("FAIL: Mobile menu button not found.")
                sys.exit(1)

            print("  - Mobile menu button found.")
            menu_button.click()

            # Check for overlay content
            mobile_page.wait_for_selector("text=Quick Actions")
            print("  - Menu overlay opened (Quick Actions found).")

            # Check close button
            close_button = mobile_page.locator("button span:text('Close menu')").locator("..")
            close_button.click()

            # Wait for overlay to disappear
            mobile_page.wait_for_selector("text=Quick Actions", state="hidden")
            print("  - Menu overlay closed.")
            print("SUCCESS: Mobile Header Verification Passed.")

        except Exception as e:
            print(f"FAIL: Header Verification Error: {e}")
            sys.exit(1)

        # Desktop Context for Contact Form (or Mobile, doesn't matter much for logic, but let's use Desktop)
        desktop_context = browser.new_context(viewport={"width": 1280, "height": 720})
        contact_page = desktop_context.new_page()

        print("\nVerifying Contact Form Validation...")
        try:
            contact_page.goto("http://localhost:3000/contact")

            # Locate submit button
            submit_btn = contact_page.locator("button[type='submit']")

            # Check initially disabled
            if not submit_btn.is_disabled():
                print("FAIL: Submit button should be disabled initially.")
                sys.exit(1)
            print("  - Submit button is correctly disabled initially.")

            # Fill form
            contact_page.fill("#name", "Test User")
            contact_page.fill("#asset", "Test Bike") # Optional but filling anyway
            contact_page.select_option("#type", "other")
            contact_page.fill("#message", "This is a test message.")

            # Check enabled
            if submit_btn.is_disabled():
                print("FAIL: Submit button should be enabled after valid input.")
                sys.exit(1)
            print("  - Submit button is enabled after valid input.")

            print("SUCCESS: Contact Form Verification Passed.")

        except Exception as e:
            print(f"FAIL: Contact Form Verification Error: {e}")
            sys.exit(1)

        browser.close()

if __name__ == "__main__":
    verify_ux_fixes()
