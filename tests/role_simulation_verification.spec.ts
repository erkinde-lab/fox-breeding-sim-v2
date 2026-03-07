import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'red-fox-sim-storage';

async function setRole(page, memberId) {
    await page.evaluate(({key, id}) => {
        const data = JSON.parse(localStorage.getItem(key) || '{"state":{}}');
        data.state.currentMemberId = id;
        localStorage.setItem(key, JSON.stringify(data));
    }, {key: STORAGE_KEY, id: memberId});
    await page.reload();
}

test.describe('Member Role Simulation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/');
        // Wait for hydration
        await page.waitForTimeout(1000);
    });

    test('Admin should see Advance Season and all Admin Tabs', async ({ page }) => {
        await setRole(page, 'player-1'); // Angmar (Admin)
        await expect(page.locator('button:has-text("Advance Season")')).toBeVisible();

        await page.goto('http://localhost:3000/admin');
        await expect(page.locator('button:has-text("Site")')).toBeVisible();
        await expect(page.locator('button:has-text("Economy")')).toBeVisible();

        // Take screenshot of Admin Panel
        await page.screenshot({ path: 'screenshots/admin-panel-admin.png' });
    });

    test('Moderator should NOT see Advance Season and see restricted Admin Tabs', async ({ page }) => {
        await setRole(page, 'player-2'); // Shield (Mod)
        await expect(page.locator('button:has-text("Advance Season")')).not.toBeVisible();

        await page.goto('http://localhost:3000/admin');
        await expect(page.locator('button:has-text("Site")')).not.toBeVisible();
        await expect(page.locator('button:has-text("Economy")')).not.toBeVisible();
        await expect(page.locator('button:has-text("Reports")')).toBeVisible();

        // Take screenshot of Admin Panel for Moderator
        await page.screenshot({ path: 'screenshots/admin-panel-mod.png' });
    });

    test('Player should be redirected from Admin Panel', async ({ page }) => {
        await setRole(page, 'player-3'); // FoxFan (Player)
        await page.goto('http://localhost:3000/admin');
        await expect(page.locator('text=Access Denied')).toBeVisible();
    });

    test('Settings Identity Switcher should work', async ({ page }) => {
        await page.goto('http://localhost:3000/settings');
        await page.click('button:has-text("Shield")'); // Switch to Mod
        await expect(page.locator('text=Switched to Shield')).toBeVisible();
        await expect(page.locator('text=Mod Access')).toBeVisible();
        await page.screenshot({ path: 'screenshots/settings-switcher.png' });
    });
});
