from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Verify Doctrine Page
        print("Navigating to /doctrine...")
        page.goto("http://localhost:3000/doctrine")
        page.wait_for_timeout(2000) # Wait for animations

        # Take screenshot of the top
        page.screenshot(path="verification/doctrine_top.png")
        print("Screenshot saved: verification/doctrine_top.png")

        # Scroll down to see core values
        page.evaluate("window.scrollBy(0, 1000)")
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/doctrine_middle.png")
        print("Screenshot saved: verification/doctrine_middle.png")

        # 2. Verify Footer Link
        print("Navigating to /...")
        page.goto("http://localhost:3000/")

        # Scroll to bottom
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(1000)

        # Check for link
        link = page.get_by_role("link", name="Doctrine (CEO Message)")
        if link.is_visible():
            print("Doctrine link found in footer.")
        else:
            print("Doctrine link NOT found in footer.")

        page.screenshot(path="verification/footer_link.png")
        print("Screenshot saved: verification/footer_link.png")

        browser.close()

if __name__ == "__main__":
    run()
