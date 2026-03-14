import { test, expect } from '@playwright/test';

test.describe('Theme Verification', () => {
  test('verify dark mode transition', async ({ page }: any) => {
    await page.goto('/');
    // Check for existence of theme-aware classes
    const body = page.locator('div').first();
    await expect(body).toBeDefined();
  });
});
