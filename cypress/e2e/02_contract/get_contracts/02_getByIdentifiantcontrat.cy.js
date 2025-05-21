describe("GET /api/v1/contracts - identifiantContrat filter tests", () => {
  beforeEach(function () {
    cy.getToken();
    // Fetch contracts before running the tests
    cy.fetchContracts();
    cy.fixture("getContracts.json").as("contractsData");
  });
  it("TC02 | should return 200 and only one contract for a valid identifiantContrat", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "2");
      //cy.log(token)
      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.status).to.equal(
          testCase.status
        );

        expect(res.body.ResponseWrapperContractListDto.data.content).to.be.an(
          "array"
        );
        expect(
          res.body.ResponseWrapperContractListDto.data.content.length
        ).to.be.equal(1);
        expect(
          res.body.ResponseWrapperContractListDto.data.content[0]
        ).to.have.property(
          "contractIdentifier",
          testCase.queryParams.contractIdentifier
        );
        expect(
          res.body.ResponseWrapperContractListDto.data.content[0]
        ).to.deep.equal(testCase.responseBody[0]);
        expect(
          res.body.ResponseWrapperContractListDto.data.totalElements
        ).to.equal(1);
      });
    });
  });

  it("TC03 | should return 200 and an empty list for a non-existing identifiantContrat", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "3");
      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
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
  it("TC04 | should return 400 for identifiantContrat of type boolean(true)", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "4");
      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
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

  it("TC05 | should return 400 for identifiantContrat of type boolean(false)", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "5");
      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
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

  it("TC06 | should return 400 for identifiantContrat of type integer", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "6");
      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
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

  it("TC07 | should return 400 for identifiantContrat with special characters", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "7");
      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto).to.include({
          status: testCase.status,
        });
        expect(res.body.ResponseWrapperContractListDtoerror).to.include({
          code: testCase.responseBody.code,
          message: testCase.responseBody.message,
        });
      });
    });
  });
  it("TC08 | should return 400 for identifiantContrat with invalid format(B2221768690730C)", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "8");
      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
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
  it("TC09 | should return 400 for identifiantContrat with invalid format(D2221768690730A)", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "9");
      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
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
  it("TC10 | should return 400 for identifiantContrat with invalid format(B2221768A)", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "10");
      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
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
  it("TC11 | should return 400 for identifiantContrat with invalid format(B0000000000000A)", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "11");
      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
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
  it("TC12 | should return 200 for empty identifiantContrat", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "12");
      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.data.content).to.be.an(
          "array"
        );
        expect(res.body.ResponseWrapperContractListDto).to.include({
          status: testCase.status,
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

  it("TC13 | should return 400 for 'identifiantContrats' (malformed param name)", () => {
    cy.get("@authToken").then(function (token) {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "13");
      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
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
