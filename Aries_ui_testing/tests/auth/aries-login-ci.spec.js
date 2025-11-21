/* eslint-env node */
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');
const users = require('../../fixtures/users.json');

test.describe('Aries Login Tests - CI Ready', () => {

  test('Valid login flow', async ({ page }) => {
    await page.goto(users.tenantUrl);
    
    await page.fill('[name="username"]', users.validUser.username);
    await page.fill('[name="password"]', users.validUser.password);
    await page.click('button:has-text("Login")');
    
    // Wait for login to complete
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Navigate to API Requirements
    await page.click('text=API Requirements');
    await page.click('text=Add New Request');
    await page.click('#requestType');
    
    // Verify we're on the right page
    await expect(page.locator('#requestType')).toBeVisible();
  });

  test('Invalid login shows error', async ({ page }) => {
    await page.goto(users.tenantUrl);
    
    await page.fill('[name="username"]', users.invalidUser.username);
    await page.fill('[name="password"]', users.invalidUser.password);
    await page.click('button:has-text("Login")');
    
    // Check for error (adjust selector as needed)
    await expect(page.locator('.error-message, .alert-danger, [role="alert"]')).toBeVisible();
  });

});