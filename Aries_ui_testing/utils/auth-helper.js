class AuthHelper {
  constructor(page) {
    this.page = page;
  }

  async login(username, password) {
    await this.page.fill('#username', username);
    await this.page.fill('#password', password);
    await this.page.click('#login-button');
  }

  async logout() {
    await this.page.click('#logout-button');
  }

  async isLoggedIn() {
    return await this.page.locator('#user-menu').isVisible();
  }
}

module.exports = AuthHelper;