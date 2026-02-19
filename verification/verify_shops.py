from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 1200})
        page = context.new_page()

        page.goto("http://localhost:3000/shop/staff")
        page.wait_for_selector("text=Geneticist", timeout=5000)
        page.screenshot(path="verification/staff.png")

        page.goto("http://localhost:3000/shop/feeds")
        page.wait_for_selector("text=Buy 10", timeout=5000)
        page.screenshot(path="verification/feeds.png")

        page.goto("http://localhost:3000/shop/custom")
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/custom_alignment.png")

        browser.close()

if __name__ == "__main__":
    run()
