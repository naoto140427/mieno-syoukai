import sys
import time
from playwright.sync_api import sync_playwright

def verify_layout_and_buttons():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # 1. Verify Hero Layout (Mobile)
        print("Verifying Hero Layout on Mobile...")
        context = browser.new_context(viewport={"width": 375, "height": 667})
        page = context.new_page()

        try:
            page.goto("http://localhost:3000/")
            # Wait for animation
            time.sleep(2)

            # Check for CTA visibility
            cta = page.locator('text=さらに詳しく')
            if cta.is_visible():
                print("SUCCESS: Hero CTA is visible")
            else:
                print("ERROR: Hero CTA is not visible")

            # Screenshot
            page.screenshot(path="verification/hero_mobile.png")
            print("Saved verification/hero_mobile.png")

            # Verify News Link
            print("Scrolling to News section...")
            # Scroll to the bottom to trigger animations
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(2) # Wait for animation (0.6s)

            # Locate the link
            # We look for "View All" specifically to avoid confusion with news items
            news_view_all = page.locator('text=View All').first

            if news_view_all.is_visible():
                # Check href
                href = news_view_all.get_attribute('href')
                if href == '/logistics':
                    print("SUCCESS: News 'View All' link is visible and points to /logistics")
                else:
                    print(f"ERROR: News 'View All' link points to {href}")
            else:
                 print("ERROR: News 'View All' link not visible")

        except Exception as e:
            print(f"Error Hero: {e}")

        context.close()

        # 2. Verify Other Pages Buttons (Desktop)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        pages_to_check = [
            {"url": "http://localhost:3000/units", "check_text": "View Details"},
            {"url": "http://localhost:3000/logistics", "check_text": "ACCESS ASSET DATABASE"},
            {"url": "http://localhost:3000/history", "check_text": "JOIN THE LEGACY"},
            {"url": "http://localhost:3000/ir", "check_text": "Request Detailed Metrics"},
            {"url": "http://localhost:3000/services", "check_text": "Contact Support"},
        ]

        for item in pages_to_check:
            try:
                print(f"Verifying {item['url']}...")
                page.goto(item['url'])
                time.sleep(1)

                button = page.locator(f"text={item['check_text']}").first

                if button.is_visible():
                    print(f"SUCCESS: Button '{item['check_text']}' found on {item['url']}")
                else:
                    print(f"ERROR: Button '{item['check_text']}' NOT found on {item['url']}")

            except Exception as e:
                print(f"Error {item['url']}: {e}")

        browser.close()

if __name__ == "__main__":
    verify_layout_and_buttons()
