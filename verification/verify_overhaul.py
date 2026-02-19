from playwright.sync_api import sync_playwright, expect
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # 1. Dashboard in Kennel
        try:
            page.goto("http://localhost:3000/kennel?tab=dashboard")
            page.wait_for_selector("text=Dashboard", timeout=5000)
            page.screenshot(path="verification/kennel_dashboard.png")
            print("Captured kennel_dashboard.png")
        except Exception as e:
            print(f"Error capturing kennel_dashboard: {e}")

        # 2. Header with Admin Panel and Currency
        try:
            page.goto("http://localhost:3000/")
            page.evaluate("window.localStorage.setItem('game-storage', JSON.stringify({state: {isAdmin: true}}))")
            page.reload()
            page.screenshot(path="verification/header_landing.png")
            print("Captured header_landing.png")
        except Exception as e:
            print(f"Error capturing header_landing: {e}")

        # 3. Quests
        try:
            page.goto("http://localhost:3000/quests")
            # Just wait a bit instead of specific selector if it's failing
            page.wait_for_timeout(2000)
            page.screenshot(path="verification/quests.png")
            print("Captured quests.png")
        except Exception as e:
            print(f"Error capturing quests: {e}")

        # 4. Adoption Shop
        try:
            page.goto("http://localhost:3000/shop/adoption")
            page.wait_for_timeout(2000)
            page.screenshot(path="verification/adoption.png")
            print("Captured adoption.png")
        except Exception as e:
            print(f"Error capturing adoption: {e}")

        browser.close()

if __name__ == "__main__":
    run()
