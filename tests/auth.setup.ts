import { test as setup, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Use environment variables or fallback to defaults for testing
  const email = process.env.TEST_USER_EMAIL || 'preview-agent@mieno-shokai.com';
  const password = process.env.TEST_USER_PASSWORD || 'AgentTestPass2026!';
  
  // Need to get the Supabase URL and Key to authenticate
  // Read from process.env if available, otherwise fetch from page context if possible
  // Since Playwright runs in Node, we can just use the public env vars if they exist
  // We'll read them from the app's home page context to ensure accuracy
  
  await page.goto('/');

  // Run login using Supabase JS client inside the browser context
  const sessionData = await page.evaluate(async (credentials) => {
    // Assuming supabase is not exposed globally, we have to inject it or find another way
    // Better yet: Just hit the Supabase GoTrue API directly via fetch
    
  const email = process.env.TEST_USER_EMAIL || 'test-agent@mieno-shokai.com';
  const password = process.env.TEST_USER_PASSWORD || 'MienoAgent2026!';

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
