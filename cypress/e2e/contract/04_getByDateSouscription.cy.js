import { api, token } from "../support/config";

describe("GET /api/v1/contracts - Recherche par dateSouscriptionMaxR et dateSouscriptionMinR", () => {
  const AllContracts = [];
  it("should return 200 for valid dateSouscriptionMaxR", () => {
    const dateSouscriptionMaxR = "2024-12-31";
    const expectedContractsDateMax = [
      //Les contrats avec la date de souscription max mentionnee
    ];

    cy.request({
      method: "GET",
      url: `${api}?dateSouscriptionMaxR=${dateSouscriptionMaxR}`,
      headers: { Authorization: token },
    }).then((res) => {
      expect(res.status).to.eq(200);
      // Vérifier que les contrats ont une date de souscription avant le 31 décembre 2024
      expect(res.body.data.content).to.be.an("array");
      expect(res.body.status).to.be.equal("SUCCESS");
      expectedContractsDateMax.forEach((expectedContract, index) => {
        expect(res.body.data.content[index]).to.deep.include(expectedContract);
      });
    });
  });

  it("should return 400 for dateSouscriptionMaxR with incorrect date format", () => {
    const dateSouscriptionMaxR = "2024/12/31"; // format de date incorrect
    cy.request({
      method: "GET",
      url: `${api}?dateSouscriptionMaxR=${dateSouscriptionMaxR}`,
      headers: { Authorization: token },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.deep.include({
        status: "ERROR",
        codeMessage: "ERR_GENERAL_0002",
        error: { message: "Invalid data format." },
      });
    });
  });

  it("should return 200 for dateSouscriptionMaxR with extreme future date", () => {
    const dateSouscriptionMaxR = "2030-12-31"; // date extrême dans le futur
    cy.request({
      method: "GET",
      url: `${api}?dateSouscriptionMaxR=${dateSouscriptionMaxR}`,
      headers: { Authorization: token },
    }).then((res) => {
      expect(res.status).to.eq(200);
      // Vérifier que la réponse contient tous les contrats existants dans la base de données
      expect(res.body.data.content).to.be.an("array");
      AllContracts.forEach((expectedContract, index) => {
        expect(res.body.data.content[index]).to.deep.include(expectedContract);
      });
    });
  });

  it("should return 400 for dateSouscriptionMaxR with complete date format", () => {
    const dateSouscriptionMaxR = "2025-12-31T23:59:59"; // format complet avec l'heure
    cy.request({
      method: "GET",
      url: `${api}?dateSouscriptionMaxR=${dateSouscriptionMaxR}`,
      headers: { Authorization: token },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.deep.include({
        status: "ERROR",
        codeMessage: "ERR_GENERAL_0002",
        error: { message: "Invalid data format." },
      });
    });
  });
  it("should return 200 for valid dateSouscriptionMaxR", () => {
    const dateSouscriptionMaxR = "2024-12-31";
    const expectedContractsDateMin = [
      //Les contrats avec la date de souscription max mentionnee
    ];

    cy.request({
      method: "GET",
      url: `${api}?dateSouscriptionMaxR=${dateSouscriptionMaxR}`,
      headers: { Authorization: token },
    }).then((res) => {
      expect(res.status).to.eq(200);
      // Vérifier que les contrats ont une date de souscription avant le 31 décembre 2024
      expect(res.body.data.content).to.be.an("array");
      expect(res.body.status).to.be.equal("SUCCESS");
      expectedContractsDateMin.forEach((expectedContract, index) => {
        expect(res.body.data.content[index]).to.deep.include(expectedContract);
      });
    });
  });
  it("should return 200 for valid dateSouscriptionMaxR", () => {
    const dateSouscriptionMaxR = "2024-12-31";
    const expectedContractsDateMin = [
      //Les contrats avec la date de souscription max mentionnee
    ];

    cy.request({
      method: "GET",
      url: `${api}?dateSouscriptionMaxR=${dateSouscriptionMaxR}`,
      headers: { Authorization: token },
    }).then((res) => {
      expect(res.status).to.eq(200);
      // Vérifier que les contrats ont une date de souscription avant le 31 décembre 2024
      expect(res.body.data.content).to.be.an("array");
      expect(res.body.status).to.be.equal("SUCCESS");
      expectedContractsDateMin.forEach((expectedContract, index) => {
        expect(res.body.data.content[index]).to.deep.include(expectedContract);
      });
    });
  });
  it("should return 400 for dateSouscriptionMinR with incorrect date format", () => {
    const dateSouscriptionMinR = "2024/12/31"; // format de date incorrect
    cy.request({
      method: "GET",
      url: `${api}?dateSouscriptionMinR=${dateSouscriptionMinR}`,
      headers: { Authorization: token },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.deep.include({
        status: "ERROR",
        codeMessage: "ERR_GENERAL_0002",
        error: { message: "Invalid data format." },
      });
    });
  });

  it("should return 200 for dateSouscriptionMinR with extreme past date", () => {
    const dateSouscriptionMinR = "1500-12-31"; // date extrême dans le passé
    cy.request({
      method: "GET",
      url: `${api}?dateSouscriptionMinR=${dateSouscriptionMinR}`,
      headers: { Authorization: token },
    }).then((res) => {
      expect(res.status).to.eq(200);
      // Vérifier que la réponse contient tous les contrats existants dans la base de données
      expect(res.body.data.content).to.be.an("array");
      expect(res.body.status).to.be.equal("SUCCESS");
      AllContracts.forEach((expectedContract, index) => {
        expect(res.body.data.content[index]).to.deep.include(expectedContract);
      });
    });
  });
});
it("should return an empty array when no contracts match the dateSouscriptionMinR", () => {
  const dateSouscriptionMinR = "2022-12-31"; // Une date qui ne correspond à aucun contrat dans la base de données

  cy.request({
    method: "GET",
    url: `${api}?dateSouscriptionMinR=${dateSouscriptionMinR}`,
    headers: { Authorization: token },
    failOnStatusCode: false, // Empêche de faire échouer le test en cas de 404
  }).then((res) => {
    expect(res.status).to.eq(200); // Vérifie le statut de la réponse
    expect(res.body.status).to.be.equal("SUCCESS"); // Vérifie que le statut de la réponse est "SUCCESS"
    expect(res.body.data.content).to.be.an("array").that.is.empty; // Vérifie que le tableau de contenu est vide
  });
});
