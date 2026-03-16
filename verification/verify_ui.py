from playwright.sync_api import sync_playwright, expect
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 800})
    page = context.new_page()

    # 1. Careers Page Verification
    print("Navigating to Careers page...")
    page.goto('http://localhost:3000/careers')
    page.wait_for_timeout(2000) # Wait for animation
    page.screenshot(path='verification/careers_hero.png')

    # Scroll down to reveal text
    page.evaluate('window.scrollTo(0, 1000)')
    page.wait_for_timeout(1000)
    page.screenshot(path='verification/careers_content.png')

    # 2. Admin Dashboard Verification (Mock Auth)
    print("Navigating to Admin Dashboard...")
    # Mock supabase auth to trick the server component / client into thinking we're logged in
    # Actually, server component checks cookies. We need to set a valid session cookie,
    # but that's hard to mock for a real Supabase server client without the actual secret.
    # Alternatively, we can just screenshot the Contact page and Admin Login.

    # 3. Contact Page
    print("Navigating to Contact page...")
    page.goto('http://localhost:3000/contact')
    page.wait_for_timeout(1000)
    page.screenshot(path='verification/contact.png')

    # 4. Admin Login
    print("Navigating to Admin Login...")
    page.goto('http://localhost:3000/admin')
    page.wait_for_timeout(1000)
    page.screenshot(path='verification/admin_login.png')

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
