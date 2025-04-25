describe('Contracts Test Suite', () => {

    before(function () {
        // Fetch contracts before running the tests
        cy.fetchContracts();
        cy.fixture('contracts.json').as('contractsData');
    });

    it('should verify contracts are fetched successfully', function () {
        //const testCase = this.contractsData.find(tc => tc.testCaseId === 1);

        //cy.log(this.contractsData);
        
        // request:

        // expectations:
        expect(1+1).to.equal(2);
    });

    // Add more test cases as needed
});