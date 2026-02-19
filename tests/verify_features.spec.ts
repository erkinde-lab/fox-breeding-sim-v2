import { test, expect } from '@playwright/test';

test('verify persistent admin button and navigation', async ({ page }) => {
  await page.goto('http://localhost:3000/kennel');

  await page.evaluate(() => {
    localStorage.setItem('red-fox-sim-storage', JSON.stringify({
      state: { isAdmin: true, gold: 10000, gems: 1000, foxes: {} },
      version: 0
    }));
  });

  await page.reload();

  // Check for Admin Panel button in header
  const adminBtn = page.locator('text=Admin Panel');
  await expect(adminBtn.first()).toBeVisible();

  // Check Kennel dropdown
  await page.click('text=Kennel');
  await expect(page.locator('text=Dashboard').first()).toBeVisible();
  await expect(page.locator('text=My Foxes').first()).toBeVisible();
  await expect(page.locator('text=Inventory').first()).toBeVisible();
});

test('verify staff shop additions', async ({ page }) => {
    await page.goto('http://localhost:3000/shop/staff');
    await expect(page.locator('text=Kennel Geneticist').first()).toBeVisible();
    await expect(page.locator('text=Professional Nutritionist').first()).toBeVisible();
});

test('verify quest instructions', async ({ page }) => {
    await page.goto('http://localhost:3000/quests');
    await expect(page.locator('text=Requirement').first()).toBeVisible();
    await expect(page.locator('text=Adopt at least 1 foundational fox').first()).toBeVisible();
});
