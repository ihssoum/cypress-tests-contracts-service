import { api, token } from "../support/config";

describe("GET /api/v1/contracts - identifiantContrat filter tests", () => {
  before(function () {
    // Fetch contracts before running the tests
    cy.fetchContracts();
    cy.fixture("getContracts.json").as("contractsData");
  });

  it("TC02 | should return 200 for a valid identifiantContrat", () => {
    const testCase = this.contractsData.find((tc) => tc.testCaseId === "2");
    cy.request({
      method: testCase.method,
      url: testCase.api,
      headers: { Authorization: token },
    }).then((res) => {
      expect(res.status).to.eq(testCase.statusCode);
      expect(res.body.data.content).to.be.an("array");
      expect(res.body.data.content.length).to.be.equal(1);
      expect(res.body.data.content[0]).to.have.property(
        "contractIdentifier",
        testCase.queryParams.identifiantContrat
      );
      expect(res.body.data.content[0]).to.deep.equal(testCase.responseBody);
    });
  });

  it("TC03 | should return 404 for a non-existing identifiantContrat", () => {
    const testCase = this.contractsData.find((tc) => tc.testCaseId === "3");
    cy.request({
      method: testCase.method,
      url: testCase.api,
      headers: { Authorization: token },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(testCase.statusCode);
      expect(res.body).to.include({
        status: testCase.status,
      });
      expect(res.body.error).to.include({
        code: testCase.responseBody.code,
        message: testCase.responseBody.message,
      });
    });
  });

  it("TC04 | should return 400 for identifiantContrat of type boolean(true)", () => {
    const testCase = this.contractsData.find((tc) => tc.testCaseId === "4");
    cy.request({
      method: testCase.method,
      url: testCase.api,
      headers: { Authorization: token },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(testCase.statusCode);
      expect(res.body).to.include({
        status: testCase.status,
      });
      expect(res.body.error).to.include({
        code: testCase.responseBody.code,
        message: testCase.responseBody.message,
      });
    });
  });

  it("TC05 | should return 400 for identifiantContrat of type boolean(false)", () => {
    const testCase = this.contractsData.find((tc) => tc.testCaseId === "5");
    cy.request({
      method: testCase.method,
      url: testCase.api,
      headers: { Authorization: token },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(testCase.statusCode);
      expect(res.body).to.include({
        status: testCase.status,
      });
      expect(res.body.error).to.include({
        code: testCase.responseBody.code,
        message: testCase.responseBody.message,
      });
    });
  });

  it("TC06 | should return 400 for identifiantContrat of type integer", () => {
    const testCase = this.contractsData.find((tc) => tc.testCaseId === "6");
    cy.request({
      method: testCase.method,
      url: testCase.api,
      headers: { Authorization: token },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(testCase.statusCode);
      expect(res.body).to.include({
        status: testCase.status,
      });
      expect(res.body.error).to.include({
        code: testCase.responseBody.code,
        message: testCase.responseBody.message,
      });
    });
  });

  it("TC07 | should return 400 for identifiantContrat with special characters", () => {
    const testCase = this.contractsData.find((tc) => tc.testCaseId === "7");
    cy.request({
      method: testCase.method,
      url: testCase.api,
      headers: { Authorization: token },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(testCase.statusCode);
      expect(res.body).to.include({
        status: testCase.status,
      });
      expect(res.body.error).to.include({
        code: testCase.responseBody.code,
        message: testCase.responseBody.message,
      });
    });
  });

  it("TC08 | should return 400 for identifiantContrat with invalid format", () => {
    const testCase = this.contractsData.find((tc) => tc.testCaseId === "8");
    cy.request({
      method: testCase.method,
      url: testCase.api,
      headers: { Authorization: token },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(testCase.statusCode);
      expect(res.body).to.include({
        status: testCase.status,
      });
      expect(res.body.error).to.include({
        code: testCase.responseBody.code,
        message: testCase.responseBody.message,
      });
    });
  });

  it("TC09 | should return 200 for empty identifiantContrat", () => {
    const testCase = this.contractsData.find((tc) => tc.testCaseId === "9");
    cy.request({
      method: testCase.method,
      url: testCase.api,
      headers: { Authorization: token },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(testCase.statusCode);
      expect(res.body.data.content).to.be.an("array");
      expect(res.body).to.include({
        status: testCase.status,
      });
      // Vérifie chaque contrat
      testCase.responseBody.forEach((expectedContract, index) => {
        expect(res.body.data.content[index]).to.deep.include(expectedContract);
      });
    });
  });
});
