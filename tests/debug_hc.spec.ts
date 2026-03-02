import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'red-fox-sim-storage';

test('Debug High Contrast Dark', async ({ page }) => {
  await page.goto('http://localhost:3000/settings');
  await page.evaluate((key) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      state: {
        isDarkMode: true,
        highContrast: true
      },
      version: 5
    }));
  }, STORAGE_KEY);
  await page.reload();

  const classes = await page.evaluate(() => document.documentElement.className);
  console.log('HTML Classes:', classes);

  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  console.log('Body BG:', bodyBg);

  const htmlBg = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
  console.log('HTML BG:', htmlBg);

  await page.screenshot({ path: '/home/jules/verification/hc_dark_debug.png' });
});
