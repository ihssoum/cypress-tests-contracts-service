// Cypress.Commands.add("debugg", (message, data) => {
//     Cypress.log({
//       name: "DEBUGG",
//       message: message,
//       consoleProps: () => {
//         return { data };
//       }
//     });
//     // Log to browser console as a backup
//     console.log(message, data);
//     return cy.wrap(data);
//   });

import { log } from "console";

Cypress.Commands.add("fetchContracts", () => {
  cy.request("http://localhost:3000/contracts").then((apiResponse) => {
    const apiData = apiResponse.body.map((contract => {
        return {
            ...contract,        
            id: Number(contract.id) 
          };
    }));

    cy.fixture("contracts.json").then((contracts) => {
      const updatedContracts = contracts.map((contract) => {
        if (contract.queryParams) {
          const [key, value] = Object.entries(contract.queryParams)[0];
          const matchingData = apiData.find((item) => item[key] === value);

          if (matchingData) {
            contract.responseBody = matchingData;
          }
        }
        return contract;
      });

      // Just pass the filename, not the full path
      cy.task("writeFile", {
        filePath: "contracts.json",
        content: JSON.stringify(updatedContracts, null, 2),
      });
    });
  });
});
