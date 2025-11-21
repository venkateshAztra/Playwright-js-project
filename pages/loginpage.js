/* eslint-env node */
/* eslint-disable no-undef */
const { clickElement, fillInput } = require('../utils/helpers');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.dashboardHeadingSelector = 'role=heading[name="Dashboard"]'; // using role selector
    this.adminLinkXPath = '//span[text()="Admin"]'; // XPath for Admin link
  }

  async goto() {
    await this.page.goto('https://opensource-demo.orangehrmlive.com/');
  }

  async login(username, password) {
    try {
      await fillInput(this.page, '[placeholder="Username"]', username);
      await fillInput(this.page, '[placeholder="Password"]', password);
      await clickElement(this.page, 'button:has-text("Login")');
      console.log('✅ Login attempted using helpers');
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

  async isLoginSuccessful() {
    try {
      const dashboardHeading = this.page.getByRole('heading', { name: 'Dashboard' });
      await dashboardHeading.waitFor({ state: 'visible', timeout: 5000 });
      console.log('✅ Dashboard is visible. Login successful.');
      return dashboardHeading;
    } catch (error) {
      console.error('❌ Dashboard not visible. Login might have failed:', error);
      throw error;
    }
  }

  async clickAdmin() {
    try {
      await clickElement(this.page, this.adminLinkXPath);
      console.log('✅ Admin link clicked using helper');
    } catch (error) {
      console.error('❌ Failed to click Admin link:', error);
      throw error;
    }
  }
}

module.exports = { LoginPage };
