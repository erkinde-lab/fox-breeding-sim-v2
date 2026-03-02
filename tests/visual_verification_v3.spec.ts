import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'red-fox-sim-storage';

test('Normal Light Mode Consistency', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.evaluate((key) => {
    localStorage.clear();
  }, STORAGE_KEY);
  await page.reload();
  await page.screenshot({ path: '/home/jules/verification/normal_light_v6.png' });
});

test('Normal Dark Mode Consistency', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.evaluate((key) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      state: {
        isDarkMode: true
      },
      version: 5
    }));
  }, STORAGE_KEY);
  await page.reload();
  await page.screenshot({ path: '/home/jules/verification/normal_dark_v6.png' });
});

test('High Contrast Toggle Light', async ({ page }) => {
  await page.goto('http://localhost:3000/settings');
  await page.evaluate((key) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      state: {
        isDarkMode: false
      },
      version: 5
    }));
  }, STORAGE_KEY);
  await page.reload();

  await page.click('button[aria-label="Toggle High Contrast"]');
  await page.waitForSelector('html.high-contrast', { timeout: 10000 });
  await page.screenshot({ path: '/home/jules/verification/hc_light_v6.png' });
});

test('High Contrast Toggle Dark', async ({ page }) => {
  await page.goto('http://localhost:3000/settings');
  await page.evaluate((key) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      state: {
        isDarkMode: true
      },
      version: 5
    }));
  }, STORAGE_KEY);
  await page.reload();

  await page.click('button[aria-label="Toggle High Contrast"]');
  await page.waitForSelector('html.high-contrast', { timeout: 10000 });
  await page.screenshot({ path: '/home/jules/verification/hc_dark_v6.png' });
});
