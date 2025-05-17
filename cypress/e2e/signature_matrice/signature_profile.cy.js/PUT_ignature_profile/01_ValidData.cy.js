describe('Création d’un profil signature', () => {
    before(function () {

    cy.fixture("signature_matrice/signature_profile.json").as("profilesData");
   
  });
  it('devrait créer un profil avec des données valides', () => {
       const url = Cypress.env("createProfileUrl");
      const testCase = this.contractsData.find((tc) => tc.testCaseId === "1");
      cy.request({
        method: testCase.method,
        url: `${url}/${testCase.api}`,
        
        failOnStatusCode: false,// utile pour tests de statuts autres que 2xx
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
    });
  });
});
