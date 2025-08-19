import { test, expect } from '@playwright/test';
test.use({ storageState: "auth.json" }); 

test('LeetCode login flow', async ({ page }) => {
   await page.goto("https://leetcode.com/submissions/");

  // Wait until login form appears
  await page.waitForSelector('input[name="login"], input#id_login', { timeout: 20000 });

  // Fill username + password
  await page.fill('input[name="login"], input#id_login', process.env.LEETCODE_USERNAME!);
  await page.fill('input[name="password"], input#id_password', process.env.LEETCODE_PASSWORD!);

  // Click login button (handle both possible selectors)
  await page.click('button[type="submit"], button[id="signin_btn"]');

  // Wait for navigation after login
  await page.waitForURL('**/problemset/all/**', { timeout: 20000 });

  // Assert login worked by checking avatar
  const profileIcon = page.locator('img[alt="Avatar"]');
  await expect(profileIcon).toBeVisible({ timeout: 10000 });
});
