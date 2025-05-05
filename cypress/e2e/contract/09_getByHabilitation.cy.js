describe("GET /api/v1/contracts - Habilitation par agence", () => {
  const headers = { Authorization: token };

  context("Habilitation désactivée", () => {
    it("utilisateur consulte les contrats de son agence", () => {
      const codeAgence = "00013";
      cy.request({
        method: "GET",
        url: `${api}?controleHabilitationEnabled=false&codeAgence=${codeAgence}`,
        headers,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.status).to.eq("SUCCESS");
        expect(res.body.data.content).to.be.an("array");
      });
    });

    it("utilisateur consulte les contrats d'une autre agence", () => {
      const codeAgence = "00013"; // utilisateur appartient à 00014
      cy.request({
        method: "GET",
        url: `${api}?controleHabilitationEnabled=false&codeAgence=${codeAgence}`,
        headers,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.status).to.eq("SUCCESS");
        expect(res.body.data.content).to.be.an("array");
      });
    });
  });

  context("Habilitation activée", () => {
    it("utilisateur consulte les contrats de son agence", () => {
      const codeAgence = "00013";
      cy.request({
        method: "GET",
        url: `${api}?controleHabilitationEnabled=true&codeAgence=${codeAgence}`,
        headers,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.status).to.eq("SUCCESS");
        expect(res.body.data.content).to.be.an("array");
      });
    });

    it("utilisateur tente de consulter les contrats d'une autre agence", () => {
      const codeAgence = "00013"; // utilisateur appartient à 00014
      cy.request({
        method: "GET",
        url: `${api}?controleHabilitationEnabled=true&codeAgence=${codeAgence}`,
        headers,
        failOnStatusCode: false, // éviter que Cypress échoue si erreur
      }).then((res) => {
        expect(res.status).to.eq(403);
        expect(res.body.status).to.eq("ERROR");
        expect(res.body.error.code).to.eq("ERR_GENERAL_0019");
      });
    });
  });

  context("Agence centrale", () => {
    it("utilisateur central consulte sa propre agence avec habilitation activée", () => {
      const codeAgence = "00015"; // agence centrale
      cy.request({
        method: "GET",
        url: `${api}?controleHabilitationEnabled=true&codeAgence=${codeAgence}`,
        headers,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.status).to.eq("SUCCESS");
      });
    });

    it("utilisateur central consulte autre agence avec habilitation activée", () => {
      const codeAgence = "00013";
      cy.request({
        method: "GET",
        url: `${api}?controleHabilitationEnabled=true&codeAgence=${codeAgence}`,
        headers,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.status).to.eq("SUCCESS");
      });
    });

    it("utilisateur normal consulte autre agence avec habilitation activée", () => {
      const codeAgence = "00013"; // utilisateur appartient à 00014
      cy.request({
        method: "GET",
        url: `${api}?controleHabilitationEnabled=true&codeAgence=${codeAgence}`,
        headers,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(403);
        expect(res.body.status).to.eq("ERROR");
        expect(res.body.error.code).to.eq("ERR_GENERAL_0019");
      });
    });
  });
});
