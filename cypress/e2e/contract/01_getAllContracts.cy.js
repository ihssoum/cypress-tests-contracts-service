import { api, token } from "../support/config";

before(function () {
  // Fetch contracts before running the tests
  cy.fetchContracts();
  cy.fixture('getContracts.json').as('contractsData');
});

it("TC01 | Get all contracts without filters", () => {
  const testCase = this.contractsData.find((tc) => tc.testCaseId === "1");
  cy.request({
    method: testCase.method,
    url: testCase.api,
    headers: { Authorization: token },
  }).then((res) => {
    expect(res.status).to.eq(testCase.statusCode);
    expect(res.body.data.content).to.be.an("array");
    expect(res.body).to.include({
      status: "SUCCESS",
    });
    // Vérifie chaque contrat
    testCase.responseBody.forEach((expectedContract, index) => {
      expect(res.body.data.content[index]).to.deep.include(expectedContract);
    });
  });
});
