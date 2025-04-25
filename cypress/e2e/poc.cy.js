describe('Contracts Test Suite', () => {

    before(() => {
        // Fetch contracts before running the tests
        cy.fetchContracts();
    });

    it('should verify contracts are fetched successfully', () => {
        const testCase = this.contractsData.find(tc => tc.testCaseId === 1);

        console.log(contractsData);
        
        // request:

        // expectations:
        expect(1+1).to.equal(2);
    });

    // Add more test cases as needed
});