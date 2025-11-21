const { test, expect } = require('@playwright/test');

test('check and uncheck a checkbox', async ({ page }) => {
  await page.goto('https://testautomationpractice.blogspot.com/');

  const checkbox = page.locator('#male');

  // ✅ Check the checkbox
  await checkbox.check();
  let isChecked = await checkbox.isChecked();
  expect(isChecked).toBe(true);
  console.log('✅ Checkbox is checked:', isChecked);
   
 
  const checkBoxLoctor = [
'#sunday',
"//input[@id='monday']",
'#tuesday'
  ];

  for(const locator of checkBoxLoctor){

    await page.locator(locator).check();
  }

for (const locator of checkBoxLoctor){
    await page.locator(locator).uncheck();
}

});
