/* eslint-disable no-undef */
// @ts-check


class Practicejson {
    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('https://testautomationpractice.blogspot.com/')

    }

    async enterName(name) {
        try {
            const nameInput = this.page.getByPlaceholder('Enter Name'); // Moved here
            await nameInput.fill(name);

            const enteredName = await nameInput.inputValue();
            console.log(enteredName);
        } catch (error) {
            console.log('Name not entered');
            throw error;
        }
    }

    async enterEmail(email) {
        try {
            const emailInput = await this.page.locator('#email');
            await emailInput.fill(email)
        } catch (error) {

            console.log('email not entered', error)
        }
    }


    async enterMobileNumber(number) {
        try {
            const mobileNum = await this.page.locator('#phone');
            await mobileNum.fill(number)
            const entered = await mobileNum.inputValue();
            console.log(entered)
        } catch (error) {

            console.log('not entered mob num', error)
            throw error;
        }
    }

    async enterAddress(Address) {
        try {

            const address = await this.page.locator('#textarea');
            await address.fill(Address)
            const enteredAddress = await address.inputValue();
            console.log(enteredAddress)
        } catch (error) {
            console.log('Address not entered', error)
            throw error;
        }
    }

    async clickcheckbox() {
        try {
            const maleCheckBox = await this.page.locator('#male')
            await maleCheckBox.check();
            const ischecked = await maleCheckBox.isChecked()
            console.log('checkbox checked', ischecked)
        } catch (error) {
            console.log('check box not clicked', error)

        }
    }

    




}
module.exports = { Practicejson }