describe("Get contract by valid id", () => {
  before(function () {
    // Fetch the contracts and authentication token before the test
    cy.fetchContractById(1050019
      
    ); // Assuming this fetches the contracts
    cy.fixture("getContractByIdResponseSchema.json").as("contractsData"); // Load the contract data fixture
    cy.getToken(); // Get the authentication token
  });

  it("TC01 | Get contract By a valid id", function () {
    // Assuming you have the token saved in @authToken
    cy.get("@authToken").then(function (token) {
      const url = Cypress.env("getContractsUrl"); // The base URL of your API
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "1"); // Find the test case for a valid ID
      
      cy.request({
        method: testCase.method,
        url: `${testCase.api}`, // Construct the full URL using the endpoint from the test case
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the request headers
        },
        failOnStatusCode: false, // Don't fail on status code errors; we'll handle them
      }).then((res) => {
        cy.log(JSON.stringify(res.body)); // Log the response for debugging

        // Assert the status code and other response data
        expect(res.status).to.eq(testCase.statusCode);
        expect(res.body.ResponseWrapperContractDto).to.include({
          status: "SUCCESS",
        });
        expect(res.body.ResponseWrapperContractDto).to.include({
          message: "The contract instance has been successfully retrieved.",
          codeMessage: "SUCCESS_CTR_0004",
        });

        // Verify that the contract data matches the expected response
        expect(res.body.ResponseWrapperContractDto.data).to.deep.include(testCase.responseBody);
      });
    });
  });
});
