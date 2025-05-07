describe("GET /api/v1/contracts - Recherche par identifiantRC", () => {
  it("should return contracts for valid identifiantRC", () => {
    const identifiantRC = "2755966"; // Identifiant RC valide
    cy.request({
      method: "GET",
      url: `${api}?identifiantRC=${identifiantRC}`,
      headers: { Authorization: token },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.status).to.equal("SUCCESS");
      expect(res.body.data.content).to.be.an("array");
      // Vérifier qu'un contrat contient l'identifiant RC attendu
      res.body.data.content.forEach((contract) => {
        expect(contract.commercialRelationIdentifier).to.equal(identifiantRC);
      });
    });
  });

  it("should return 400 for invalid identifiantRC with special characters", () => {
    const identifiantRC = "12@456"; // Identifiant RC invalide avec des caractères spéciaux
    cy.request({
      method: "GET",
      url: `${api}?identifiantRC=${identifiantRC}`,
      headers: { Authorization: token },
      failOnStatusCode: false, // Ne pas échouer le test automatiquement en cas d'erreur
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.status).to.equal("ERROR");
      expect(res.body.codeMessage).to.equal("ERR_GENERAL_0002");
      expect(res.body.error.message).to.equal("Invalid data format.");
    });
  });

  it("should return 400 for identifiantRC too long", () => {
    const identifiantRC = "1234567808760887565433255789"; // Identifiant RC trop long
    cy.request({
      method: "GET",
      url: `${api}?identifiantRC=${identifiantRC}`,
      headers: { Authorization: token },
      failOnStatusCode: false, // Ne pas échouer le test automatiquement en cas d'erreur
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.status).to.equal("ERROR");
      expect(res.body.codeMessage).to.equal("ERR_GENERAL_0002");
      expect(res.body.error.message).to.equal("Invalid data format.");
    });
  });

  it("should return 404 for non-existent identifiantRC", () => {
    const identifiantRC = "999999"; // Identifiant RC inexistant
    cy.request({
      method: "GET",
      url: `${api}?identifiantRC=${identifiantRC}`,
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
