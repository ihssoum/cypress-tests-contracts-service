Cypress.Commands.add("getToken", () => {
  //cy.log("hello 1")
  cy.request({
    method: "POST",
    url: "http://192.168.8.103:9080/auth/realms/standard-adria/protocol/openid-connect/token",
    form: true, // IMPORTANT : indique à Cypress que c’est x-www-form-urlencoded
    body: {
      client_id: "banque-front",
      baseUrl: "http://192.168.8.103:9080/",
      codeBanque: "00004",
      langue: "fr",
      password: "123456",
      username: "abtbo",
      grant_type: "password",
      typeProfil: "BO",
      canal: "Web",
    },
    headers: {
      Origin: "http://192.168.8.103:3000",
      Referer: "http://192.168.8.103:3000/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
    },
    timeout: 60000,
  }).then((response) => {
    const token = response.body.access_token;

    //cy.log(token); // adapte ici : ex. response.body.access_token ?
    cy.wrap(token).as("authToken");
  });
});
