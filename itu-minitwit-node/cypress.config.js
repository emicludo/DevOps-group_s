const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000/api/'
  },
  video: false, 
  screenshotOnRunFailure: false,
  retries: {
    "runMode": 2,
    "openMode": null
  }
});
