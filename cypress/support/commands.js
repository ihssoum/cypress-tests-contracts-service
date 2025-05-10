Cypress.Commands.add("fetchContracts", () => {
  cy.request("http://localhost:3000/contracts?client=abt").then(
    (apiResponse) => {
      const apiData = apiResponse.body.map((contract) => {
        return {
          ...contract,
          id: Number(contract.id),
        };
      });
      //console.log("API Data:", apiData);
      cy.fixture("getContracts.json").then((contracts) => {
        const updatedContracts = contracts.map((contract) => {
          if (contract.responseBody && contract.responseBody.length > 0) {
            return contract;
          } else {
            if (
              contract.queryParams &&
              Object.keys(contract.queryParams).length > 0
            ) {
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
              console.log("hana");
              console.log(contract.responseBody);
            }
          }
          return contract;
        });
        console.log(updatedContracts);
        cy.task("writeFile", {
          filePath: "getContracts.json",
          content: JSON.stringify(updatedContracts, null, 2),
        });

        //console.log(updatedContracts);
      });
    }
  );
});
Cypress.Commands.add("fetchContractById", (contractId) => {
  const client = "abt";

  cy.request(`http://localhost:3000/contracts/by-id/${contractId}?client=${client}`)
    .then((response) => {
      const contractData = response.body;

      cy.fixture("getContractByIdResponseSchema.json").then((contracts) => {
        const updatedContracts = contracts.map((contract) => {
          // If this contract matches the requested ID, update its responseBody
          if (
            contract.queryParams &&
            Number(contract.queryParams.id) === Number(contractId)
          ) {
            contract.responseBody = contractData;
          }
          return contract;
        });

        cy.task("writeFile", {
          filePath: "getContracts.json",
          content: JSON.stringify(updatedContracts, null, 2),
        });
      });
    });
});

