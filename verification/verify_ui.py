from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Base URL
        base_url = "http://localhost:3000"

        # 1. Header (Home)
        print("Navigating to Home...")
        try:
            page.goto(base_url)
            page.wait_for_load_state("domcontentloaded")
            time.sleep(3)
            expect(page.get_by_role("link", name="機動戦力")).to_be_visible()
            expect(page.get_by_role("link", name="広域兵站")).to_be_visible()
            print("Verified Header text.")
            page.screenshot(path="verification/header.png")
        except Exception as e:
            print(f"Error home: {e}")

        # 2. Logistics
        print("Navigating to Logistics...")
        try:
            page.goto(f"{base_url}/logistics")
            page.wait_for_load_state("domcontentloaded")
            time.sleep(3)
            # Check for "広域展開作戦"
            expect(page.get_by_text("広域展開作戦")).to_be_visible()
            expect(page.get_by_text("LOGISTICS")).to_be_visible()
            print("Verified Logistics text.")
            page.screenshot(path="verification/logistics.png")
        except Exception as e:
            print(f"Error logistics: {e}")

        # 3. Inventory
        print("Navigating to Inventory...")
        try:
            page.goto(f"{base_url}/inventory")
            page.wait_for_load_state("domcontentloaded")
            time.sleep(3)
            expect(page.get_by_role("heading", name="資材・備品管理")).to_be_visible()
            expect(page.get_by_role("heading", name="消耗品在庫")).to_be_visible()
            print("Verified Inventory text.")
            page.screenshot(path="verification/inventory.png")
        except Exception as e:
            print(f"Error inventory: {e}")

        # 4. Archives
        print("Navigating to Archives...")
        try:
            page.goto(f"{base_url}/archives")
            page.wait_for_load_state("domcontentloaded")
            time.sleep(3)
            expect(page.get_by_role("heading", name="作戦記録保管庫")).to_be_visible()
            print("Verified Archives text.")
            page.screenshot(path="verification/archives.png")
        except Exception as e:
            print(f"Error archives: {e}")

        # 5. Units
        print("Navigating to Units...")
        try:
            page.goto(f"{base_url}/units")
            page.wait_for_load_state("domcontentloaded")
            time.sleep(3)
            expect(page.get_by_role("heading", name="機動戦力")).to_be_visible()
            expect(page.get_by_text("力・精度・威信")).to_be_visible()
            print("Verified Units text.")
            page.screenshot(path="verification/units.png")
        except Exception as e:
            print(f"Error units: {e}")

        browser.close()

if __name__ == "__main__":
    run()
