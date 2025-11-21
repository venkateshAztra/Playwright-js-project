/* eslint-env node */
/* eslint-disable no-undef */
const environments = {
  dev: {
    baseURL: 'https://dev.example.com',
    timeout: 30000
  },
  staging: {
    baseURL: 'https://staging.example.com',
    timeout: 30000
  },
  prod: {
    baseURL: 'https://example.com',
    timeout: 60000
  }
};

module.exports = environments;