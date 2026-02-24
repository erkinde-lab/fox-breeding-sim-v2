import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Check Dashboard
        await page.goto("http://localhost:3000/kennel/dashboard")
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

                # Toggle Admin Mode
        await page.goto("http://localhost:3000/kennel/dashboard")
        await page.click("svg.lucide-paw-print")
        await page.wait_for_timeout(500)
        # Check Admin
        await page.goto("http://localhost:3000/admin")
        await page.wait_for_timeout(2000)
        # We might need to click some tabs or toggle admin mode
        # But let's just check the content for now
        content = await page.content()
        print(f"Admin - Dog button found: {'Dog' in content}")
        print(f"Admin - Vixen button found: {'Vixen' in content}")
        # Click Shows tab
        await page.click("text=Shows")
        await page.wait_for_timeout(1000)
        content = await page.content()
        print(f"Admin - Amateur Junior config found: {'Amateur Junior' in content}")
        await page.screenshot(path="admin_final.png")

        # Check Shows for Amateur
        await page.goto("http://localhost:3000/shows")
        await page.wait_for_timeout(2000)
        content = await page.content()
        print(f"Shows - Amateur Junior found: {"Amateur Junior" in content}")
        print(f"Shows - Eligibility notice found: {"qualify for Amateur shows" in content}")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
