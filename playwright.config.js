// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
testDir: './',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['junit', { outputFile: 'results.xml' }],
    ['json', { outputFile: 'test-results.json' }],
    ['html', { outputFolder: 'html-report', open: 'never' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    video: 'retain-on-failure',  
    screenshot: 'only-on-failure', 

  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // {
    //   name: 'Google Chrome',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     channel: 'chrome',
    //   },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});





//npx playwright test
//npx playwright test tests/example.spec.ts
//npx playwright test --headed
//npx playwright show-reportnode testBlog.js

//npx playwright test --project=chrome
//npx playwright test --project=chrome --headed
// node JsPracice.js

//debug commands 
// npx playwright test "example.spec.js" --ui
// npx playwright test "example.spec.js" --debug
// npx playwright test "example.spec.js" --heaed

// # Record tests
// npx playwright codegen your-url
//npx playwright codegen http://aries-web.s3-website-us-east-1.amazonaws.com/#/sjjaAcpDDrBlPMk09e3l9aux6/login


//npx playwright test "example.spec.js"
//npx playwright codegen
//npx playwright codegen --help


// create a new file
//npx playwright codegen --output=tests/login.spec.js

// npx playwright test --listnpx playwright test dropdown.spec.js --headed
