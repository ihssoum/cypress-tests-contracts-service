/*describe("GET /api/v1/contracts - Recherche par userId", () => {
  beforeEach(function () {
    cy.fetchContracts();
    cy.fixture("getContracts.json").as("contractsData");
    cy.getToken();
  });

  const url = Cypress.env("getContractsUrl");

  it("TC51 | should return 200 and contracts for valid userId", function () {
    cy.get("@authToken").then((token) => {
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "51");
      cy.request({
        method: testCase.method,
        url: `${url}/${testCase.api}`,
        headers: { Authorization: `Bearer ${token}` },
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
          expect(actualContract.clientAccountManager).to.eq(
            testCase.queryParams.clientAccountManager
          );
        });
      });
    });
  });

*/
