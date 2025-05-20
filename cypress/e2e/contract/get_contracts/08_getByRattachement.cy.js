describe("GET /api/v1/contracts - Recherche par rattachement", () => {
  beforeEach(function () {
    cy.fetchContractsByRattachement();
    cy.fixture("getContractsByRattachement.json").as("contractsData");
    cy.getToken();
  });

  const url = Cypress.env("getContractsUrl");

  it("TC49 | should return 200 and contracts with rattachement=true", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "49");
      cy.request({
        method: testCase.method,
        url: `${url}/${testCase.api}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.status).to.eq(
          testCase.status
        );
        expect(res.body.ResponseWrapperContractListDto.data.content).to.be.an(
          "array"
        );

        // Optionnel : vérifier que chaque contrat a un rattachement actif selon ta structure
        res.body.ResponseWrapperContractListDto.data.content.forEach(
          (contract) => {
            expect(contract)
              .to.have.property("numberOfSubscribers")
              .and.to.be.greaterThan(0);
          }
        );
      });
    });
  });

  it("TC50 | should return 200 and contracts with rattachement=false or empty list", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "50");
      cy.request({
        method: testCase.method,
        url: `${url}/${testCase.api}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.status).to.eq(
          testCase.status
        );
        expect(res.body.ResponseWrapperContractListDto.data.content).to.be.an(
          "array"
        );

        // Optionnel : si la liste n'est pas vide, s'assurer que numberOfSubscribers est 0
        res.body.ResponseWrapperContractListDto.data.content.forEach(
          (contract) => {
            expect(contract).to.have.property("numberOfSubscribers", 0);
          }
        );
      });
    });
  });
});
