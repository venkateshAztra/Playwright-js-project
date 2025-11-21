const { test, expect } = require('@playwright/test');
const { Practicejson } = require('../../Playwright-js-project/pages/Practicejson');
const { LoginPage } = require('../../Playwright-js-project/pages/loginpage');

const logindata = require('../testdata/logindata.json');
const logindatajs = require('../testdata/logindatajs');

logindata.forEach((data, index) => {
  test('json practice', async ({ page }) => {

    const practicejson = new Practicejson(page);
    await practicejson.goto();
    await practicejson.enterName(data.name)
    await practicejson.enterEmail(data.email)
    await practicejson.enterMobileNumber(data.number)
    await practicejson.enterAddress(data.Address)
    await practicejson.clickcheckbox()



  })
})