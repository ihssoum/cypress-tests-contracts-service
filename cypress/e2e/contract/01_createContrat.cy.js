describe("/api/v1/contracts test suite", () => {
  beforeEach(() => {
    cy.fixture("contracts.json").as("contractData");
  });

  it("TC-85 | Create a contract with valid data and multiple beneficiaries", ()=> {
    const testCase = this.contractData.find((tc) => tc.testCaseId === "85");

    cy.request({
      method: "POST",
      url: "/api/v1/contracts?action=CREATE",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("status", "SUCCESS");
      expect(response.body.data).to.have.property("success", true);
      expect(response.body.data).to.have.property("token");
    });
  });

  it("TC-86 | Create a contract with valid data w/o beneficiaries", ()=> {
    const testCase = this.contractData.find((tc) => tc.testCaseId === "86");

    cy.request({
      method: "POST",
      url: "/api/v1/contracts?action=CREATE",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("status", "SUCCESS");
      expect(response.body.data).to.have.property("success", true);
      expect(response.body.data).to.have.property("token");
    });
  });

  it("TC-87 | Missing action parameter", ()=> {
    const testCase = this.contractData.find((tc) => tc.testCaseId === "87");

    cy.request({
      method: "POST",
      url: "/api/v1/contracts",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("status", "ERROR");
      expect(response.body.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.error).to.have.property(
        "message",
        testCase.responseBody.error.message
      );
    });
  });

  it("TC-88 | Missing customerId", ()=> {
    const testCase = this.contractData.find((tc) => tc.testCaseId === "88");

    cy.request({
      method: "POST",
      url: "/api/v1/contracts?action=CREATE",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("status", "ERROR");
      expect(response.body.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.error).to.have.property(
        "message",
        testCase.responseBody.error.message
      );
    });
  });


  it("TC-91 | Empty beneficiaries array", ()=> {
    const testCase = this.contractData.find((tc) => tc.testCaseId === "91");

    cy.request({
      method: "POST",
      url: "/api/v1/contracts?action=CREATE",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("status", "SUCCESS");
      expect(response.body.data).to.have.property("success", true);
      expect(response.body.data).to.have.property(
        "token",
        testCase.responseBody.data.token
      );
    });
  });

  it("TC-93 | Valid RIB format but non-existent", ()=> {
    const testCase = this.contractData.find((tc) => tc.testCaseId === "93");

    cy.request({
      method: "POST",
      url: "/api/v1/contracts?action=CREATE",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("status", "ERROR");
      expect(response.body.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.error).to.have.property(
        "message",
        testCase.responseBody.error.message
      );
    });
  });

  it("TC-94 | Action UPDATE but customerId does not exist", ()=> {
    const testCase = this.contractData.find((tc) => tc.testCaseId === "94");

    cy.request({
      method: "POST",
      url: "/api/v1/contracts?action=UPDATE",
      body: testCase.requestBody,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("status", "ERROR");
      expect(response.body).to.have.property("error");
      expect(response.body.error).to.have.property(
        "code",
        testCase.responseBody.error.code
      );
      expect(response.body.error).to.have.property(
        "message",
        testCase.responseBody.error.message
      );
    });
  });
});
