import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Check Dashboard
        await page.goto("http://localhost:3000/")
        await page.wait_for_timeout(2000)
        content = await page.content()
        print(f"Dashboard - Best Vixen found: {'Best Vixen' in content}")
        print(f"Dashboard - Best Dog found: {'Best Dog' in content}")
        await page.screenshot(path="dashboard_final.png")

        # Check Breeding
        await page.goto("http://localhost:3000/breeding")
        await page.wait_for_timeout(2000)
        content = await page.content()
        print(f"Breeding - Dog label found: {'Dog' in content}")
        print(f"Breeding - Vixen label found: {'Vixen' in content}")
        await page.screenshot(path="breeding_final.png")

        # Check Admin
        await page.goto("http://localhost:3000/admin")
        await page.wait_for_timeout(2000)
        # We might need to click some tabs or toggle admin mode
        # But let's just check the content for now
        content = await page.content()
        print(f"Admin - Dog button found: {'Dog' in content}")
        print(f"Admin - Vixen button found: {'Vixen' in content}")
        await page.screenshot(path="admin_final.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
