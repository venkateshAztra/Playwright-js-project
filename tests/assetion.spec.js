const { test,expect } = require("playwright/test");

test('Locators',async({page})=>{

    await page.goto("https://demoblaze.com");

    const CurrentURL = page.url();
    console.log('current url is',CurrentURL)
    await page.locator('#login2').click();
    await page.fill('input[id="loginusername"]', 'venky');
    await page.locator('input[id="loginpassword"]').fill('password');
    await page.getByRole('button', { name: 'Log in' });
    await page.getByRole('button',{name: 'Log in'}).click();
        await page.pause();
})