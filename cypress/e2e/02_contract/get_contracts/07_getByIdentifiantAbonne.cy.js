describe("GET /api/v1/contracts - Recherche par identifiantAbonne", () => {
    beforeEach(function () {
      cy.fetchContracts();
      cy.fixture("getContracts.json").as("contractsData");
      cy.getToken();
    });
  
  
    it("TC47 | should return 200 and contracts for valid identifiantAbonne", function () {
      cy.get("@authToken").then((token) => {
        const testCase = this.contractsData.find((tc) => tc.testCaseId === "47");
        cy.request({
          method: testCase.method,
          url: `/${testCase.api}`,
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
            expect(actualContract.identifiantAbonne).to.eq(
              testCase.queryParams.identifiantAbonne
            );
          });
        });
      });
    });
  
    it("TC48 | should return 200 with empty result for non-existent identifiantAbonne", function () {
      cy.get("@authToken").then((token) => {
        const testCase = this.contractsData.find((tc) => tc.testCaseId === "48");
        cy.request({
          method: testCase.method,
          url: `/${testCase.api}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(testCase.statusCode);
          expect(res.body.ResponseWrapperContractListDto.status).to.eq(
            testCase.status
          );
          expect(res.body.ResponseWrapperContractListDto.data.content)
            .to.be.an("array")
            .and.to.have.length(0);
        });
      });
    });
  });
  