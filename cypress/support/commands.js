Cypress.Commands.add("fetchContracts", () => {
    cy.request("http://localhost:3000/contracts").then((apiResponse) => {
      const apiData = apiResponse.body;
  
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
  
        // Set it as an alias to use later in your tests
        cy.wrap(updatedContracts).as("contractsData");
      });
    });
  });
  