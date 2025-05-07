describe("GET /api/v1/contracts - Recherche par userId", () => {
  it("doit retourner 200 et une liste de contrats pour un userId valide", () => {
    const userId = "2c91808990a622a50190a79e066d0000";
    const expectedContracts = [
      //
    ];
    cy.request({
      method: "GET",
      url: `${api}?userId=${userId}`,
      headers: { Authorization: token },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.status).to.eq("SUCCESS");
      expect(res.body.data.content).to.be.an("array");

      expectedContracts.forEach((expectedContract, index) => {
        expect(res.body.data.content[index]).to.deep.include(expectedContract);
        expect(res.body.data.content.clientAccountManager).to.equal(userId);
      });
    });
  });
});
