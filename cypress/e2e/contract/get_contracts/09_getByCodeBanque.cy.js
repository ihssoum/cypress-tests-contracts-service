describe("GET /api/v1/contracts - Recherche par codeBanque", () => {
  beforeEach(function () {
    cy.fetchContracts();
    cy.fixture("getContracts.json").as("contractsData");
    cy.getToken();
  });

  const url = Cypress.env("getContractsUrl");

  it("TC51 | should return 200 and contracts for valid codeBanque", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "51");
      cy.request({
        method: testCase.method,
        url: `${url}/${testCase.api}`,
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.status).to.eq(testCase.status);
        expect(res.body.ResponseWrapperContractListDto.data.content).to.be.an("array");

        testCase.responseBody.forEach((expectedContract, index) => {
          const actual = res.body.ResponseWrapperContractListDto.data.content[index];
          expect(actual).to.deep.include(expectedContract);
          expect(actual.codeBanque).to.eq(testCase.queryParams.codeBanque);
        });
      });
    });
  });

  it("TC52 | should return 200 and empty list for non-existent codeBanque", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "52");
      cy.request({
        method: testCase.method,
        url: `${url}/${testCase.api}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.status).to.eq(testCase.status);
        expect(res.body.ResponseWrapperContractListDto.data.content).to.have.length(0);
      });
    });
  });

  it("TC53 | should return 400 when codeBanque is a string", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "53");
      cy.request({
        method: testCase.method,
        url: `${url}/${testCase.api}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.status).to.eq(testCase.status);
        expect(res.body.ResponseWrapperContractListDto.error.code).to.eq(testCase.responseBody.code);
        expect(res.body.ResponseWrapperContractListDto.error.message).to.eq(testCase.responseBody.message);
      });
    });
  });
});
