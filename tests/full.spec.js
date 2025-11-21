const { test, expect } = require('@playwright/test');

test('Complete test on practice blogspot site', async ({ page }) => {
  // Navigate to the test page
  await page.goto('https://testautomationpractice.blogspot.com/');

  await expect (page).toHaveURL('https://testautomationpractice.blogspot.com/');

  //URL verification
  const currentURL = page.url();
  console.log('current url is ',currentURL);

  const heading = page.locator("h1[class='title']");

  // Assert it's visible
  await expect(heading).toBeVisible();
  
  // Get and print the text
  const headingText = await heading.textContent();
  console.log('✅ Heading Text:', headingText?.trim());


  const title =  await page.title();
  console.log('✅Appliacation title is',title); 

  


  const isVisible = await page.locator("p.description span").isVisible();
  console.log('🔍 Is element visible:', isVisible);
  
  // Fill Textboxes

  //  await expect (page).locator

   const name = 'Venkatesh';
   const nameInput = page.getByRole('textbox', { name: 'Enter Name' });
   
   // Assert the field is visible
   await expect(nameInput).toBeVisible();
   
   // Fill the field
   await nameInput.fill(name);
   
   // Log for console and report
   console.log(`✅ Entered name: ${name}`);


   const email = "venkat22@gmail.com";
   const emailInput = page.getByRole('textbox',{name:'Enter Email'});
   await emailInput.fill(email);
   console.log('Entered email',email);

   
  await page.getByRole('textbox', { name: 'Enter Phone' }).fill('9876543210');
  await page.getByRole('textbox', { name: 'Address:' }).fill('Hyderabad');

  // Select Radio Button
  await page.getByRole('radio', { name: 'Male', exact: true }).click();

  // Select Checkboxes
  await page.getByRole('checkbox', { name: 'Sunday' }).click();
  await page.getByRole('checkbox', { name: 'Saturday' }).click();

  // Select Dropdowns
  await page.getByLabel('Country:').selectOption('India');
  await page.getByLabel('Colors:').selectOption('Blue');

  // Interact with Datepicker
  await page.locator('#datepicker').click();
  await page.getByRole('link', { name: '10' }).click();

  // Start & End Date
  await page.getByPlaceholder('Start Date').fill('2025-05-10');
  await page.getByPlaceholder('End Date').fill('2025-05-16');

  // Click Submit Button
  await page.locator('#post-body-1307673142697428135').getByRole('button', { name: 'Submit' }).click({ force: true });

  // Handle Alert Button
  await page.on('dialog', dialog => dialog.accept());
  await page.waitForTimeout(3000); // Waits for 3 seconds
  // await page.pause();

  await page.getByRole('button', { name: 'Simple Alert' }).click();
// await page.pause();
  // Confirm Box
  // await page.on('dialog', dialog => dialog.accept());
  await page.waitForTimeout(2000);
 

await page.locator('//button[text()="Confirmation Alert"]').click();

  
  // Table interaction (read table content)
  const tableText = await page.locator('table[name="BookTable"]').innerText();
  console.log('📄 Table Content:\n', tableText);

  // Drag and Drop
  const src = page.locator('#draggable');
  const target = page.locator('#droppable');
  await src.dragTo(target);
  console.log('tareget locator is,',target);

  console.log('Test complted ')
  await page.pause();

 
});
