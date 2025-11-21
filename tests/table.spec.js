
const { expect, test } = require('@playwright/test');
const { describe } = require('node:test');
const { execPath } = require('process');


test('handling tables', async ({ page }) => {

    await page.goto('https://testautomationpractice.blogspot.com/');
    try {
        const name = page.getByRole('textbox', { name: 'Name' });// get by role
        // await page.locator('#name').fill('Venkay') // with id 
        // await page.getByPlaceholder('Enter Name').fill("place")// with placeholders 
        // await page.locator('input[id="name"]').fill('with CSS selector') // with css selector 
        // await page.locator('//input[@id="name"]').fill("with x-path ") // with x-path


        await name.fill("venky")
        const enteredName = await name.inputValue();
        console.log(" Entered Name is : ", enteredName)
    }
    catch (error) {

        console.error('name entering failed,', error)
    }


    try {
        const emailInput = page.getByRole('textbox', { name: 'Email' });
        await emailInput.fill('venky22@gmail.com');
        const enteredEmail = await emailInput.inputValue();
        console.log('Entered email:', enteredEmail);
    } catch (error) {
        console.error('Failed to enter or fetch email:', error);
    }

    try {

        const enterPhone = await page.getByPlaceholder('Enter Phone');
        await enterPhone.fill('7457876781')
        const enteredPhone = await enterPhone.inputValue();
        console.log("Entered Num : ", enteredPhone)


    } catch (error) {

        console.error('num not entered', error);
    }

    try {

        const address = page.getByLabel('Address');
        await address.fill('Hyderabad');
        const enteredAddress = await address.inputValue();
        console.log('Entered Address:', enteredAddress)
    } catch (error) {
        console.error('Entering address failed', error)
    }

    const mousehiver = await page.getByRole('button', { name: 'Point Me' });
    await mousehiver.hover();
    await page.waitForTimeout(3000)
    const mobiles = await page.getByRole('link', { name: 'Mobiles' }); ////a[normalize-space()='Mobiles']
    await page.waitForTimeout(3000)

    await mobiles.click();
    await page.waitForTimeout(3000)

    const drag = await page.getByText('Drag me to my target');
    const drop = await page.getByText('Drop here');



    //Approach 1

    // await drag.hover();
    // await page.mouse.down();

    // await drop.hover();
    // await page.mouse.up()


    // Approach 2

    await drag.dragTo(drop);

    await page.locator('#field1').fill('copy')

    const doubleclick = await page.getByRole('button', { name: 'Copy Text' });
    await doubleclick.dblclick();

    const textverify = await page.locator('#field2');
    await expect(textverify).toHaveValue('copy')

    await page.pause()

    // const table = await page.locator('[id="productTable"]')
    // await expect(table).toBeVisible();
    // console.log(table)

    // const coloumns = await page.locator('thead tr th')
    // console.log("No of coloumns :",await coloumns.count())
    // await expect(coloumns.count).toBe(4)

    // const columns = await page.locator('thead tr th');
    // console.log("No of columns:", await columns.count());
    // await expect(columns).toHaveCount(4);

    // const rows  = await page.locator('tbody tr td') 
    // console.log('NO of rows',await rows.count())






})


