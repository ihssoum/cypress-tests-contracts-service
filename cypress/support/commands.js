Cypress.Commands.add('login', () => {
  return cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: {
      username: 'testuser', // A changer 
      password: 'testpassword'
    },
  }).then((resp) => {
    const token = resp.body.token; // faux encore adapter selon la structure de la réponse
    Cypress.env('authToken', token);
    return token;
  });
});
