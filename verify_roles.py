import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        print("Navigating to Settings...")
        await page.goto('http://localhost:3000/settings')
        await page.wait_for_timeout(2000) # Wait for hydration

        # Skip tour if present
        skip_button = page.locator('text=SKIP TOUR')
        if await skip_button.is_visible():
            print("Skipping tour...")
            await skip_button.click()
            await page.wait_for_timeout(500)

        # 1. Switch to Admin
        print("Switching to Administrator...")
        await page.locator('button:has-text("Switch to Administrator")').click()
        await page.wait_for_timeout(500)
        await page.screenshot(path='verif_admin_settings.png')

        # Check Admin Panel access
        print("Checking Admin Panel as Administrator...")
        await page.goto('http://localhost:3000/admin')
        await page.wait_for_timeout(1000)
        await page.screenshot(path='verif_admin_panel_full.png')

        # Check IP visibility (assuming we are on Members tab or navigate to it)
        # First click the Members tab if not default
        members_tab = page.locator('button:has-text("Members")')
        if await members_tab.is_visible():
            await members_tab.click()
            await page.wait_for_timeout(500)
            await page.screenshot(path='verif_admin_members_ips.png')

        # 2. Switch to Moderator
        print("Switching to Moderator...")
        await page.goto('http://localhost:3000/settings')
        await page.locator('button:has-text("Switch to Moderator")').click()
        await page.wait_for_timeout(500)

        print("Checking Admin Panel as Moderator...")
        await page.goto('http://localhost:3000/admin')
        await page.wait_for_timeout(1000)
        await page.screenshot(path='verif_mod_panel_limited.png')

        # Check IP redaction
        members_tab = page.locator('button:has-text("Members")')
        if await members_tab.is_visible():
            await members_tab.click()
            await page.wait_for_timeout(500)
            content = await page.content()
            if "Redacted" in content:
                print("Confirmed: IPs are Redacted for Moderator.")
            else:
                print("Warning: IPs might NOT be Redacted for Moderator.")
            await page.screenshot(path='verif_mod_members_redacted.png')

        # 3. Switch to Player
        print("Switching to Player...")
        await page.goto('http://localhost:3000/settings')
        await page.locator('button:has-text("Switch to Player")').click()
        await page.wait_for_timeout(500)

        print("Verifying Admin Panel access is denied for Player...")
        await page.goto('http://localhost:3000/admin')
        await page.wait_for_timeout(1000)
        url = page.url
        if "admin" not in url or "Access Denied" in await page.content():
            print("Confirmed: Access Denied for Player.")
        else:
            print(f"Warning: Player reached {url}")
        await page.screenshot(path='verif_player_denied.png')

        # 4. Check Forum Report Button
        print("Checking Forum as Player...")
        await page.goto('http://localhost:3000/forum/general/1') # Assuming post 1 exists
        await page.wait_for_timeout(1000)
        report_button = page.locator('button:has-text("Report")').first
        if await report_button.is_visible():
            print("Confirmed: Report button visible for Player.")
        else:
            print("Warning: Report button NOT visible for Player.")
        await page.screenshot(path='verif_forum_player.png')

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
