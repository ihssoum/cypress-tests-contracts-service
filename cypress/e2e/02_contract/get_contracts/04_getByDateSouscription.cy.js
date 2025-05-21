describe("GET /api/v1/contracts - Search by dateSouscriptionMaxR and dateSouscriptionMinR", () => {
  beforeEach(function () {
    cy.getToken();
    cy.fetchContractsBySubscriptionDate();
    cy.fixture("getContractsBysubscriptionDate.json").as("contractsData");
  });
  it("TC25 | should return 200 and a list of contracts for valid dateSouscriptionMaxR", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "25");

      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.status).to.eq(
          testCase.status
        );
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

  it("TC26 | should return 400 for invalid date format in dateSouscriptionMaxR", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "26");

      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto).to.include({
          status: testCase.status,
        });
        expect(res.body.ResponseWrapperContractListDto.error).to.include({
          message: testCase.message,
          codeMessage: testCase.codeMessage,
        });
      });
    });
  });

  it("TC27 | should return 200 and a list of all contracts for extreme future dateSouscriptionMaxR", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "27");

      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.status).to.equal(
          testCase.status
        );
        testCase.responseBody.forEach((expectedContract, index) => {
          expect(
            res.body.ResponseWrapperContractListDto.data.content[index]
          ).to.deep.include(expectedContract);
        });
      });
    });
  });

  it("TC28 | should return 400 for dateSouscriptionMaxR with complete date format", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "28");

      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto).to.include({
          status: testCase.status,
        });
        expect(res.body.ResponseWrapperContractListDto.error).to.include({
          message: testCase.message,
          codeMessage: testCase.codeMessage,
        });
      });
    });
  });

  it("TC29 | should return 200 for valid dateSouscriptionMinR", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "29");

      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.status).to.equal(
          testCase.status
        );
        testCase.responseBody.forEach((expectedContract, index) => {
          expect(
            res.body.ResponseWrapperContractListDto.data.content[index]
          ).to.deep.include(expectedContract);
        });
      });
    });
  });

  it("TC30 | should return 400 for invalid date format in dateSouscriptionMinR", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "30");

      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto).to.include({
          status: testCase.status,
        });
        expect(res.body.ResponseWrapperContractListDto.error).to.include({
          message: testCase.message,
          codeMessage: testCase.codeMessage,
        });
      });
    });
  });

  it("TC31 | should return 400 for dateSouscriptionMinR with complete date format", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "31");

      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto).to.include({
          status: testCase.status,
        });
        expect(res.body.ResponseWrapperContractListDto.error).to.include({
          message: testCase.message,
          codeMessage: testCase.codeMessage,
        });
      });
    });
  });

  it("TC32 | should return 200 and a list of all contracts for extreme past dateSouscriptionMinR", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "32");

      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`,
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.status).to.equal(
          testCase.status
        );
        expect(res.body.ResponseWrapperContractListDto).to.include({
          message: testCase.message,
          codeMessage: testCase.codeMessage,
        });
        testCase.responseBody.forEach((expectedContract, index) => {
          expect(
            res.body.ResponseWrapperContractListDto.data.content[index]
          ).to.deep.include(expectedContract);
        });
      });
    });
  });
  it("TC33 | should return 200 for valid datePattern with dateSouscriptionMaxR", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "33");

      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`, // L'URL doit inclure dateSouscriptionMinR, dateSouscriptionMaxR et datePattern
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.status).to.equal(
          testCase.status
        );
        expect(res.body.ResponseWrapperContractListDto).to.include({
          message: testCase.message,
          codeMessage: testCase.codeMessage,
        });
        testCase.responseBody.forEach((expectedContract, index) => {
          expect(
            res.body.ResponseWrapperContractListDto.data.content[index]
          ).to.deep.include(expectedContract);
        });
      });
    });
  });
  it("TC34 | should return 200 for valid datePattern with dateSouscriptionMinR", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "34");

      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`, // L'URL doit inclure dateSouscriptionMinR, dateSouscriptionMaxR et datePattern
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.status).to.equal(
          testCase.status
        );
        expect(res.body.ResponseWrapperContractListDto).to.include({
          message: testCase.message,
          codeMessage: testCase.codeMessage,
        });
        testCase.responseBody.forEach((expectedContract, index) => {
          expect(
            res.body.ResponseWrapperContractListDto.data.content[index]
          ).to.deep.include(expectedContract);
        });
      });
    });
  });

  it("TC35 | should return 200 for valid dateSouscriptionMaxR and dateSouscriptionMinR(the contracts between the 2 dates )", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "35");

      cy.request({
        method: testCase.method,
        url: `/${testCase.api}`, // L'URL doit inclure dateSouscriptionMinR, dateSouscriptionMaxR et datePattern
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractListDto.status).to.equal(
          testCase.status
        );
        expect(res.body.ResponseWrapperContractListDto).to.include({
          message: testCase.message,
          codeMessage: testCase.codeMessage,
        });
        testCase.responseBody.forEach((expectedContract, index) => {
          expect(
            res.body.ResponseWrapperContractListDto.data.content[index]
          ).to.deep.include(expectedContract);
        });
      });
    });
  });
});
