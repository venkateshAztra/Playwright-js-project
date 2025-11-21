const {test,expect} = require('@playwright/test')

test('keyboard actions',async ({page})=>{

    await page.goto('https://gotranscript.com/text-compare')

const copy = await page.getByPlaceholder('Paste one version of the text here.')//
await copy.fill('operation sindhoor')
 const copiedvale = await copy.inputValue();
console.log(copiedvale)
// await page.type('textarea[name="text1"]','operation sindhoor')




await page.keyboard.press('Control+A');
await page.keyboard.press('Control+C');


// first method
await page.keyboard.down('Tab')
// await page.keyboard.up('Tab')

// second method

// await page.locator('textarea[name="text2"]')



const paste = page.getByRole('textbox', { name: 'Paste another version of the text here.' })
 await paste.click();
await paste.fill(copiedvale)


// await page.keyboard.press('Control+V')
    await page.pause()

})
