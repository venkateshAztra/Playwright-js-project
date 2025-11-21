/* eslint-env node */
/* eslint-disable no-undef, no-unused-vars */
const { expect } = require('@playwright/test');

class SelfHealing {
  constructor(page) {
    this.page = page;
  }

  async smartClick(selectors, elementName = 'element') {
    for (const selector of selectors) {
      try {
        await this.page.click(selector, { timeout: 5000 });
        console.log(`✅ Found ${elementName} with: ${selector}`);
        return true;
      } catch (error) {
        console.log(`❌ Failed ${elementName} with: ${selector}`);
        continue;
      }
    }
    throw new Error(`❌ ${elementName} not found with any selector`);
  }

  async smartFill(selectors, value, fieldName = 'field') {
    for (const selector of selectors) {
      try {
        await this.page.fill(selector, value, { timeout: 5000 });
        console.log(`✅ Found ${fieldName} with: ${selector}`);
        return true;
      } catch (error) {
        console.log(`❌ Failed ${fieldName} with: ${selector}`);
        continue;
      }
    }
    throw new Error(`❌ ${fieldName} not found with any selector`);
  }

  async waitForAnyElement(selectors, timeout = 10000) {
    for (const selector of selectors) {
      try {
        await this.page.waitForSelector(selector, { timeout: timeout/selectors.length });
        return selector;
      } catch (error) {
        continue;
      }
    }
    throw new Error('No elements found');
  }

  async smartExpect(selectors) {
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector);
        await expect(element).toBeVisible({ timeout: 3000 });
        return selector;
      } catch (error) {
        continue;
      }
    }
    throw new Error('No elements matched expectation');
  }
}

module.exports = SelfHealing;