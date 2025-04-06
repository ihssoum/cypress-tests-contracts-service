Cypress.on('uncaught:exception', (err, runnable) => {
    // Example: If there's a failure during a test, re-login to get a new token
    cy.request({
      method: 'POST',
      url: 'https://api.example.com/login',
      body: {
        username: 'your-username',
        password: 'your-password'
      }
    }).then((response) => {
      const token = response.body.token;
      Cypress.env('authToken', token); // Store the new token
    });
  
    // Returning false here prevents Cypress from failing the test
    return false;
  });
  // Intercept all API requests and add the Authorization header dynamically
cy.intercept('*', 'https://api.example.com/*', (req) => {
    const authToken = Cypress.env('authToken');
    if (authToken) {
      req.headers['Authorization'] = `Bearer ${authToken}`;
    }
  }).as('apiRequests');
  
  // Test making a request to a protected API
  cy.request('GET', 'https://api.example.com/protected-resource')
    .then((response) => {
      expect(response.status).to.eq(200);
    });
  
  