from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Verify Doctrine Page CEO Block
        print("Navigating to /doctrine...")
        page.goto("http://localhost:3000/doctrine")
        page.wait_for_timeout(2000) # Wait for animations

        # Scroll to bottom
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(1000)

        # Screenshot the bottom area where CEO block should be
        page.screenshot(path="verification/doctrine_ceo_block.png")
        print("Screenshot saved: verification/doctrine_ceo_block.png")

        # 2. Verify Footer Localization
        print("Navigating to /...")
        page.goto("http://localhost:3000/")

        # Scroll to bottom
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(1000)

        # Check for localized headers
        headers = ["事業概要", "情報公開", "企業情報", "法的情報"]
        found_headers = []
        for h in headers:
            if page.get_by_role("heading", name=h).is_visible():
                found_headers.append(h)

        print(f"Found localized headers: {found_headers}")

        # Check for updated link
        link = page.get_by_role("link", name="基本理念 (CEO Message)")
        if link.is_visible():
            print("Localized Doctrine link found.")
        else:
            print("Localized Doctrine link NOT found.")

        page.screenshot(path="verification/footer_localized.png")
        print("Screenshot saved: verification/footer_localized.png")

        browser.close()

if __name__ == "__main__":
    run()
