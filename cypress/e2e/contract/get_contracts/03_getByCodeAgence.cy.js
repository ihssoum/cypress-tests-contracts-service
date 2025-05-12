describe("GET /api/v1/contracts - Filtrage par code agence (agenceR)", () => {
  beforeEach(function () {
    cy.fetchContracts();
    cy.fixture("getContracts.json").as("contractsData");
    cy.getToken();
  });

  const url = Cypress.env("getContractsUrl");

  it("TC14 | should return 200 and a list of contracts for a valid agency code", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "14");
      cy.request({
        method: testCase.method,
        url: `${url}/${testCase.api}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto).to.have.property(
          "status",
          testCase.status
        );
        expect(res.body.ResponseWrapperContractListDto.data.content).to.be.an(
          "array"
        );

        testCase.responseBody.forEach((expectedContract, index) => {
          const actualContract =
            res.body.ResponseWrapperContractListDto.data.content[index];
          expect(actualContract).to.deep.include(expectedContract);
          expect(actualContract).to.have.property("commercialAgency");
        });
      });
    });
  });

  it("TC15 | should return 200 and an empty list for a non existent agency code", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "15");
      cy.request({
        method: testCase.method,
        url: `${url}/${testCase.api}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.status).to.equal(
          testCase.status
        );
        expect(res.body.ResponseWrapperContractListDto).to.include({
          status: testCase.status,
        });
        expect(res.body.ResponseWrapperContractListDto).to.include({
          message: testCase.message,
          codeMessage: testCase.codeMessage,
        });
      });
    });
  });

  it("TC16 | Search by agency code that does not respect the appropriate format (87)", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "16");
      cy.request({
        method: testCase.method,
        url: `${url}/${testCase.api}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto).to.have.property(
          "status",
          testCase.status
        );
        expect(res.body.ResponseWrapperContractListDto.error).to.include({
          code: testCase.responseBody.code,
          message: testCase.responseBody.message,
        });
      });
    });
  });

  it("TC17 | Search by agency code that does not respect the appropriate format (000AB)", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "17");
      cy.request({
        method: testCase.method,
        url: `${url}/${testCase.api}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto).to.have.property(
          "status",
          testCase.status
        );
      });
      expect(res.body.ResponseWrapperContractListDto.error).to.include({
        code: testCase.responseBody.code,
        message: testCase.responseBody.message,
      });
    });
  });

  it("TC18 | Search by agency code that does not respect the appropriate format (0001-0)", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "18");
      cy.request({
        method: testCase.method,
        url: `${url}/${testCase.api}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto).to.have.property(
          "status",
          testCase.status
        );
        expect(res.body.ResponseWrapperContractListDto.error).to.include({
          code: testCase.responseBody.code,
          message: testCase.responseBody.message,
        });
      });
    });
  });

  it("TC19 | should return 400 for boolean value in agenceR (true)", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "19");
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

  it("TC20 | should return 400 for boolean value in agenceR (false)", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "20");
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

  it("TC21 | should return 400 for special characters in agenceR", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "21");
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

  it("TC22 | should return all contracts when agenceR is empty", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "22");

      cy.request({
        method: "GET",
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
        testCase.responseBody.forEach((expectedContract, index) => {
          expect(
            res.body.ResponseWrapperContractListDto.data.content[index]
          ).to.deep.include(expectedContract);
        });
      });
    });
  });

  it("TC23 | should return 400 for extremely long code in agenceR", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "23");

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
  it("TC24 | should return 400 for 'agenceR' (malformed param name)", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "24");
      cy.request({
        method: testCase.method,
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
});
