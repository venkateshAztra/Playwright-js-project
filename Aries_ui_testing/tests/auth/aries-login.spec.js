/* eslint-env node */
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');
const users = require('../../fixtures/users.json');

test.describe('Aries Login Tests', () => {

  test('Valid login', async ({ page }) => {
    await page.goto(users.tenantUrl);
    
    await page.fill('[name="username"]', users.validUser.username);
    await page.fill('[name="password"]', users.validUser.password);
await page.click('button:has-text("Login")');
    
    await expect(page).toHaveURL(/dashboard/);
      await page.waitForTimeout(3000);

        await page.click('text=API Requirements');

        await page.click('text= Add New Request ');
        await page.click('[id="requestType"]')
        
        // Verify element is visible
        await expect(page.locator('#requestType')).toBeVisible();
  });
//
//   test('Invalid login', async ({ page }) => {
//     await page.goto(users.tenantUrl);
    
//     await page.fill('[name="username"]', users.invalidUser.username);
//     await page.fill('[name="password"]', users.invalidUser.password);
// await page.click('button:has-text("Login")');
    
//     await expect(page.locator('.error-message')).toBeVisible();
//   });

});


// /* eslint-env node */
// const { test, expect } = require('@playwright/test');
// const users = require('../../fixtures/users.json');
// const SelfHealing = require('../../utils/self-healing');

// test.describe('Aries Login Tests - Self Healing', () => {

//   test('Valid login with self-healing', async ({ page }) => {
//     const heal = new SelfHealing(page);
    
//     await page.goto(users.tenantUrl);
    
//     // Multiple selectors for username field
//     await heal.smartFill([
//       '[name="username"]',
//       '#username',
//       '.username-input',
//       'input[type="email"]'
//     ], users.validUser.username, 'username field');
    
//     // Multiple selectors for password field
//     await heal.smartFill([
//       '[name="password"]',
//       '#password',
//       '.password-input',
//       'input[type="password"]'
//     ], users.validUser.password, 'password field');
    
//     // Multiple selectors for login button
//     await heal.smartClick([
//       'button:has-text("Login")',
//       '#login-btn',
//       '.login-button',
//       'button[type="submit"]',
//       '.btn-primary'
//     ], 'login button');
    
//     await expect(page).toHaveURL(/dashboard/);
//   });

// });
