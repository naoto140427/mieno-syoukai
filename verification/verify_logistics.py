from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the page
        page.goto("http://localhost:3000/logistics")

        # Wait for the page to load
        page.wait_for_load_state("networkidle")

        # Scroll to the logistics section
        logistics_section = page.locator("#logistics")
        logistics_section.scroll_into_view_if_needed()

        # Wait for animations to complete (approx 4 seconds based on implementation)
        # Map: ~2.3s, Route: ~3.5s, Marker: ~3.5s
        time.sleep(5)

        # Take a screenshot of the logistics section
        logistics_section.screenshot(path="verification/logistics_section.png")

        browser.close()

if __name__ == "__main__":
    run()
