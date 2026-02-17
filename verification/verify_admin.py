from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    try:
        # Verify Admin Login & Dashboard
        print("Navigating to Admin...")
        page.goto("http://localhost:3000/admin")
        page.wait_for_selector('input[placeholder="ID (e.g. cto)"]')
        page.fill('input[placeholder="ID (e.g. cto)"]', 'cto')
        page.fill('input[placeholder="••••••••"]', 'password')
        page.click('text=システム認証')
        page.wait_for_selector('text=渡辺 直人') # CTO name
        page.screenshot(path="verification/admin_dashboard.png")
        print("Admin dashboard verified.")

        # Verify Submit Log Tab
        # Use more specific selector to avoid Header/Footer links
        print("Checking Log Tab...")
        # The tabs are buttons in the main area.
        # We can look for the button explicitly.
        page.click('main button:has-text("Log")')
        page.wait_for_selector('text=作戦記録の提出')
        page.screenshot(path="verification/admin_log.png")
        print("Admin Log tab verified.")

        # Verify Inventory Request Tab
        print("Checking Inventory Tab...")
        page.click('main button:has-text("Inventory")')
        page.wait_for_selector('text=備品・資材の申請')
        page.screenshot(path="verification/admin_inventory.png")
        print("Admin Inventory tab verified.")

        # Verify Inventory Page (Public)
        print("Navigating to Inventory...")
        page.goto("http://localhost:3000/inventory")
        try:
            page.wait_for_selector('text=Data Retrieval Failed', timeout=5000)
            print("Inventory page showed error as expected (dummy backend).")
        except:
            print("Inventory page did not show expected error, checking screenshot.")
        page.screenshot(path="verification/inventory_page.png")

        # Verify Archives Page (Public)
        print("Navigating to Archives...")
        page.goto("http://localhost:3000/archives")
        try:
            # Escape valid regex or string
            page.wait_for_selector('.bg-red-900\\/20', timeout=5000)
            print("Archives page showed error UI as expected.")
        except:
            print("Archives page state unknown, checking screenshot.")
        page.screenshot(path="verification/archives_page.png")

    except Exception as e:
        print(f"Error during verification: {e}")
        page.screenshot(path="verification/error_state.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
