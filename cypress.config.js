const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  e2e: {
    env: {
      fixturesPath:
        "C:/Users/pc/Documents/Adria-QA/adria-dataprovider-service-cy/cypress-tests-contracts-service/cypress/fixtures",
      getContractsUrl: "http://192.168.145.209:8030",
    },
    setupNodeEvents(on, config) {
      on("task", {
        writeFile({ filePath, content }) {
          const absolutePath = path.join(config.env.fixturesPath, filePath);
          fs.writeFileSync(absolutePath, content);
          return null;
        },
        logMessage({ message }) {
          console.log(message);
          return null;
        },
      });
    },
  },
 
});
