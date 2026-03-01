import { test, expect } from '@playwright/test';

test('verify QOL features', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/');

  // 1. Verify Kennel Gender Filter
  await page.click('a:has-text("Kennel")');
  // Need to wait for adopted foxes or at least for the tab content to render
  // If the kennel is empty, the filters might not show up immediately depending on logic
  // Actually in my implementation, the filters show up if activeTab !== "dashboard"
  await page.click('button:has-text("Adult Kennel")');
  await page.waitForSelector('select[aria-label="Filter by gender"]', { timeout: 10000 });
  await page.screenshot({ path: 'test-results/kennel_filter.png' });

  // 2. Verify Breeding Navigation and Comparison/Auto-Match
  await page.click('text=Breeding');
  await page.click('text=Comparison Tool');
  await expect(page).toHaveURL(/.*comparison/);
  await page.screenshot({ path: 'test-results/breeding_comparison.png' });

  await page.click('text=Auto-Match');
  await expect(page).toHaveURL(/.*auto-match/);
  await page.screenshot({ path: 'test-results/breeding_automatch.png' });

  // 3. Verify Fox History (after adoption)
  await page.click('text=Shops');
  await page.click('text=Foundations');
  await page.waitForSelector('text=Adopt Now');
  await page.click('text=Adopt Now');
  await page.click('text=View Profile');
  await page.waitForSelector('text=Life Events & Records');
  await page.screenshot({ path: 'test-results/fox_profile_history.png' });
});
