import { contractResponseSchema } from '../fixtures/schemas/contractSchema';  

describe('GET /api/v1/contracts/:id', () => {
  let contractId = 1;  

  before(() => {
    cy.login();  
  });

  it('should return status 200 and a valid schema for contract', () => {
    cy.authRequest({
      method: 'GET',
      url: `/api/v1/contracts/${contractId}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.jsonSchema(contractResponseSchema);

    });
  });
});
