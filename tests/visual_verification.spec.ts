import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'red-fox-sim-storage';

test('Normal Light Mode', async ({ page }) => {
  await page.goto('http://localhost:3000/settings');
  await page.evaluate((key) => {
    localStorage.clear();
  }, STORAGE_KEY);
  await page.reload();
  await page.screenshot({ path: '/home/jules/verification/normal_light.png' });
});

test('High Contrast Light Mode', async ({ page }) => {
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
  await page.waitForSelector('html.high-contrast', { timeout: 10000 });
  await page.screenshot({ path: '/home/jules/verification/light_high_contrast_v3.png' });
});

test('OpenDyslexic Test', async ({ page }) => {
  await page.goto('http://localhost:3000/settings');
  await page.evaluate((key) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      state: {
        useOpenDyslexic: true
      },
      version: 5
    }));
  }, STORAGE_KEY);
  await page.reload();
  await page.waitForSelector('html.use-opendyslexic', { timeout: 10000 });
  await page.screenshot({ path: '/home/jules/verification/opendyslexic_v3.png' });
});

test('Shop Tabs order', async ({ page }) => {
  await page.goto('http://localhost:3000/shop/supplies');
  await page.screenshot({ path: '/home/jules/verification/shop_tabs_v3.png' });
});

test('Tutorial Step 8 debug', async ({ page }) => {
  await page.goto('http://localhost:3000/settings');
  await page.evaluate((key) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      state: {
        hasSeenTutorial: false,
        tutorialStep: 8,
        gold: 10000,
        gems: 100
      },
      version: 5
    }));
  }, STORAGE_KEY);
  await page.reload();

  // Take a full page screenshot to see what's happening
  await page.screenshot({ path: '/home/jules/verification/tutorial_debug_full.png', fullPage: true });

  // Log all h3 text
  const h3s = await page.$$eval('h3', nodes => nodes.map(n => n.textContent));
  console.log('H3s found:', h3s);
});
