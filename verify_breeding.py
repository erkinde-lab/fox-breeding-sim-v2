import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:3000/breeding")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="breeding_page.png")

        content = await page.content()
        if "Dog" in content and "Vixen" in content:
            print("Found Dog and Vixen on Breeding page")
        else:
            print("FAILED: Dog/Vixen not found on Breeding page")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
