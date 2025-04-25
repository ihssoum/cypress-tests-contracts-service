import { log } from "console";
import { defineConfig } from "cypress";
import fs from "fs";
import path from "path";

export default defineConfig({
  e2e: {
    env: {
        fixturesPath: "C:/Users/Achraf HAMMI/Documents/Adria/poc-cypress/cypress/fixtures",
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
