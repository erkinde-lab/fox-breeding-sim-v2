import { test, expect } from '@playwright/test';

test('Debug Accessibility Classes', async ({ page }) => {
  await page.goto('http://localhost:3000/settings');
  // Wait for the page to be ready
  await page.waitForSelector('h1:has-text("Settings")');

  // Toggle Reduced Motion
  await page.click('button[aria-label="Toggle Reduced Motion"]');

  // Check classes
  const classes = await page.evaluate(() => document.documentElement.className);
  console.log('Classes after Reduced Motion toggle:', classes);

  // Toggle OpenDyslexic
  await page.click('button[aria-label="Toggle OpenDyslexic Font"]');
  const classes2 = await page.evaluate(() => document.documentElement.className);
  console.log('Classes after OpenDyslexic toggle:', classes2);
});
