import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'red-fox-sim-storage';
const CURRENT_VERSION = 7;

async function setupTheme(page, settings) {
  await page.goto('http://localhost:3000/');
  await page.evaluate(({key, settings, version}) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      state: {
        ...settings,
        hasSeenTutorial: true
      },
      version: version
    }));
  }, {key: STORAGE_KEY, settings: settings, version: CURRENT_VERSION});
  await page.reload();
}

test('Theme: Light Mode Admin', async ({ page }) => {
  await setupTheme(page, { isDarkMode: false });
  await page.goto('http://localhost:3000/admin');
  await page.screenshot({ path: 'verification/theme_light_admin.png', fullPage: true });
});

test('Theme: Dark Mode Admin', async ({ page }) => {
  await setupTheme(page, { isDarkMode: true });
  await page.goto('http://localhost:3000/admin');
  await page.screenshot({ path: 'verification/theme_dark_admin.png', fullPage: true });
});

test('Theme: High Contrast Dark Admin', async ({ page }) => {
  await setupTheme(page, { isDarkMode: true, highContrast: true });
  await page.goto('http://localhost:3000/admin');
  await page.screenshot({ path: 'verification/theme_hc_dark_admin.png', fullPage: true });
});

test('Theme: Dropdown & Blur', async ({ page }) => {
  await setupTheme(page, { isDarkMode: false });
  await page.goto('http://localhost:3000/');
  await page.click('button:has-text("Shops")');
  await page.waitForSelector('.shadow-popover');
  await page.screenshot({ path: 'verification/theme_dropdown_blur.png' });
});

test('Theme: Shop Semantic Consistency', async ({ page }) => {
  await setupTheme(page, { isDarkMode: false });
  await page.goto('http://localhost:3000/shop/supplies');
  await page.screenshot({ path: 'verification/theme_shop_light.png', fullPage: true });

  await setupTheme(page, { isDarkMode: true });
  await page.goto('http://localhost:3000/shop/supplies');
  await page.screenshot({ path: 'verification/theme_shop_dark.png', fullPage: true });
});
