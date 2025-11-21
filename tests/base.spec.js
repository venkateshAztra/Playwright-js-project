import { test, expect } from '@playwright/test';

test('Login flow', async ({ page }) => {
  await test.step('Navigate to login page', async () => {
    await page.goto('https://example.com/login');
  });

  await test.step('Fill in credentials', async () => {
    await page.fill('#username', 'myuser');

    debugger;
    await page.fill('#password', 'mypassword');
  });

  await test.step('Submit form and verify login', async () => {
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });
});