/* eslint-env node */
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginpage');
const { readCSV } = require('../utils/excelReader');

// Read test data from CSV
const loginDataCSV = readCSV('./testdata/logindata.csv');

loginDataCSV.forEach((data) => {
  test(`Login Test - ${data.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(data.username, data.password);

    const dashboard = await loginPage.isLoginSuccessful();
    await expect(dashboard).toBeVisible();

    console.log(`Login test passed for username: ${data.username}`);
  });
});


// loginData.forEach((data, index) => {
//   test('Login Test - ', async ({ page }) => {
//     const loginPage = new LoginPage(page);

//     await loginPage.goto();
//     await loginPage.login(data.username, data.password);

//     const dashboard = await loginPage.isLoginSuccessful();
//     await expect(dashboard).toBeVisible();

//     console.log(`Login test passed for username: ${data.username}`);
//   });
// });





// const { test, expect } = require('@playwright/test');
// const { LoginPage } = require('../../Playwright-js-project/pages/loginpage');
// const { readExcel } = require('../utils/excelReader');

// const loginData = readExcel('./testdata/logindata.xlsx', 'Sheet1'); 

// loginData.forEach((data) => {
//   test(`Login Test - ${data.username}`, async ({ page }) => {
//     const loginPage = new LoginPage(page);

//     await loginPage.goto();
//     await loginPage.login(data.username, data.password);

//     const dashboard = await loginPage.isLoginSuccessful();
//     await expect(dashboard).toBeVisible();

//     console.log(`Login test passed for username: ${data.username}`);
//   });
// });




// const { test, expect } = require('@playwright/test');
// const { LoginPage } = require('../../Playwright-js-project/pages/loginpage');
// const { readCSV } = require('../utils/excelReader'); 
// const loginData = readCSV('./testdata/logindata.csv'); 

// loginData.forEach((data) => {
//   test(`Login Test - ${data.username}`, async ({ page }) => {
//     const loginPage = new LoginPage(page);

//     await loginPage.goto();
//     await loginPage.login(data.username, data.password);

//     const dashboard = await loginPage.isLoginSuccessful();
//     await expect(dashboard).toBeVisible();

//     console.log(`Login test passed for username: ${data.username}`);
//   });
// });