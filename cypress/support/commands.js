Cypress.Commands.add("fetchContracts", () => {
  cy.request("http://localhost:3000/contracts?client=abt").then((apiResponse) => {
    const apiData = apiResponse.body.map((contract) => ({
      ...contract,
      id: Number(contract.id),
    }));

    cy.fixture("getContracts.json").then((contracts) => {
      const updatedContracts = contracts.map((contract) => {
        // If responseBody is already filled, skip
        if (contract.responseBody && contract.responseBody.length > 0) {
          return contract;
        }

        // If queryParams contains ID (assumed to be "id")
        if (contract.queryParams && contract.queryParams.id) {
          const contractId = contract.queryParams.id;
          const matchingData = apiData.find(item => item.id === Number(contractId));

          if (matchingData) {
            // Fetch full data for specific ID via by-id endpoint
            return cy.request(
              `http://localhost:3000/contracts/by-id/${contractId}?client=abt`
            ).then((response) => {
              contract.responseBody = response.body;
              return contract;
            });
          }
        } else {
          // No specific ID: assume list endpoint
          contract.responseBody = apiData;
          return contract;
        }

        return contract;
      });

      // Handle all promises (since map might return promises)
      Promise.all(updatedContracts).then((finalizedContracts) => {
        cy.task("writeFile", {
          filePath: "getContracts.json",
          content: JSON.stringify(finalizedContracts, null, 2),
        });
      });
    });
  });
});
