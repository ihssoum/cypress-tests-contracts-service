describe("GET /api/v1/contracts - Recherche par intituleRCR", () => {
  beforeEach(function () {
    cy.fetchContracts();
    cy.fixture("getContracts.json").as("contractsData");
    cy.getToken();
  });

  const url = Cypress.env("getContractsUrl");

  it("TC43 | should return 200 and contracts for valid intituleRCR", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "43");
      cy.request({
        method: testCase.method,
        url: `${url}/${testCase.api}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.status).to.eq(
          testCase.status
        );
        expect(res.body.ResponseWrapperContractListDto.data.content).to.be.an(
          "array"
        );

        testCase.responseBody.forEach((expectedContract, index) => {
          const actualContract =
            res.body.ResponseWrapperContractListDto.data.content[index];
          expect(actualContract).to.deep.include(expectedContract);
          expect(actualContract).to.have.property(
            "commercialRelationTitle",
            testCase.queryParams.commercialRelationTitle
          );
        });
      });
    });
  });

  it("TC44 | should return 200 and an empty list for a non-existent intituleRCR", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "37");
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
        expect(
          res.body.ResponseWrapperContractListDto.data.content
        ).to.have.length(0);
      });
    });
  });

  it("TC45 | should return 400 for too long intituleRCR", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "45");
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
        expect(res.body.ResponseWrapperContractListDto.error.code).to.eq(
          testCase.responseBody.code
        );
        expect(res.body.ResponseWrapperContractListDto.error.message).to.eq(
          testCase.responseBody.message
        );
      });
    });
  });
  it("TC46 | should return 400 when intituleRCR is not a string", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "46");
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
        expect(res.body.ResponseWrapperContractListDto.error.code).to.eq(
          testCase.responseBody.code
        );
        expect(res.body.ResponseWrapperContractListDto.error.message).to.eq(
          testCase.responseBody.message
        );
      });
    });
  });
});
