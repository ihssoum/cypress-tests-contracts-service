import { defineConfig } from "cypress";
import fs from "fs";
import path from "path";
import axios from "axios";

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on("task", {
        async fetchContractsData() {
          try {
            // Fetch data from an API
            const apiResponse = await axios.get(
              "http://localhost:3000/contracts"
            );
            const apiData = apiResponse.data;

            // Read all files in the fixtures folder
            const fixturesFolder = path.join(__dirname, "cypress", "fixtures");
            fs.readdirSync(fixturesFolder); // Removed unused variable 'files'

            // Collect JSON data from each file
            const contractsFixture = "contracts.json"; // Replace with your specific file name
            const filePath = path.join(fixturesFolder, contractsFixture);
            if (fs.existsSync(filePath)) {
              var jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
            } else {
              throw new Error(
                `File ${contractsFixture} does not exist in fixtures folder`
              );
            }
            // Iterate over the objects in contracts.json
            jsonData.forEach((contract) => {
              if (contract.queryParams) {
                const [key, value] = Object.entries(contract.queryParams)[0];

                // Find matching data in the API response
                const matchingData = apiData.find(
                  (item) => item[key] === value
                );

                if (matchingData) {
                  // Store the matching data in the responseBody object
                  contract.responseBody = matchingData;
                }
              }
            });

            // Write the updated jsonData back to the contracts.json file
            fs.writeFileSync(
              filePath,
              JSON.stringify(jsonData, null, 2),
              "utf8"
            );
          } catch (error) {
            console.error("Error fetching contracts data:", error);
            throw error;
          }
        },
      });
    },
  },
});
