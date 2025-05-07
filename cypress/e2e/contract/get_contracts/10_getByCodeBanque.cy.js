describe("GET /api/v1/contracts - Code Banque", () => {
  const headers = { Authorization: token };

  // Cas du Code Banque valide
  it("code banque valide - 00004", () => {
    const codeBanque = "00004";
    cy.request({
      method: "GET",
      url: `${api}?codeBanque=${codeBanque}`,
      headers,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.status).to.eq("SUCCESS");
      expect(res.body.data.content).to.be.an("array");
      expect(res.body.data.content[0]).to.have.property(
        "associatedBankCode",
        "00004"
      );
    });
  });

  // Cas du Code Banque inexistant
  it("code banque inexistant - 12345", () => {
    const codeBanque = "12345";
    cy.request({
      method: "GET",
      url: `${api}?codeBanque=${codeBanque}`,
      headers,
      failOnStatusCode: false, // éviter que Cypress échoue si erreur
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.status).to.eq("ERROR");
      expect(res.body.error.code).to.eq("ERR_GENERAL_0004");
      expect(res.body.error.message).to.eq(
        "The requested resource was not found."
      );
    });
  });

  // Cas du Code Banque invalide
  it("code banque invalide - 12345", () => {
    const codeBanque = "12345"; // code invalide avec un mauvais format
    cy.request({
      method: "GET",
      url: `${api}?codeBanque=${codeBanque}`,
      headers,
      failOnStatusCode: false, // éviter que Cypress échoue si erreur
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.status).to.eq("ERROR");
      expect(res.body.codeMessage).to.eq("ERR_GENERAL_0002");
      expect(res.body.error.message).to.eq("Invalid data format.");
    });
  });
});
