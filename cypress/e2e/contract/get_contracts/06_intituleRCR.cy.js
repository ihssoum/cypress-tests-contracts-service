describe("GET /api/v1/contracts - Recherche par intitulé RCR", () => {
  it("should return contracts for valid intituleRCR", () => {
    const intituleRCR = "Insurance Policy"; // Intitulé RCR valide
    const expectedContracts = [
      //les contrats avec l'intitule RCR mentionne
    ];
    cy.request({
      method: "GET",
      url: `${api}?intituleRCR=${intituleRCR}`,
      headers: { Authorization: token },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.status).to.equal("SUCCESS");
      expect(res.body.data.content).to.be.an("array");
      // Vérifier que chaque contrat contient l'intitulé RCR attendu
      /*res.body.data.content.forEach((contract) => {
        expect(contract.intituleRCR).to.equal(intituleRCR);
      });*/
      expectedContracts.forEach((expectedContract, index) => {
        expect(res.body.data.content[index]).to.deep.include(expectedContract);
      });
    });
  });

  it("should return 404 for non-existent intituleRCR", () => {
    const intituleRCR = "Unknown Title"; // Intitulé RCR inexistant
    cy.request({
      method: "GET",
      url: `${api}?intituleRCR=${intituleRCR}`,
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

  it("should return 400 for intituleRCR too long", () => {
    const intituleRCR = "A".repeat(256); // Intitulé RCR trop long (256 caractères)
    cy.request({
      method: "GET",
      url: `${api}?intituleRCR=${intituleRCR}`,
      headers: { Authorization: token },
      failOnStatusCode: false, // Ne pas échouer le test automatiquement en cas d'erreur
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.status).to.equal("ERROR");
      expect(res.body.codeMessage).to.equal("ERR_GENERAL_0002");
      expect(res.body.error.message).to.equal("Invalid data format.");
    });
  });
});
