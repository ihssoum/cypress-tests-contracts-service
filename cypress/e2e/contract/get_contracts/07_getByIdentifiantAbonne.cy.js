describe("GET /api/v1/contracts - Recherche par identifiantAbonne", () => {
  it("should return contracts for valid identifiantAbonne", () => {
    const identifiantAbonne = 8765437; // IdentifiantAbonne valide
    const expectedContrats = [];
    cy.request({
      method: "GET",
      url: `${api}?identifiantAbonne=${identifiantAbonne}`,
      headers: { Authorization: token },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.status).to.equal("SUCCESS");
      expect(res.body.data.content).to.be.an("array");
      // Vérifier que chaque contrat contient l'identifiantAbonne attendu
      /*res.body.data.content.forEach((contract) => {
          expect(contract.identifiantAbonne).to.equal(identifiantAbonne);
        });*/
    });
  });

  it("should return 404 for non-existent identifiantAbonne", () => {
    const identifiantAbonne = 9999999; // IdentifiantAbonne inexistant
    cy.request({
      method: "GET",
      url: `${api}?identifiantAbonne=${identifiantAbonne}`,
      headers: { Authorization: token },
      failOnStatusCode: false, // Ne pas échouer le test automatiquement en cas d'erreur
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.status).to.equal("ERROR");
      expect(res.body.error.code).to.equal("ERR_GENERAL_0004");
      expect(res.body.error.message).to.equal(
        "The requested resource was not found."
      );
    });
  });
});
