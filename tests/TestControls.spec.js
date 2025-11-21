const { test, expect } = require('@playwright/test');

test('Interact with all common UI controls', async ({ page }) => {
  // Replace this with a working demo page that has all UI controls
  await page.goto('https://letcode.in/test'); // or your test page

  // Text Box
  await page.goto('https://letcode.in/edit');
  await page.fill('#fullName', 'Venkatesh Koochana');

  // Button
  await page.goto('https://letcode.in/buttons');
  await page.click('#btn');

  // Dropdown
  await page.goto('https://letcode.in/dropdowns');
  await page.selectOption('#fruits', 'apple'); // by value
  await page.selectOption('#superheros', { label: 'Batman' });

  // Radio Button
  await page.goto('https://letcode.in/radio');
  await page.check('#yes');

  // Checkbox
  await page.goto('https://letcode.in/checkbox');
  await page.check("input[name='lang'][value='Python']");

  // Table – Get text from table cell
  await page.goto('https://letcode.in/table');
  const cellText = await page.textContent("table tbody tr:nth-child(1) td:nth-child(1)");
  console.log('Table Cell Text:', cellText);

  // Date Picker – If available as input field
  await page.goto('https://demoqa.com/date-picker');
  await page.fill('#datePickerMonthYearInput', '05/06/2025');
  await page.press('#datePickerMonthYearInput', 'Enter');

  // Slider – if input[type=range]
  await page.goto('https://demoqa.com/slider');
  const slider = page.locator('input[type="range"]');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');

  // Optional: wait and screenshot
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'final-result.png' });
});
