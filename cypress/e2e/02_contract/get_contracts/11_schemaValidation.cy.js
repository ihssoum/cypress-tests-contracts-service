describe("Get all contracts for schema validation", () => {
  before(function () {
    cy.fetchContracts();

    cy.fixture("schemaValidation.json").as("contractSchema"); // chargement du schéma
    cy.fixture("getContracts.json").as("contractsData"); // chargement du schéma
    cy.getToken();
  });

  it("TC57 | schema validation", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "57");

      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((res) => {
        cy.log(JSON.stringify(res.body));

        const contracts = res.body.ResponseWrapperContractListDto.data.content;

        // ✅ Validation du statut
        expect(res.status).to.eq(testCase.statusCode);

        // ✅ Validation du schéma JSON
        expect(contracts).to.be.jsonSchema(this.contractSchema);
      });
    });
  });
});
