import { test, expect } from '@playwright/test';

test('accessibility settings update the UI correctly', async ({ page }) => {
  await page.goto('/settings');

  // Verify default state
  const body = page.locator('div.min-h-screen');
  await expect(body).not.toHaveClass(/high-contrast/);
  await expect(body).toHaveClass(/font-size-normal/);

  // Toggle High Contrast
  await page.click('button[aria-label="Toggle High Contrast"]');
  await expect(body).toHaveClass(/high-contrast/);

  // Toggle Colorblind Mode
  await page.click('button[aria-label="Toggle Colorblind Mode"]');
  await expect(body).toHaveClass(/colorblind-mode/);

  // Set Font Size to XL
  await page.click('button:has-text("XL")');
  await expect(body).toHaveClass(/font-size-xl/);

  // Toggle OpenDyslexic
  await page.click('button[aria-label="Toggle OpenDyslexic Font"]');
  await expect(body).toHaveClass(/use-opendyslexic/);

  // Reload and check persistence
  await page.reload();
  await expect(body).toHaveClass(/high-contrast/);
  await expect(body).toHaveClass(/colorblind-mode/);
  await expect(body).toHaveClass(/font-size-xl/);
  await expect(body).toHaveClass(/use-opendyslexic/);
});
