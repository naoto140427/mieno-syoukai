import { chromium } from '@playwright/test';

const base = new URL('https://preview.mieno-shokai.com');
const paths = ['/', '/units', '/logistics', '/contact'];
let browser;

try {
  browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL,
    timeout: 15_000,
  });
  const page = await browser.newPage();

  for (const path of paths) {
    const response = await page.goto(new URL(path, base).href, {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });
    const actual = new URL(page.url());
    if (actual.origin !== base.origin || actual.pathname !== path) {
      throw new Error(`${path}: unexpected destination (${actual.origin}${actual.pathname})`);
    }
    if (response?.status() !== 200) {
      throw new Error(`${path}: expected HTTP 200, received ${response?.status() ?? 'no response'}`);
    }
    if (!(await page.title()).includes('MIENO CORP.') || !(await page.locator('main').first().isVisible())) {
      throw new Error(`${path}: expected the MIENO CORP. page and visible main content`);
    }
  }
  console.log(`Preview: ${paths.length} pages passed.`);
} catch (error) {
  console.error(`Preview check failed: ${String(error.message).split('\n')[0]}`);
  process.exitCode = 1;
} finally {
  await browser?.close();
}
