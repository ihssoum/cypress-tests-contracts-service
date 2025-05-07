describe("Get all contracts", () => {
  before(function () {
    // Charger les contrats avant d'exécuter les tests
    cy.fetchContracts();
    cy.fixture("getContracts.json").as("contractsData");
    cy.getToken();
  });

  it("TC01 | Get all contracts without filters", function () {
    cy.get("@authToken").then(function (token) {
      const url = Cypress.env("getContractsUrl");
      //cy.log(token);
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "1");
      cy.request({
        method: testCase.method,
        url: `${url}/${testCase.api}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(JSON.stringify(res.body));

        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.data.content).to.be.an(
          "array"
        );
        expect(res.body.ResponseWrapperContractListDto).to.include({
          status: "SUCCESS",
        });
        expect(res.body.ResponseWrapperContractListDto).to.include({
          message: "The list has been retrieved successfully.",
          codeMessage: "SUCCESS_CTR_0003",
        });
        // Vérifie chaque contrat
        testCase.responseBody.forEach((expectedContract, index) => {
          expect(
            res.body.ResponseWrapperContractListDto.data.content[index]
          ).to.deep.include(expectedContract);
        });
      });
    });
  });
});
