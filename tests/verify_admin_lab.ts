import { test, expect } from '@playwright/test';

test('verify genetics lab spawning', async ({ page }) => {
  await page.goto('http://localhost:3000/admin');

  // Login
  await page.fill('input[type="password"]', 'foxy2024');
  await page.click('button:has-text("Login")');

  // Wait for Admin Panel and click Genetics Lab
  await page.waitForSelector('text=Admin Panel');
  await page.click('button:has-text("Genetics Lab")');

  // Verify Genetics Lab content
  await expect(page.locator('text=Genetic Spawn Tool')).toBeVisible();

  // Check for the missing Fox Name field
  const nameInput = await page.locator('input[placeholder="Enter fox name"]').count();
  if (nameInput > 0) {
    console.log('FAIL: Fox name input still exists');
  } else {
    console.log('SUCCESS: Fox name input is gone');
  }

  // Set up a genotype that should result in "Pearl Amber"
  // Burgundy (gg), Pearl (pp)
  // According to my logic: { G: 'gg', P: 'pp' } -> "Pearl Amber"

  // Note: The UI uses select elements for each locus.
  // Based on src/app/admin/page.tsx:
  // <select value={genotype[locus]} ...>

  // Let's set G to 'gg' and P to 'pp'
  await page.selectOption('select >> nth=2', 'gg'); // G locus is 3rd (index 2)
  await page.selectOption('select >> nth=4', 'pp'); // P locus is 5th (index 4)

  // Check Predicted Outcome
  const predictedOutcome = await page.locator('text=Predicted Outcome:').textContent();
  console.log('Predicted Outcome:', predictedOutcome);

  await page.screenshot({ path: 'genetics_lab_verify.png' });
});
