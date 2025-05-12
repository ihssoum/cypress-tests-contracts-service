describe("GET /api/v1/contracts - Recherche par identifiantRC", () => {
  beforeEach(function () {
    cy.fetchContracts();
    cy.fixture("getContracts.json").as("contractsData");
    cy.getToken();
  });

  const url = Cypress.env("getContractsUrl");

  it("TC36 | should return 200 and a list of contracts for valid identifiantRC", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "36");
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
            "commercialRelationIdentifier",
            testCase.queryParams.contractIdentifier
          );
        });
      });
    });
  });

  it("TC37 | should return 200 and an empty list for non-existent identifiantRC", function () {
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

  it("TC38 | should return 400 for malformed identifiantRC", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "38");
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
        expect(res.body.ResponseWrapperContractListDto.error).to.include({
          code: testCase.responseBody.code,
          message: testCase.responseBody.message,
        });
      });
    });
  });
it("TC39 | should return 400 for special characters in identifiantRC", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "39");
      cy.request({
        method: testCase.method,
        url: `${url}/${testCase.api}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto).to.deep.include({
          status: testCase.status,
        });
        expect(res.body.ResponseWrapperContractListDto.error).to.include({
          code: testCase.responseBody.code,
          message: testCase.responseBody.message,
        });
      });
    });
  });
  it("TC40 | should return 400 for long code in identifiantRC (more than 7 numbers)", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "40");
      cy.request({
        method: "GET",
        url: `${url}/${testCase.api}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto).to.include({
          status: testCase.status,
        });
        expect(res.body.ResponseWrapperContractListDto.error).to.include({
          code: testCase.responseBody.code,
          message: testCase.responseBody.message,
        });
      });
    });
  });
  it("TC41 | should return 400 for boolean value in identifiantRC", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "41");
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
        expect(res.body.ResponseWrapperContractListDto.error).to.include({
          code: testCase.responseBody.code,
          message: testCase.responseBody.message,
        });
      });
    });
  });

  it("TC42 | should return all contracts when identifiantRC is empty", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "42");
      cy.request({
        method: testCase.method,
        url: `${url}/${testCase.api}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.data.content).to.be.an(
          "array"
        );
      });
    });
  });
});
