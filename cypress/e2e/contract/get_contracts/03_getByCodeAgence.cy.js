import { api, token } from "../support/config";

describe("GET /api/v1/contracts - Filtrage par code agence (agenceR)", () => {
  before(function () {
    // Fetch contracts before running the tests
    cy.fetchContracts();
    cy.fixture("getContracts.json").as("contractsData");
  });
  it("TC10 | Recherche par code d'agence valide", () => {
    const testCase = this.contractsData.find((tc) => tc.testCaseId === "10");
    cy.request({
      method: testCase.method,
      url: testCase.api,
      headers: { Authorization: token },
    }).then((res) => {
      expect(res.status).to.eq(testCase.statusCode);
      expect(res.body).to.have.property("status", testCase.status);
      expect(res.body.data.content).to.be.an("array");
      testCase.responseBody.forEach((expectedContract, index) => {
        const actualContract = res.body.data.content[index];

        expect(actualContract).to.deep.include(expectedContract);
        expect(actualContract).to.have.property("commercialAgency");
      });
    });
  });

  it("TC11 | Recherche par code agence inexistant", () => {
    const testCase = this.contractsData.find((tc) => tc.testCaseId === "11");
    cy.request({
      method: testCase.method,
      url: testCase.api,
      headers: { Authorization: token },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(testCase.statusCode);
      expect(res.body).to.deep.include({
        status: testCase.status,
        error: {
          code: testCase.responseBody.code,
          message: testCase.responseBody.message,
        },
      });
    });
  });

  it("TC12 | Recherche avec un code agence existant sans contrats associés", () => {
    const testCase = this.contractsData.find((tc) => tc.testCaseId === "12");

    cy.request({
      method: testCase.method,
      url: testCase.api,
      headers: { Authorization: token },
    }).then((res) => {
      expect(res.status).to.eq(testCase.statusCode);
      expect(res.body).to.have.property("status", testCase.status);
      expect(res.body.data.content).to.be.an("array").that.is.empty;
    });
  });
});

it("TC13 | should return 400 for boolean value in agenceR(true)", () => {
  const testCase = this.contractsData.find((tc) => tc.testCaseId === "13");
  cy.request({
    method: testCase.method,
    url: testCase.api,
    headers: { Authorization: token },
    failOnStatusCode: false,
  }).then((res) => {
    expect(res.status).to.eq(testCase.statusCode);
    expect(res.body).to.deep.include({
      status: testCase.status,
    });
    expect(res.body.error).to.include({
      code: testCase.responseBody.code,
      message: testCase.responseBody.message,
    });
  });
});

it("TC14 | should return 400 for boolean value in agenceR(false)", () => {
  const testCase = this.contractsData.find((tc) => tc.testCaseId === "14");
  cy.request({
    method: testCase.method,
    url: testCase.api,
    headers: { Authorization: token },
    failOnStatusCode: false,
  }).then((res) => {
    expect(res.status).to.eq(testCase.statusCode);
    expect(res.body.ResponseWrapperContractListDto).to.deep.include({
      status: testCase.status,
    });
    expect(res.body.error).to.include({
      code: testCase.responseBody.code,
      message: testCase.responseBody.message,
    });
  });
});
it("TC15 | should return 400 for integer value in agenceR", () => {
  const testCase = this.contractsData.find((tc) => tc.testCaseId === "15");
  cy.request({
    method: testCase.method,
    url: testCase.api,
    headers: { Authorization: token },
    failOnStatusCode: false,
  }).then((res) => {
    expect(res.status).to.eq(testCase.statusCode);
    expect(res.body.ResponseWrapperContractListDto).to.deep.include({
      status: testCase.status,
    });
    expect(res.body.error).to.include({
      code: testCase.responseBody.code,
      message: testCase.responseBody.message,
    });
  });
});

it("TC16 | should return 400 for special characters in agenceR", () => {
  const testCase = this.contractsData.find((tc) => tc.testCaseId === "16");
  cy.request({
    method: testCase.method,
    url: testCase.api,
    headers: { Authorization: token },
    failOnStatusCode: false,
  }).then((res) => {
    expect(res.status).to.eq(testCase.statusCode);
    expect(res.body).to.deep.include({
      status: testCase.status,
    });
    expect(res.body.error).to.include({
      code: testCase.responseBody.code,
      message: testCase.responseBody.message,
    });
  });
});
it("TC17 | should return all contracts when agenceR is empty", () => {
  const agenceR = "";
  cy.request({
    method: "GET",
    url: `${api}?agenceR=${agenceR}`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  }).then((res) => {
    expect(res.status).to.eq(200);
    // Vérifier si la réponse est une liste vide ou des contrats en fonction des autres filtres
    expect(res.body.data.content).to.be.an("array");
  });
});
it("should return 400 for extremely long code in agenceR", () => {
  const agenceR = "1234567890123456789012345678901234567890"; // Code agence extrêmement long
  cy.request({
    method: "GET",
    url: `${api}?agenceR=${agenceR}`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  }).then((res) => {
    expect(res.status).to.eq(400);
    expect(res.body).to.deep.include({
      status: "ERROR",
      codeMessage: "ERR_GENERAL_0002",
      error: { message: "Invalid data format." },
    });
  });
});
