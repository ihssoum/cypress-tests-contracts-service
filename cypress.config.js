const { defineConfig } = require("cypress");
const oracledb = require("oracledb");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

module.exports = defineConfig ({
  e2e: {
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      on("task", {
        async fetchReceivedOtpFromDb({ query }) {
          try {
            const connection = await oracledb.getConnection({
              user: "ADRIA_ABT",
              password: "ADRIA_ABT",
              connectString: "localhost:1521/ADRIA",
            });

            console.log("query", query);

            // Execute the query passed as an argument
            const result = await connection.execute(query);

            await connection.close();
            return result.rows[0]; // Indicate success
          } catch (err) {
            console.error(err);
            return err.message; // Return the error message
          }
        },
        async newLog(message) {
          console.log(message);
          return true; // Indicate success
        },
        async clearOtpData({ query }) {
          try {
            const connection = await oracledb.getConnection({
              user: "ADRIA_ABT",
              password: "ADRIA_ABT",
              connectString: "localhost:1521/ADRIA",
            });

            // Execute the query passed as an argument
            const result = await connection.execute(query);

            await connection.close();
            return null; // Indicate success
          } catch (err) {
            console.error(err);
            return err.message; // Return the error message
          }
        },
        async verifyContractDetailsOtp({ query }) {
          try {
            const connection = await oracledb.getConnection({
              user: "ADRIA_ABT",
              password: "ADRIA_ABT",
              connectString: "localhost:1521/ADRIA",
            });

            // Execute the query passed as an argument
            const result = await connection.execute(query, [], {
              autoCommit: true,
            });

            await connection.close();
            return result.rowsAffected; // Return the number of rows inserted
          } catch (err) {
            console.error(err);
            return err.message; // Return the error message
          }
        },
      });
    },
    baseUrl: "http://localhost:8030",
    env: {
      allure: true,
    },
  },
});
