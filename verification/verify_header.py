from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1024, 'height': 800}) # Test with smaller width
        page = context.new_page()
        page.goto("http://localhost:3000/")
        page.evaluate("window.localStorage.setItem('game-storage', JSON.stringify({state: {isAdmin: true, gold: 1000, gems: 50}}))")
        page.reload()
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/header_1024.png", clip={'x': 0, 'y': 0, 'width': 1024, 'height': 100})

        context2 = browser.new_context(viewport={'width': 1600, 'height': 800}) # Test with wider width
        page2 = context2.new_page()
        page2.goto("http://localhost:3000/")
        page2.evaluate("window.localStorage.setItem('game-storage', JSON.stringify({state: {isAdmin: true, gold: 1000, gems: 50}}))")
        page2.reload()
        page2.wait_for_timeout(2000)
        page2.screenshot(path="verification/header_1600.png", clip={'x': 0, 'y': 0, 'width': 1600, 'height': 100})

        browser.close()

if __name__ == "__main__":
    run()
