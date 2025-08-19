import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({
    headless: true, // 👈 force headless in GitHub Actions
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // login steps...
  await page.goto("https://leetcode.com/accounts/login/");

  // fill login
  await page.fill("#login", process.env.LEETCODE_USERNAME);
  await page.fill("#password", process.env.LEETCODE_PASSWORD);
  await page.click("button[type=submit]");

  // wait for redirect
  await page.waitForURL("**/problemset/**");

  // Save auth state
  await context.storageState({ path: "auth.json" });

  await browser.close();
}

run();
