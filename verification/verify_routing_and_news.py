from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Verify Homepage (News Section)
        try:
            page.goto("http://localhost:3000")
            page.wait_for_load_state("networkidle")

            news_section = page.locator("#news")
            if news_section.is_visible():
                print("SUCCESS: News section is visible on homepage.")
            else:
                print("FAILURE: News section is NOT visible on homepage.")

            # Verify News Items
            # The structure is #news -> div -> div -> div (items)
            # We look for links inside #news
            news_items = page.locator("#news a[href]")
            count = news_items.count()
            # Expecting at least 3 items + "View All" link = 4
            if count >= 3:
                 print(f"SUCCESS: Found {count} news links (items + view all).")
            else:
                 print(f"FAILURE: Found only {count} news links, expected at least 3.")

            # 2. Verify Footer Links
            # Check for Strategic Units link
            units_link = page.locator("footer a:has-text('Strategic Units')")
            if units_link.count() > 0:
                href = units_link.first.get_attribute("href")
                if href == "/units":
                    print("SUCCESS: Footer link 'Strategic Units' points to /units.")
                else:
                    print(f"FAILURE: Footer link 'Strategic Units' points to {href}.")
            else:
                 print("FAILURE: Footer link 'Strategic Units' not found.")

            # 3. Verify Strategic Units Page (View Details Button)
            page.goto("http://localhost:3000/units")
            page.wait_for_load_state("networkidle")

            view_details_link = page.locator("a:has-text('View Details')")
            if view_details_link.count() > 0:
                href = view_details_link.first.get_attribute("href")
                if href == "/logistics":
                    print("SUCCESS: 'View Details' link points to /logistics.")
                else:
                    print(f"FAILURE: 'View Details' link points to {href}.")
            else:
                print("FAILURE: 'View Details' link not found.")

            # Take screenshots
            page.goto("http://localhost:3000")
            # Wait for animations
            page.wait_for_timeout(2000)
            page.screenshot(path="verification/verification_news_section.png", full_page=True)

        except Exception as e:
            print(f"ERROR: {e}")

        browser.close()

if __name__ == "__main__":
    run()
