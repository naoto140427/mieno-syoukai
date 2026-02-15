from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Test Home Page
        print("Visiting Home Page...")
        page.goto("http://localhost:3000")
        page.wait_for_selector("text=MIENO CORP.") # Header check
        page.wait_for_selector("text=変革の風を、二輪で切り裂く。") # Hero check
        page.screenshot(path="verification/verification_navigation_home.png")

        # Check Navigation Links
        print("Checking Navigation Links...")
        header = page.locator("nav[aria-label='Global']")

        units_link = header.get_by_role("link", name="Strategic Units")

        # Test Navigation to Units
        print("Navigating to Units...")
        units_link.click()
        page.wait_for_url("http://localhost:3000/units")
        page.wait_for_selector("text=Power. Precision. Prestige.")
        page.screenshot(path="verification/verification_navigation_units.png")

        print("Navigation Test Passed!")
        browser.close()

if __name__ == "__main__":
    run()
