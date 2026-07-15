import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  const pages = [
    { name: 'home', path: '/' },
    { name: 'units', path: '/units' },
    { name: 'logistics', path: '/logistics' },
  ];

  for (const p of pages) {
    test(`${p.name} page visual`, async ({ page }) => {
      await page.goto(p.path);
      // Wait for the load event to ensure main content is loaded
      await page.waitForLoadState('load');

      // Wait a bit for animations to settle
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot(`${p.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.05
      });
    });
  }
});
