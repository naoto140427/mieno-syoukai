import sys
from playwright.sync_api import sync_playwright

def take_screenshots():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # 1. Mobile Menu
        mobile_context = browser.new_context(viewport={"width": 375, "height": 667})
        mobile_page = mobile_context.new_page()
        try:
            print("Navigating to Home (Mobile)...")
            mobile_page.goto("http://localhost:3000/")
            mobile_page.wait_for_selector("nav")

            # Open Menu
            menu_button = mobile_page.locator("button span:text('Open main menu')").locator("..")
            menu_button.click()
            mobile_page.wait_for_selector("text=Quick Actions")

            # Screenshot
            mobile_page.screenshot(path="verification/mobile_menu.png")
            print("Saved verification/mobile_menu.png")

        except Exception as e:
            print(f"Error Mobile Menu: {e}")

        # 2. Logistics Map (Mobile)
        try:
            print("Navigating to Logistics (Mobile)...")
            mobile_page.goto("http://localhost:3000/logistics")
            # Scroll down to map
            mobile_page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            mobile_page.wait_for_timeout(2000) # Wait for animation

            mobile_page.screenshot(path="verification/logistics_mobile.png")
            print("Saved verification/logistics_mobile.png")
        except Exception as e:
            print(f"Error Logistics: {e}")

        # 3. Contact Form (Desktop)
        desktop_context = browser.new_context(viewport={"width": 1280, "height": 720})
        contact_page = desktop_context.new_page()
        try:
            print("Navigating to Contact (Desktop)...")
            contact_page.goto("http://localhost:3000/contact")
            contact_page.wait_for_selector("form")
            # Wait for animations
            contact_page.wait_for_timeout(2000)

            # Initial state
            contact_page.screenshot(path="verification/contact_initial.png")
            print("Saved verification/contact_initial.png")

            # Filled state
            contact_page.fill("#name", "Test User")
            contact_page.select_option("#type", "other")
            contact_page.fill("#message", "Test message")
            contact_page.wait_for_timeout(500) # Wait for state update

            contact_page.screenshot(path="verification/contact_filled.png")
            print("Saved verification/contact_filled.png")

        except Exception as e:
            print(f"Error Contact: {e}")

        browser.close()

if __name__ == "__main__":
    take_screenshots()
