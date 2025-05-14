Cypress.Commands.add("updateOtpData", (otpData, response, testCaseId) => {
  const updatedOtpData = otpData.map((tc) =>
    tc.testCaseId === testCaseId
      ? {
          ...tc,
          responseBody: {
            ...tc.responseBody,
            data: {
              ...tc.responseBody.data,
              identifier: response,
            },
          },
        }
      : tc
  );

  cy.writeFile("cypress/fixtures/otp.json", updatedOtpData);
});


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
                contract.responseBody = [matchingData];

                console.log("queryParams:", contract.queryParams);
              }
            } else {
              contract.responseBody = apiData;
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

Cypress.Commands.add("fetchContractsBySubscriptionDate", () => {
  cy.request("http://localhost:3000/contracts?client=abt").then(
    (apiResponse) => {
      const apiData = apiResponse.body.map((contract) => ({
        ...contract,
        id: Number(contract.id),
      }));

      cy.fixture("getContractsBySubscriptionDate.json").then((contracts) => {
        const updatedContracts = contracts.map((contract) => {
          const queryParams = contract.queryParams || {};

          // 💡 Toujours recalculer responseBody (même si déjà présent)
          let filteredData = [...apiData];

          // ✅ Filtrage par dateSouscriptionMinR
          if (queryParams.dateSouscriptionMinR) {
            const minDate = new Date(
              queryParams.dateSouscriptionMinR.split("-").reverse().join("-")
            );
            filteredData = filteredData.filter((item) => {
              const itemDate = new Date(
                item.subscriptionDate.split("-").reverse().join("-")
              );
              return itemDate >= minDate;
            });
          }

          // ✅ Filtrage par dateSouscriptionMaxR
          if (queryParams.dateSouscriptionMaxR) {
            const maxDate = new Date(
              queryParams.dateSouscriptionMaxR.split("-").reverse().join("-")
            );
            filteredData = filteredData.filter((item) => {
              const itemDate = new Date(
                item.subscriptionDate.split("-").reverse().join("-")
              );
              return itemDate <= maxDate;
            });
          }

          contract.responseBody = filteredData;
          return contract;
        });

        cy.task("writeFile", {
          filePath: "getContractsBySubscriptionDate.json",
          content: JSON.stringify(updatedContracts, null, 2),
        });
      });
    }
  );
});
Cypress.Commands.add("fetchContractsByRattachement", () => {
  cy.request("http://localhost:3000/contracts?client=abt").then(
    (apiResponse) => {
      const apiData = apiResponse.body.map((contract) => ({
        ...contract,
        id: Number(contract.id),
      }));
      cy.fixture("getContractsByRattachement.json").then((contracts) => {
        const updatedContracts = contracts.map((contract) => {
          const queryParams = contract.queryParams || {};
          let filteredData = [...apiData];

          if (
            queryParams.rattachement === true ||
            queryParams.rattachement === "true"
          ) {
            // Garder ceux avec au moins 1 abonné
            filteredData = filteredData.filter(
              (item) => item.numberOfSubscribers >= 1
            );
          } else if (
            queryParams.rattachement === false ||
            queryParams.rattachement === "false"
          ) {
            // Garder ceux avec 0 abonné
            filteredData = filteredData.filter(
              (item) => item.numberOfSubscribers === 0
            );
          }

          contract.responseBody = filteredData;
          return contract;
        });

        cy.task("writeFile", {
          filePath: "getContractsByRattachement.json",
          content: JSON.stringify(updatedContracts, null, 2),
        });
      });
    }
  );
});


Cypress.Commands.add("fetchContractById", (client = "abt") => {
  cy.request({
    method: 'GET',
    url: `http://localhost:3000/contracts-id?client=${client}`,
    failOnStatusCode: false
  }).then((apiResponse) => {
    // Vérifier le statut
    expect([200, 304]).to.include(apiResponse.status);
    
    // Traiter la réponse...
    const apiData = Array.isArray(apiResponse.body) 
      ? apiResponse.body 
      : [apiResponse.body];
    
    cy.log("Fetched API Data:", apiData);

    cy.fixture("getContractByIdResponseSchema.json").then((contracts) => {
      const updatedContracts = contracts.map((contract) => {
        if (
          contract.queryParams &&
          typeof contract.queryParams.id !== "undefined"
        ) {
          // Look for contractInstance.id instead of just id
          const contractData = apiData.find(
            (item) => item.contractInstance && 
                     item.contractInstance.id === Number(contract.queryParams.id)
          );
          
          if (contractData) {
            contract.responseBody = contractData;
            cy.log(`Matched ID ${contract.queryParams.id}:`, contractData);
          } else {
            cy.log(`No match found for ID: ${contract.queryParams.id}`);
            // Log additional debug info
            cy.log("Available IDs:", apiData.map(item => 
              item.contractInstance ? item.contractInstance.id : "no contractInstance"
            ));
          }
        }
        return contract;
      });

      cy.log("Final updated contracts:", updatedContracts);

      // Utiliser seulement le nom du fichier, sans le chemin
      cy.task("writeFile", {
        filePath: "getContractByIdResponseSchema.json",
        content: JSON.stringify(updatedContracts, null, 2),
      });
    });
  });
});
