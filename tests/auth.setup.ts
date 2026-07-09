import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL || 'naoto150127@gmail.com';
  const password = process.env.TEST_USER_PASSWORD || '0304a0127A';

  // Go to the home page first to get a CSRF token / initialize cookies if necessary
  await page.goto('/');

  // Call the test login API to authenticate and set cookies
  const response = await page.request.post('/api/auth/test-login', {
    data: {
      email,
      password,
    }
  });

  expect(response.ok()).toBeTruthy();

  // Save the storage state (which now includes the cookies set by the API)
  await page.context().storageState({ path: authFile });
});
