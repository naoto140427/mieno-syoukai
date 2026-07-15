import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('should load admin dashboard successfully without 403 or 404', async ({ page }) => {
    // Attempt to load the admin page
    const response = await page.goto('/admin');
    
    // Check that we didn't get an HTTP 404 or 403 status (unless it's a client-side redirect)
    // Note: Next.js app router might return 200 for a layout that renders a 404/403 page on the client side,
    // so we also need to check the content.
    expect(response?.status()).not.toBe(403);
    expect(response?.status()).not.toBe(404);

    // Look for indicators that we are actually in the admin dashboard.
    await expect(page.getByText('MIENO COMMAND CENTER')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('System Status')).toBeVisible();
  });

  test('should be able to open the Live Editor', async ({ page }) => {
    await page.goto('/admin');
    
    // Click on the Live Editor quick launch button
    const liveEditorButton = page.locator('button').filter({ hasText: 'ライブエディタ' });
    await expect(liveEditorButton).toBeVisible();
    await liveEditorButton.click();
    
    // Check if the Live Editor modal opens
    // Assuming Live Editor has some recognizable text like 'ニュース新規作成' or similar, 
    // or we just check if a dialog/modal is visible.
    // Since we don't know the exact text in LiveEditor, checking for the modal wrapper or just a basic visibility check
    await expect(page.getByRole('dialog').or(page.locator('.fixed.inset-0').nth(1))).toBeVisible({ timeout: 5000 });
  });
});
