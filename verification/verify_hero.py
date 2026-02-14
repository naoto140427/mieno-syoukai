from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # ビューポートを少し大きめにして全体が見えるようにする
        page = browser.new_page(viewport={"width": 1440, "height": 1080})

        try:
            print("Navigating to homepage...")
            page.goto("http://localhost:3000", wait_until="networkidle")

            print("Waiting for Hero content...")
            # アニメーションがあるため、少し待つ
            page.wait_for_timeout(2000)

            print("Checking Hero Text...")
            h1 = page.get_by_role("heading", level=1)
            if h1.is_visible():
                text = h1.inner_text()
                print(f"Hero H1 is visible: {text}")
                if "変革の風を、二輪で切り裂く。" in text:
                    print("Hero H1 text matches.")
                else:
                    print(f"Hero H1 text mismatch: {text}")
            else:
                print("Hero H1 is NOT visible.")

            print("Taking screenshot...")
            page.screenshot(path="verification/hero_section.png", full_page=False)
            print("Screenshot saved to verification/hero_section.png")

        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
