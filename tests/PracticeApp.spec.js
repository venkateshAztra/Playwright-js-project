
const { generateRandomEmail } = require('../utils/generateEmail');
const { test, expect } = require('@playwright/test');

test('Fill form and interact with all controls', async ({ page }) => {
  await page.goto('https://testautomationpractice.blogspot.com/');

  // Textboxes
  await page.getByRole('textbox', { name: 'Enter Name' }).fill('venkatesh');
  console.log('Name entered');

  await page.getByRole('textbox', { name: 'Enter EMail' }).fill('venkatesh22@gmail.com');
  console.log('Email entered');

  await page.getByRole('textbox', { name: 'Enter Phone' }).fill('7658967464');
  console.log('Phone number entered');

  await page.getByRole('textbox', { name: 'Address:' }).fill('Hyderabad');

  // Radio button
  await page.getByRole('radio', { name: 'Male', exact: true }).click();

  // Checkbox
  await page.getByRole('checkbox', { name: 'Sunday' }).click();

  // Dropdowns
  await page.getByLabel('Country:').selectOption('India');
  await page.getByLabel('Colors:').selectOption('Blue');

  // Date picker
  await page.locator('#datepicker').click();
  await page.getByRole('link', { name: '6', exact: true }).click();

  await page.locator('#txtDate').click();
  await page.getByRole('link', { name: '8', exact: true }).click();

  await page.getByPlaceholder('Start Date').fill('2025-05-08');
  await page.getByPlaceholder('End Date').fill('2025-05-16');

  // Submit
  await page.locator('#post-body-1307673142697428135')
  .getByRole('button', { name: 'Submit' })
  .click();

  // Optional: wait for a moment and screenshot
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'form-submission.png' });


// example.spec.js or your test file


  const email = generateRandomEmail();
  console.log('Generated Email:', email);

  // continue test logic


});
