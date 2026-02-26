from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Go to the Doctrine page
    print("Navigating to /doctrine...")
    page.goto("http://localhost:3000/doctrine")

    # Wait for key elements to be visible
    print("Waiting for content to load...")
    expect(page.get_by_role("heading", name="三重野")).to_be_visible()
    expect(page.get_by_text("Chief Executive Officer")).to_be_visible()
    expect(page.get_by_text("DOCTRINE")).to_be_visible()

    # Take a screenshot
    print("Taking screenshot...")
    page.screenshot(path="verification/doctrine_page.png", full_page=True)

    browser.close()
    print("Verification complete.")

with sync_playwright() as playwright:
    run(playwright)
