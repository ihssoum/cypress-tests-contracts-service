const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // baseUrl: "http://localhost:3000", // Base URL for your application
    // env: {
    //   apiPath: "/api/v1", // Example global variable
    // },
  },
  
});
