from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})

    # 1. Verify Strategic Units Toggles
    print("Navigating to Units page...")
    try:
        page.goto("http://localhost:3000/units")
    except Exception as e:
        print(f"Failed to load page: {e}")
        browser.close()
        return

    # Check Watanabe's Toggle
    print("Checking Watanabe's Toggle...")
    # Using specific text for buttons
    if page.get_by_role("button", name="2-Wheel Mode").is_visible():
        print("Found Watanabe's Primary Toggle")
        page.get_by_role("button", name="Command Center").click()
        time.sleep(1) # Wait for animation

        # Check specific heading
        if page.get_by_role("heading", name="SERENA LUXION").is_visible():
            print("Successfully toggled to Serena Luxion")
        else:
            print("Failed to toggle to Serena Luxion")
    else:
        print("Watanabe's toggle not found")

    # Check Suemori's Toggle
    print("Checking Suemori's Toggle...")
    # Scroll down if needed, but playwright usually handles it.

    if page.get_by_role("button", name="Main Unit (Track)").is_visible():
        print("Found Suemori's Primary Toggle")
        page.get_by_role("button", name="City Commuter").click()
        time.sleep(1)

        if page.get_by_role("heading", name="Monkey 125").is_visible():
            print("Successfully toggled to Monkey 125")
        else:
            print("Failed to toggle to Monkey 125")
    else:
        print("Suemori's toggle not found")

    page.screenshot(path="verification/units_toggles.png")


    # 2. Verify Services Page
    print("Navigating to Services page...")
    page.goto("http://localhost:3000/services")
    time.sleep(1)

    # Check for specific headings or text unique to the new content
    if page.get_by_text("次世代モビリティ運用").first.is_visible() and \
       page.get_by_text("戦略的ロジスティクス").first.is_visible() and \
       page.get_by_text("デジタル基盤開発").first.is_visible():
        print("Found all 3 Services")
    else:
        print("Services missing")

    page.screenshot(path="verification/services_page.png")


    # 3. Verify History Page
    print("Navigating to History page...")
    page.goto("http://localhost:3000/history")
    time.sleep(1)

    if page.get_by_text("Phase 01").first.is_visible() and \
       page.get_by_text("Phase 02").first.is_visible() and \
       page.get_by_text("Phase 03").first.is_visible():
        print("Found all 3 History Phases")
    else:
        print("History phases missing")

    page.screenshot(path="verification/history_page.png")

    browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
