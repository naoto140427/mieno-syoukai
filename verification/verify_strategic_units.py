from playwright.sync_api import sync_playwright
import time

def verify_strategic_units():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        try:
            print("Navigating to homepage...")
            page.goto("http://localhost:3000")
            page.wait_for_load_state("networkidle")

            # Scroll to trigger animations
            print("Scrolling to trigger animations...")
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(2) # Wait for animations

            # Verify Unit 1: GB350 (2023)
            print("Verifying Unit 1: GB350...")
            assert page.get_by_text("GB350 (2023)").is_visible()
            assert page.get_by_text("本質は、飾らない。The Classic Authority.").is_visible()

            # Verify Unit 2: CBR600RR (2020) & Monkey 125
            print("Verifying Unit 2: CBR600RR & Monkey 125...")
            # Note: The text might be split or partial match needed depending on rendering
            assert page.get_by_text("CBR600RR (2020) & Monkey 125").is_visible()
            assert page.get_by_text("加速する情熱、緻密な機動力。Speed & Agility.").is_visible()

            # Verify Unit 3: YZF-R3 (2025)
            print("Verifying Unit 3: YZF-R3...")
            assert page.get_by_text("YZF-R3 (2025)").is_visible()
            assert page.get_by_text("未来を、追い越していく。Define the Next Standard.").is_visible()

            # Verify Unit 4: CBR400R (2020) & SERENA LUXION (2025) - Watanabe
            print("Verifying Unit 4: CBR400R...")
            # Check initial state (2-Wheel Mode)
            assert page.get_by_text("CBR400R (2020)").is_visible()
            assert page.get_by_text("すべての道を、統治する。The Core of Operations.").is_visible()

            # Verify Toggle Button exists
            print("Verifying Toggle Button...")
            command_center_btn = page.get_by_role("button", name="Command Center")
            assert command_center_btn.is_visible()

            # Click Toggle Button to switch to SERENA
            print("Clicking 'Command Center' button...")
            command_center_btn.click()
            time.sleep(1) # Wait for transition

            # Verify SERENA content appears
            print("Verifying SERENA content...")
            assert page.get_by_text("SERENA LUXION (2025)").is_visible()
            # The description should change
            assert page.get_by_text("組織全体を支える移動司令基地（ProPILOT 2.0搭載）").is_visible()

            print("All Strategic Units verified successfully!")

            # Take a screenshot
            page.screenshot(path="verification/strategic_units_verified.png", full_page=True)
            print("Screenshot saved to verification/strategic_units_verified.png")

        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error_screenshot.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_strategic_units()
