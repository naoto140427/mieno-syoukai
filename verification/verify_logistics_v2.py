from playwright.sync_api import sync_playwright
import time
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create a new context with a larger viewport for better screenshot
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        print("Navigating to http://localhost:3000/logistics...")
        try:
            page.goto("http://localhost:3000/logistics")
        except Exception as e:
            print(f"Error navigating: {e}")
            return

        print("Waiting for network idle...")
        page.wait_for_load_state("networkidle")

        # Wait for animations to complete (approx 6 seconds based on implementation)
        # Map: ~2s, Route: ~3s + delay, Marker: ~4.5s
        print("Waiting 6 seconds for animation to complete...")
        time.sleep(6)

        # Check for key text elements to verify content update
        # Check for "Logistics Operations" heading (Target h2 specifically to avoid footer link ambiguity)
        if page.locator("h2").filter(has_text="Logistics Operations").is_visible():
            print("VERIFICATION SUCCESS: 'Logistics Operations' found.")
        else:
            print("VERIFICATION FAILURE: 'Logistics Operations' not found.")

        # Check for "Yuru-Camp" text
        if page.locator("text=Yuru-Camp").is_visible():
            print("VERIFICATION SUCCESS: 'Yuru-Camp' found.")
        else:
            print("VERIFICATION FAILURE: 'Yuru-Camp' not found.")

        # Check for "SERENA LUXION" text
        if page.locator("text=SERENA LUXION").is_visible():
            print("VERIFICATION SUCCESS: 'SERENA LUXION' found.")
        else:
            print("VERIFICATION FAILURE: 'SERENA LUXION' not found.")

        # Take a full page screenshot
        screenshot_path = "verification/logistics_v2.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    run()
