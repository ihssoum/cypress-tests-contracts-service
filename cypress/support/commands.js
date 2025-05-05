Cypress.Commands.add("fetchContracts", () => {
  cy.request("http://localhost:3000/contracts?client=abt").then(
    (apiResponse) => {
      const apiData = apiResponse.body.map((contract) => {
        return {
          ...contract,
          id: Number(contract.id),
        };
      });

      cy.fixture("contracts.json").then((contracts) => {
        const updatedContracts = contracts.map((contract) => {
          if (contract.queryParams) {
            const matchingData = apiData.find((item) => {
              return Object.entries(contract.queryParams).every(
                ([key, value]) => item[key] === value
              );
            });
            if (matchingData) {
              contract.responseBody = matchingData;
            }
          } else {
            contract.responseBody = apiData;
          }
          return contract;
        });

        cy.task("writeFile", {
          filePath: "contracts.json",
          content: JSON.stringify(updatedContracts, null, 2),
        });
      });
    }
  );
});
