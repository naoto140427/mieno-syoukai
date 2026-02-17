from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    # Desktop
    context = browser.new_context(viewport={'width': 1280, 'height': 800})
    page = context.new_page()

    print("Navigating to Serena Luxion (Desktop)...")
    try:
        # Give some time for the server to spin up if it's the first time
        page.goto("http://localhost:3000/units/serena-luxion", timeout=60000)
    except Exception as e:
        print(f"Failed to load page: {e}")
        browser.close()
        return

    # Check Specs Tab (Default)
    page.wait_for_selector("text=機体仕様", state="visible")
    # Wait for animations
    time.sleep(1)
    page.screenshot(path="verification/specs_desktop.png")
    print("Captured Specs Desktop")

    # Check Documents Tab
    page.click("text=マニュアル・書類")
    # Wait for content switch
    time.sleep(0.5)
    page.screenshot(path="verification/docs_desktop.png")
    print("Captured Docs Desktop")

    # Check Maintenance Tab
    page.click("text=整備・運用履歴")
    time.sleep(0.5)
    page.screenshot(path="verification/logs_desktop.png")
    print("Captured Logs Desktop")

    # Mobile View
    context_mobile = browser.new_context(viewport={'width': 375, 'height': 800}, is_mobile=True)
    page_mobile = context_mobile.new_page()
    print("Navigating to GB350 (Mobile)...")
    page_mobile.goto("http://localhost:3000/units/gb350")
    page_mobile.wait_for_selector("text=機体仕様", state="visible")
    time.sleep(1)
    page_mobile.screenshot(path="verification/specs_mobile.png")
    print("Captured Specs Mobile")

    # Check Tabs Scrolling on Mobile
    # Scroll tabs into view
    tabs_container = page_mobile.locator(".overflow-x-auto")
    if tabs_container.is_visible():
        page_mobile.evaluate("document.querySelector('.overflow-x-auto').scrollLeft = 100")
        time.sleep(0.5)
        page_mobile.screenshot(path="verification/mobile_tabs_scrolled.png")

    browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
