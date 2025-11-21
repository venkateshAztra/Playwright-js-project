// helpers.js
async function clickElement(page, selector) {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible' });
  await element.click();
}

async function fillInput(page, selector, value) {
  const input = page.locator(selector);
  await input.fill(value);
}

module.exports = { clickElement, fillInput };
