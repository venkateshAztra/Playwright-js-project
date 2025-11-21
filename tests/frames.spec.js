import { test, expect } from '@playwright/test';

test('frames handling practice', async ({ page }) => {
  await page.goto('https://ui.vision/demo/webtest/frames/');

  // Switch to the first frame (index starts from 0)
 const frame1 = page.frameLocator('frame[src="frame_1.html"]');
  await frame1.getByRole('textbox').fill('get by role');  

//await frame1.locator('input[name="mytext1"]').fill('placeholder'); // working

const frame2 = page.frame({ url: /.*frame_2.html.*/ });
await frame2.locator('input[name="mytext2"]').fill('Text in Frame 2');


const frame3 = page.frame({url:/frame_3.html/})  // regular exp 
await frame3.locator('input[name="mytext3"]').fill('frame3')

// await page.locator('form[name="name3"]').fill("frame3")

const childframe = frame3.childFrames()
await childframe[0].locator('(//div)[@class="AB7Lab Id5V1"][1]').check()
// page.waitForTimeout(4000)

await childframe[0].getByRole('checkbox',{name : 'Web Testing'}).click();
// page.waitForTimeout(2000)

// await childframe[0].getByText('Choose').click();

// page.waitForTimeout(2000)

// // await childframe[0].getByRole('option',{name : 'Yes'}).click()
// // await childFrame[0].getByText('Yes').click()
// const yesOption = childframe[0].locator("//span[text()='Yes']");

// if (await yesOption.isVisible()) {
//     await yesOption.click();
//     console.log('Yes option is clicked ')
// } else {
//     console.log("Yes option is not visible");
// }


   const nextButton = childframe[0].getByText('Next');
   nextButton.click();


   await childframe[0].getByRole('textbox',{name : 'Enter a short text'}).fill("Short name entered ")
  //  await page.waitForTimeout(1000)

  //  const longText = childframe[0].getByRole('textbox',{name : 'Enter a long answer'});
  //  await longText.fill("Its a long text ");
  //  const fill = longText.inputValue();
  //  console.log(fill)
   

const longText = childframe[0].getByRole('textbox', { name: 'Enter a long answer' });
await longText.fill("Its a long text");
const enteredText = await longText.inputValue();
console.log("Entered text is:", enteredText);


// await page.getByRole('button',{name : 'Submit'}).click();
// const submitButton = await childframe[0].getByRole('button', { name: 'Submit' });// get by role 
// await expect (submitButton).toBeVisible();

const submitButton = await childframe[0].locator('//span[text()="Submit"]');  // with the locator x-path

await expect(submitButton).toBeVisible();
await submitButton.click();

await page.waitForTimeout(2000)
  const verifyText = childframe[0].getByRole('heading', { name: 'Form Filling Demo Page' });

  await expect(verifyText).toContainText('Form Filling Demo Page');



await page.waitForTimeout(1000)

  const frame4 = page.frameLocator('frame[src="frame_4.html"]');
  await frame4.locator('input[name="mytext4"]').fill('Text for 4th frame')
  console.log("test complted ")
  // await page.pause();

});
    



// 