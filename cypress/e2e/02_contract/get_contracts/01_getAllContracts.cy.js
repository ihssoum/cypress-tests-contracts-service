describe("Get all contracts", () => {
  before(function () {
    // Charger les contrats avant d'exécuter les tests
    cy.fetchContracts();
    cy.fixture("getContracts.json").as("contractsData");
    cy.getToken();
  });

  it("TC01 | Get all contracts without filters", function () {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "1");
      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
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
          status: testCase.status,
        });
        expect(res.body.ResponseWrapperContractListDto).to.include({
          message: testCase.message,
          codeMessage: testCase.codeMessage,
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
