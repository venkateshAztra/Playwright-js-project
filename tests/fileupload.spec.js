const { test, expect } = require('@playwright/test')

test('file uploading', async ({ page }) => {


    await page.goto("https://testautomationpractice.blogspot.com/")



    const filepath = "C:/Users/LENOVO/Downloads/upload.jpeg";
    await page.waitForTimeout(3000)

    // single file uploading
    const fileInput = await page.setInputFiles('[id="singleFileInput"]', filepath);
    // await fileInput.scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000)

    const uploadSingleFile = await page.getByRole('button', { name: 'Upload Single File' });
    await page.waitForTimeout(3000)

    uploadSingleFile.click()


    // multiple filr uploading 

    const multiplefiles = await page.locator('#multipleFilesInput');
    // multiplefiles.scrollIntoViewIfNeeded();
    const filepaths = ["C:/Users/LENOVO/Downloads/uploadd.jpeg", "C:/Users/LENOVO/Downloads/upload.jpeg"]

    await multiplefiles.setInputFiles(filepaths);

    const muliuploadbuton = await page.getByRole('button', { name: 'Upload Multiple Files' });
    muliuploadbuton.click()
    await page.pause()
})