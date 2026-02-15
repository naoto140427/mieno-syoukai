from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 1000})
        page = context.new_page()

        print("Navigating to http://localhost:3000/contact...")
        try:
            page.goto("http://localhost:3000/contact")
        except Exception as e:
            print(f"Error navigating: {e}")
            return

        print("Waiting for network idle...")
        page.wait_for_load_state("networkidle")

        # Fill out the form
        print("Filling out form...")
        page.fill("#name", "Test User")
        page.fill("#asset", "Test Bike 1000RR")
        page.select_option("#type", "touring")
        page.fill("#message", "This is a test inquiry for the new contact form.")

        # Click submit
        print("Clicking submit...")
        page.click("button[type='submit']")

        # Wait for success message
        print("Waiting for success message...")
        try:
            page.wait_for_selector("text=送信完了", timeout=5000)
            print("VERIFICATION SUCCESS: '送信完了' message appeared.")
        except Exception as e:
            print(f"VERIFICATION FAILURE: '送信完了' message not found. Error: {e}")

        # Take screenshot
        screenshot_path = "verification/contact_page.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    run()
