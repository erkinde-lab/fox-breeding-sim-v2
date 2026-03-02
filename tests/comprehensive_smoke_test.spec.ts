import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'red-fox-sim-storage';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/404');
  await page.evaluate((key) => {
    localStorage.clear();
    const fullState = {
      state: {
        foxes: {},
        gold: 10000,
        gems: 100,
        year: 1,
        season: "Spring",
        isAdmin: true,
        hasSeenTutorial: true,
        news: [{ id: '1', date: '2024-01-01', title: 'Test News', content: 'This is a test news item.', category: 'Update' }],
        broadcast: 'Global Broadcast Message',
        accessibilitySettings: {
            highContrast: false,
            fontSize: "normal",
        }
      },
      version: 7
    };
    localStorage.setItem(key, JSON.stringify(fullState));
  }, STORAGE_KEY);
  await page.goto('http://localhost:3000/');
});

test('Verify News, Credits and Admin', async ({ page }) => {
  await page.goto('http://localhost:3000/news');
  await expect(page.getByRole('heading', { name: 'Game News' })).toBeVisible();

  await page.goto('http://localhost:3000/credits');
  await expect(page.getByRole('heading', { name: 'Game Credits' })).toBeVisible();

  await page.goto('http://localhost:3000/admin');
  await expect(page.getByRole('heading', { name: 'Command Center' })).toBeVisible();
});

test('Verify Footer and Nav Links', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  const footer = page.locator('footer');
  await expect(footer.getByRole('link', { name: /News/i })).toBeVisible();
  await expect(footer.getByRole('link', { name: /Credits/i })).toBeVisible();
  await expect(footer.getByRole('link', { name: /Help/i })).toBeVisible();
});
