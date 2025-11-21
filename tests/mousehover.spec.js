
const { expect, test } = require('@playwright/test')

test('mouse hover ', async ({ page }) => {

    await page.goto('https://demoqa.com/')
    const hover = await page.getByText('JOIN NOW')
    hover.hover();
    hover.click()
    await page.pause()


})