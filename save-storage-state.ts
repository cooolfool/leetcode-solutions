// save-storage-state.ts
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false }); // visible browser so you can solve captchas/consent
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to LeetCode login
  await page.goto('https://leetcode.com/accounts/login/');

  // Wait for the form so we don't race
  await page.waitForSelector('input[name="login"], input#id_login', { timeout: 60000 });

  // Fill in credentials from env
  await page.fill('input[name="login"], input#id_login', process.env.LEETCODE_USERNAME || '');
  await page.fill('input[name="password"], input#id_password', process.env.LEETCODE_PASSWORD || '');

  // Click submit and wait to reach a logged-in page
  await Promise.all([
    page.click('button[type="submit"], button[id="signin_btn"]'),
    page.waitForURL('**/problemset/all/**', { timeout: 60000 }).catch(() => null)
  ]);

  // If LeetCode needs more time, you can wait manually here (solve captcha/consent)
  // Save storage (cookies + localStorage)
  await context.storageState({ path: 'auth.json' });

  await browser.close();
  console.log('✅ Saved auth.json in repo root');
})();
