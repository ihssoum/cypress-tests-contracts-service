describe("GET /api/v1/contracts - Result verification tests", () => {
    beforeEach(function () {
      // Fetch contracts before running the tests
      cy.fetchContracts();
      cy.fixture("getContracts.json").as("contractsData");
      cy.getToken();
    });
  
  
    it("TC54 | verify that version is not null", function () {
      cy.get("@authToken").then((token) => {
        const testCase = this.contractsData.find((tc) => tc.testCaseId === "54");
        cy.request({
          method: testCase.method,
          url: `/${testCase.api}`,
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          expect(res.status).to.eq(testCase.statusCode);
  
          res.body.ResponseWrapperContractListDto.data.content.forEach(
            (contract) => {
              expect(contract.version).to.not.be.null;
            }
          );
        });
      });
    });
    it("TC55 | Verify that every contractIdentifier respect the format B/13CHIFFRES/A", function () {
      cy.get("@authToken").then((token) => {
        const testCase = this.contractsData.find((tc) => tc.testCaseId === "55");
        cy.request({
          method: testCase.method,
          url: `/${testCase.api}`,
          headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
          expect(response.status).to.eq(testCase.statusCode);
          const content =
            response.body.ResponseWrapperContractListDto.data.content;
  
          content.forEach((contract) => {
            expect(contract.contractIdentifier).to.match(/^B\d{13}A$/);
          });
        });
      });
    });
    it("TC56 | should ensure commercialRelationIdentifier does not exceed 8 digits", function () {
      cy.get("@authToken").then((token) => {
        const testCase = this.contractsData.find((tc) => tc.testCaseId === "56");
        cy.request({
          method: testCase.method,
          url: `/${testCase.api}`,
          headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
          expect(response.status).to.eq(testCase.statusCode);
          const content =
            response.body.ResponseWrapperContractListDto.data.content;
  
          content.forEach((contract) => {
            const identifier = contract.commercialRelationIdentifier;
  
            // Must be only digits and max 7 characters long
            expect(identifier).to.match(/^\d{1,8}$/);
          });
        });
      });
    });
  });
  