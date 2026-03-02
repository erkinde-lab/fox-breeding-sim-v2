import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'red-fox-sim-storage';

test('High Contrast Light Mode (Auto-Adjust)', async ({ page }) => {
  await page.goto('http://localhost:3000/settings');
  await page.evaluate((key) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      state: {
        highContrast: true,
        isDarkMode: false
      },
      version: 5
    }));
  }, STORAGE_KEY);
  await page.reload();
  await page.waitForSelector('html.high-contrast', { timeout: 15000 });
  await page.screenshot({ path: '/home/jules/verification/hc_light_mode_v3.png' });
});

test('High Contrast Dark Mode (Auto-Adjust)', async ({ page }) => {
  await page.goto('http://localhost:3000/settings');
  await page.evaluate((key) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      state: {
        highContrast: true,
        isDarkMode: true
      },
      version: 5
    }));
  }, STORAGE_KEY);
  await page.reload();
  await page.waitForSelector('html.high-contrast', { timeout: 15000 });
  // Check classes on html
  const classes = await page.evaluate(() => document.documentElement.className);
  console.log('HTML Classes:', classes);
  await page.screenshot({ path: '/home/jules/verification/hc_dark_mode_v3.png' });
});
