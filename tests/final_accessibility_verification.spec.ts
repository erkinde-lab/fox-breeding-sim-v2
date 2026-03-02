import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'red-fox-sim-storage';

async function setStoreState(page, partialState) {
  await page.evaluate((args) => {
    // We must provide a full state that satisfies the store's expectations
    // Version 5 state needs many fields.
    const baseState = {
      gold: 10000,
      gems: 100,
      year: 1,
      season: 'Spring',
      foxes: {},
      inventory: {},
      shows: [],
      showReports: [],
      isDarkMode: false,
      colorblindMode: false,
      highContrast: false,
      fontSize: 'normal',
      useOpenDyslexic: false,
      reducedMotion: false,
      alwaysUnderlineLinks: false,
      highVisibilityFocus: false,
      simplifiedUI: false,
      textSpacing: 'normal'
    };

    localStorage.setItem(args.key, JSON.stringify({
      state: { ...baseState, ...args.partialState },
      version: 5
    }));
  }, { key: STORAGE_KEY, partialState });
  await page.reload();
}

test.describe('Final Accessibility Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.evaluate((key) => localStorage.clear(), STORAGE_KEY);
    await page.reload();
  });

  test('Reduced Motion Class is Applied', async ({ page }) => {
    await setStoreState(page, { reducedMotion: true });
    // Wait for effect to run
    await page.waitForFunction(() => document.documentElement.classList.contains('reduced-motion'));
    const hasClass = await page.evaluate(() => document.documentElement.classList.contains('reduced-motion'));
    expect(hasClass).toBe(true);
  });

  test('OpenDyslexic Class is Applied', async ({ page }) => {
    await setStoreState(page, { useOpenDyslexic: true });
    await page.waitForFunction(() => document.documentElement.classList.contains('use-opendyslexic'));
    const hasClass = await page.evaluate(() => document.documentElement.classList.contains('use-opendyslexic'));
    expect(hasClass).toBe(true);
  });

  test('Underline Links Class is Applied', async ({ page }) => {
    await setStoreState(page, { alwaysUnderlineLinks: true });
    await page.waitForFunction(() => document.documentElement.classList.contains('underline-links'));
    const hasClass = await page.evaluate(() => document.documentElement.classList.contains('underline-links'));
    expect(hasClass).toBe(true);
  });

  test('High Visibility Focus Class is Applied', async ({ page }) => {
    await setStoreState(page, { highVisibilityFocus: true });
    await page.waitForFunction(() => document.documentElement.classList.contains('high-visibility-focus'));
    const hasClass = await page.evaluate(() => document.documentElement.classList.contains('high-visibility-focus'));
    expect(hasClass).toBe(true);
  });

  test('Simplified UI Class is Applied', async ({ page }) => {
    await setStoreState(page, { simplifiedUI: true });
    await page.waitForFunction(() => document.documentElement.classList.contains('simplified-ui'));
    const hasClass = await page.evaluate(() => document.documentElement.classList.contains('simplified-ui'));
    expect(hasClass).toBe(true);
  });

  test('Font Size and Text Spacing Classes are Applied', async ({ page }) => {
    await setStoreState(page, { fontSize: 'xl', textSpacing: 'extra' });
    await page.waitForFunction(() =>
      document.documentElement.classList.contains('font-size-xl') &&
      document.documentElement.classList.contains('text-spacing-extra')
    );
    const hasFontSize = await page.evaluate(() => document.documentElement.classList.contains('font-size-xl'));
    const hasSpacing = await page.evaluate(() => document.documentElement.classList.contains('text-spacing-extra'));
    expect(hasFontSize).toBe(true);
    expect(hasSpacing).toBe(true);
  });
});
