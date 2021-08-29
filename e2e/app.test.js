/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable spaced-comment */

import puppetteer from 'puppeteer';

const childProcess = require('child_process');

let server = null;

jest.setTimeout(30000);
describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  const baseUrl = 'http://localhost:9000';
  beforeAll(async () => {
    server = await childProcess.fork(`${__dirname}/test-server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', () => {
        reject();
      });
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });
    browser = await puppetteer.launch({
      /* headless: true,
      slowMo: 100,
      devtools: false,*/
    });
    page = await browser.newPage();
  });
  afterAll(async () => {
    await browser.close();
    server.kill();
  });
  describe('Credit Card Validator form', () => {
    test('should add "valid" class for valid card number', async () => {
      await page.goto(baseUrl);
      const form = await page.$('[id=validate_form]');
      const input = await form.$('[id=validate_input]');
      await input.type('5084840100137725');
      const submit = await form.$('[id=validate_button]');
      submit.click();
      await page.waitForSelector('[id=validate_input].valid');
    });
    test('should add "invalid" class for valid card number', async () => {
      await page.goto(baseUrl);
      const form = await page.$('[id=validate_form]');
      const input = await form.$('[id=validate_input]');
      await input.type('5084840100137726');
      const submit = await form.$('[id=validate_button]');
      submit.click();
      await page.waitForSelector('[id=validate_input].invalid');
    });
  });
});
