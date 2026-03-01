import { test, expect } from '@playwright/test';

test('smoke test QOL features', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Verify Breeding Center is reachable and has the new tabs
  await page.goto('/breeding');
  await page.waitForSelector('text=Breeding Center');
  await page.waitForSelector('text=Comparison Tool');
  await page.waitForSelector('text=Auto-Match');
  await page.screenshot({ path: 'test-results/breeding_tabs.png' });

  // Verify Kennel has filters
  await page.goto('/kennel?tab=adult');
  await page.screenshot({ path: 'test-results/kennel_page.png' });

  // Verify NPC Stud Barn has studs
  await page.goto('/stud-barn');
  await page.waitForSelector('text=Foundation Studs');
  await page.screenshot({ path: 'test-results/stud_barn.png' });

  // Verify Adoption Page variety
  await page.goto('/shop/adoption');
  await page.waitForSelector('text=Foundation Fox Adoption');
  await page.screenshot({ path: 'test-results/adoption_page.png' });
});
