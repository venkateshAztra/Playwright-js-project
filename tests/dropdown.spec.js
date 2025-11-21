const { test, expect } = require('@playwright/test');

test('Drop down Practice with scroll fix', async ({ page }) => {
  await page.goto('https://testautomationpractice.blogspot.com/');
  await page.waitForTimeout(2000);

  const dropdown = page.locator('#country');
  await dropdown.scrollIntoViewIfNeeded(); // 👈 this brings it into view
  await page.waitForTimeout(3000);         // 👁️ to observe it visually
 await dropdown.selectOption({ label: 'India' });
//  await dropdown.selectOption({value: 'india'});`
// await dropdown.selectOption({index: 1});
  console.log(dropdown);
await page.waitForTimeout(3000)
const options = page.locator('#country option');
await expect(options).toHaveCount(10);

await page.waitForTimeout(2000);

const optionss = await page.$$('#country option');
 console.log('options are the below',optionss.length);
await expect (optionss.length).toBe(10);


await page.waitForTimeout(2000);
const opt = await page.$$('#country option');

for (const optt of opt) {
  console.log(await optt.textContent());

  // Multi select dropdowns 

  await page.locator('[id="colors"]').selectOption(['Red', 'Blue', 'Green']);


}


}
);
