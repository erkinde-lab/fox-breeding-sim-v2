import { test } from '@playwright/test';

test('take fox profile screenshot', async ({ page }) => {
  await page.goto('http://localhost:3000/kennel');
  // Wait for the starter foxes to be initialized and rendered
  await page.waitForSelector('h3:has-text("Starter Male")');
  
  // Click on the first fox card
  await page.click('h3:has-text("Starter Male")');
  
  // Wait for the profile page to load
  await page.waitForSelector('h2:has-text("Starter Male")');
  
  // Take screenshot
  await page.screenshot({ path: 'fox_profile_new_theme.png', fullPage: true });
});
