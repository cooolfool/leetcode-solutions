import { test, expect } from '@playwright/test';

test('LeetCode login flow', async ({ page }) => {
  // Navigate to login page
  await page.goto('https://leetcode.com/accounts/login/');

  // Fill username + password from env
  await page.fill('input[name="login"]', process.env.LEETCODE_USERNAME!);
  await page.fill('input[name="password"]', process.env.LEETCODE_PASSWORD!);

  // Click login button
  await page.click('button[type="submit"]');

  // Wait for navigation to dashboard or profile page
  await page.waitForURL('**/problemset/all/', { timeout: 15000 });

  // Check user menu/profile exists
  const profileIcon = page.locator('img[alt="Avatar"]');
  await expect(profileIcon).toBeVisible();
});
