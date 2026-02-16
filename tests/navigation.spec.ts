import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/MIENO CORP./);
  });

  test('desktop navigation links work', async ({ page, isMobile }) => {
    test.skip(isMobile, 'This test is for desktop only');

    const links = [
      { name: 'Strategic Units', href: '/units' },
      { name: 'Logistics', href: '/logistics' },
      { name: 'Contact', href: '/contact' },
    ];

    for (const link of links) {
      // Target the desktop navigation specifically
      const navLink = page.locator('nav .hidden.lg\\:flex').getByRole('link', { name: link.name });
      await navLink.click();
      await expect(page).toHaveURL(new RegExp(link.href));
      await page.goto('/');
    }
  });

  test('mobile navigation menu works', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is for mobile only');

    const links = [
      { name: 'Strategic Units', href: '/units' },
      { name: 'Logistics', href: '/logistics' },
      { name: 'Contact', href: '/contact' },
    ];

    for (const link of links) {
      await page.getByRole('button', { name: 'Open main menu' }).click();
      // Target the mobile menu overlay specifically to avoid matching footer links
      // Use exact: true to distinguish between "Contact" and "Contact Us"
      const menuLink = page.locator('.fixed.inset-0').getByRole('link', { name: link.name, exact: true });
      await expect(menuLink).toBeVisible();
      await menuLink.click();
      await expect(page).toHaveURL(new RegExp(link.href));
      await page.goto('/');
    }
  });
});
