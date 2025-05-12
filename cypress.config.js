import fs from "fs";
import path from "path";

export default {
  e2e: {
    env: {
      fixturesPath:
        "D:/AdriaTest/cypress-tests-contracts-service/cypress/fixtures",
      getContractsUrl: "http://192.168.145.209:8030/api/v1/contracts",
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
};
