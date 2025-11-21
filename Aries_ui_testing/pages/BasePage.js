/* eslint-env node */
/* eslint-disable no-undef */
/* eslint-env node */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(url) {
    await this.page.goto(url);
  }

  async waitForElement(selector) {
    await this.page.waitForSelector(selector);
  }

  async getText(selector) {
    return await this.page.textContent(selector);
  }

  async click(selector) {
    await this.page.click(selector);
  }
}

module.exports = BasePage;